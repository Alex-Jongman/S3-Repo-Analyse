// filepath: src/components/pull-request-list.js
import { LitElement, html, css } from 'lit';
import { fetchRepositoryPullRequests } from '../services/github-pull-request-service.js';

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

  updated(changedProps) {
    if (changedProps.has('org') || changedProps.has('repo') || changedProps.has('githubToken')) {
      this.loadPullRequests();
    }
  }

  /**
   * Loads pull requests for the selected repository.
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
      this.pullRequests = await fetchRepositoryPullRequests(this.org, this.repo, this.githubToken, { state: 'all' });
      this.error = '';
    } catch (err) {
      this.pullRequests = [];
      this.error = err.message;
    }
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
    return html`
      <ul class="mdui-list">
        ${this.pullRequests.map(pr => html`
          <li class="mdui-list-item">
            <span class="pr-title">${pr.title}</span>
            <span class="pr-user">by ${pr.user?.login || 'unknown'}</span>
          </li>
        `)}
      </ul>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('pull-request-list', PullRequestList);
