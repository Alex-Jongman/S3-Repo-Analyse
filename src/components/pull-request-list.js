// filepath: src/components/pull-request-list.js
import { LitElement, html, css } from 'lit';
import { fetchRepositoryPullRequests } from '../services/github-pull-request-service.js';
import Chart from 'chart.js/auto';

/**
 * Web component for displaying a list of pull requests for a repository.
 *
 * @element pull-request-list
 * @property {String} org - The organization login name.
 * @property {String} repo - The repository name.
 * @property {String} githubToken - The GitHub token for authentication.
 */
export class PullRequestList extends LitElement {
  static properties = {
    org: { type: String },
    repo: { type: String },
    githubToken: { type: String },
    pullRequests: { type: Array },
    error: { type: String }
  };

  static styles = [
    css`
      :host {
        display: block;
        margin-top: 16px;
      }
      .error {
        color: var(--mdui-color-error, #d32f2f);
        margin-bottom: 8px;
      }
      .mdui-list {
        background: var(--mdui-color-surface, #fff);
        border-radius: 4px;
        padding: 0;
      }
      .mdui-list-item {
        display: flex;
        align-items: center;
        padding: 10px 16px;
        border-bottom: 1px solid #eee;
        font-size: 1rem;
      }
      .mdui-list-item:last-child {
        border-bottom: none;
      }
      .pr-title {
        flex: 1 1 0%;
        font-weight: 500;
        color: var(--mdui-color-primary, #1976d2);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pr-user {
        color: var(--mdui-color-on-surface-variant, #666);
        margin-left: 16px;
        font-size: 0.95em;
      }
    `
  ];

  constructor() {
    super();
    this.org = '';
    this.repo = '';
    this.githubToken = '';
    this.pullRequests = [];
    this.error = '';
  }

  /**
   * Loads pull requests and their file stats for the selected repository.
   * @returns {Promise<void>}
   */
  async loadPullRequests() {
    if (!this.org || !this.repo || !this.githubToken) {
      this.pullRequests = [];
      this.error = '';
      return;
    }
    try {
      // Fetch all pull requests, not just open ones
      const prs = await fetchRepositoryPullRequests(this.org, this.repo, this.githubToken, { state: 'all' });
      // For each PR, fetch its files and stats
      const prsWithFiles = await Promise.all(prs.map(async pr => {
        try {
          const res = await fetch(`https://api.github.com/repos/${this.org}/${this.repo}/pulls/${pr.number}/files`, {
            headers: {
              'Authorization': `token ${this.githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (!res.ok) return { ...pr, files: [] };
          const files = await res.json();
          // Group by filetype and sum additions/deletions
          const fileTypeStats = {};
          for (const file of files) {
            const ext = file.filename.split('.').pop() || 'other';
            if (!fileTypeStats[ext]) fileTypeStats[ext] = { count: 0, additions: 0, deletions: 0 };
            fileTypeStats[ext].count++;
            fileTypeStats[ext].additions += file.additions;
            fileTypeStats[ext].deletions += file.deletions;
          }
          return { ...pr, files, fileTypeStats };
        } catch {
          return { ...pr, files: [], fileTypeStats: {} };
        }
      }));
      this.pullRequests = prsWithFiles;
      this.error = '';
    } catch (err) {
      this.pullRequests = [];
      this.error = err.message;
    }
  }

  /**
   * Groups pull requests by state (open/closed) and by user login.
   * @returns {Object} { open: { [user]: [prs] }, closed: { [user]: [prs] } }
   */
  getGroupedPRs() {
    const grouped = { open: {}, closed: {} };
    for (const pr of this.pullRequests) {
      const state = pr.state === 'open' ? 'open' : 'closed';
      const user = pr.user?.login || 'unknown';
      if (!grouped[state][user]) grouped[state][user] = [];
      grouped[state][user].push(pr);
    }
    return grouped;
  }

  /**
   * Returns an array of { user, count } for closed PRs, sorted descending by count.
   */
  getClosedPRCountsByUser() {
    const grouped = this.getGroupedPRs();
    const counts = Object.entries(grouped.closed).map(([user, prs]) => ({ user, count: prs.length }));
    return counts.sort((a, b) => b.count - a.count);
  }

  /**
   * Renders a Chart.js bar chart for file type changes in a PR.
   * @param {Object} fileTypeStats
   * @param {string} chartId
   * @returns {import('lit').TemplateResult}
   */
  renderFileTypeChart(fileTypeStats, chartId) {
    // Use a deterministic id for each canvas
    return html`<canvas id="${chartId}" height="80" data-chart="${chartId}"></canvas>`;
  }

  /**
   * After the component is updated, render all charts for visible PRs.
   */
  updated(changedProps) {
    if (changedProps.has('org') || changedProps.has('repo') || changedProps.has('githubToken')) {
      this.loadPullRequests();
    }
    // Render charts after DOM is updated
    this.renderCharts();
  }

  /**
   * Render all file type charts for visible PRs.
   */
  renderCharts() {
    if (!this.pullRequests) return;
    if (!this._chartInstances) this._chartInstances = {};
    setTimeout(() => {
      for (const pr of this.pullRequests) {
        if (pr.fileTypeStats && Object.keys(pr.fileTypeStats).length > 0) {
          // Find the canvas for open and closed PRs by data attribute
          const openSelector = `canvas[data-chart=chart-open-${pr.number}]`;
          const closedSelector = `canvas[data-chart=chart-closed-${pr.number}]`;
          [openSelector, closedSelector].forEach(selector => {
            // Use this.querySelector to scope to the component
            const ctx = this.querySelector(selector);
            if (ctx) {
              if (this._chartInstances[ctx.id]) {
                this._chartInstances[ctx.id].destroy();
                delete this._chartInstances[ctx.id];
              }
              const labels = Object.keys(pr.fileTypeStats);
              const additions = labels.map(ext => pr.fileTypeStats[ext].additions);
              const deletions = labels.map(ext => pr.fileTypeStats[ext].deletions);
              this._chartInstances[ctx.id] = new Chart(ctx, {
                type: 'bar',
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'Additions',
                      data: additions,
                      backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    },
                    {
                      label: 'Deletions',
                      data: deletions,
                      backgroundColor: 'rgba(244, 67, 54, 0.7)',
                    }
                  ]
                },
                options: {
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    title: { display: false }
                  },
                  scales: {
                    x: { title: { display: true, text: 'File Type' } },
                    y: { title: { display: true, text: 'Lines Changed' }, beginAtZero: true }
                  }
                }
              });
            }
          });
        }
      }
    }, 0);
  }

  /**
   * Renders the list of pull requests.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }
    if (!this.org || !this.repo) {
      return html`<div class="mdui-typo">Select a repository to view its pull requests.</div>`;
    }
    if (!this.pullRequests.length) {
      return html`<div class="mdui-typo">No pull requests found for this repository.</div>`;
    }
    const grouped = this.getGroupedPRs();
    const closedCounts = this.getClosedPRCountsByUser();
    return html`
      <section class="mdui-list">
        <h3 class="mdui-typo" style="margin-top:16px;">Open Pull Requests</h3>
        ${Object.keys(grouped.open).length === 0 ? html`<div class="mdui-typo">None</div>` : ''}
        ${Object.entries(grouped.open).map(([user, prs]) => html`
          <div style="margin-bottom:12px;">
            <div class="mdui-typo" style="font-weight:500; color:#1976d2; margin-bottom:4px;">${user}</div>
            <ul class="mdui-list" style="margin:0;">
              ${prs.map(pr => {
                const chartId = `chart-open-${pr.number}`;
                return html`
                  <li class="mdui-list-item">
                    <span class="pr-title">${pr.title}</span>
                    <span class="pr-user">#${pr.number}</span>
                    ${pr.fileTypeStats && Object.keys(pr.fileTypeStats).length > 0 ? html`
                      <div style="margin-top:8px;">
                        ${this.renderFileTypeChart(pr.fileTypeStats, chartId)}
                      </div>
                    ` : ''}
                  </li>
                `;
              })}
            </ul>
          </div>
        `)}
        <h3 class="mdui-typo" style="margin-top:24px;">Closed Pull Requests</h3>
        ${Object.keys(grouped.closed).length === 0 ? html`<div class="mdui-typo">None</div>` : ''}
        ${Object.entries(grouped.closed).map(([user, prs]) => html`
          <div style="margin-bottom:12px;">
            <div class="mdui-typo" style="font-weight:500; color:#1976d2; margin-bottom:4px;">${user}</div>
            <ul class="mdui-list" style="margin:0;">
              ${prs.map(pr => {
                const chartId = `chart-closed-${pr.number}`;
                return html`
                  <li class="mdui-list-item">
                    <span class="pr-title">${pr.title}</span>
                    <span class="pr-user">#${pr.number}</span>
                    ${pr.fileTypeStats && Object.keys(pr.fileTypeStats).length > 0 ? html`
                      <div style="margin-top:8px;">
                        ${this.renderFileTypeChart(pr.fileTypeStats, chartId)}
                      </div>
                    ` : ''}
                  </li>
                `;
              })}
            </ul>
          </div>
        `)}
        <h4 class="mdui-typo" style="margin-top:32px;">Closed PRs by Initiator</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:12px; margin-bottom:24px;">
          ${closedCounts.map(({ user, count }) => html`
            <div style="background:#f5f5f5; border-radius:6px; padding:12px; text-align:center;">
              <div style="font-weight:600; color:#1976d2;">${user}</div>
              <div style="font-size:1.3em; font-weight:700; margin-top:4px;">${count}</div>
              <div style="font-size:0.95em; color:#888;">closed PRs</div>
            </div>
          `)}
        </div>
      </section>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('pull-request-list', PullRequestList);
