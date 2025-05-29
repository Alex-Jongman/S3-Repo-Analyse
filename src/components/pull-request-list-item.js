import { LitElement, html, css } from 'lit';
import './pull-request-file-type-chart.js';

/**
 * Web component for rendering a single pull request item.
 *
 * @element pull-request-list-item
 * @property {Object} pr - The pull request object
 * @property {String} state - The PR state ('open' or 'closed')
 */
export class PullRequestListItem extends LitElement {
  static properties = {
    pr: { type: Object },
    state: { type: String }
  };

  static styles = [
    css`
      :host { display: list-item; }
      .pr-title {
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
      .chart-container {
        margin-top: 8px;
      }
    `
  ];

  /**
   * Render a single PR item, including chart if available.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    const { pr, state } = this;
    if (!pr) return html``;
    const chartId = `chart-${state}-${pr.number}`;
    return html`
      <li class="mdui-list-item">
        <span class="pr-title">${pr.title}</span>
        <span class="pr-user">#${pr.number}</span>
        ${pr.fileTypeStats && Object.keys(pr.fileTypeStats).length > 0 ? html`
          <div class="chart-container">
            <pull-request-file-type-chart
              .fileTypeStats=${pr.fileTypeStats}
              .chartId=${chartId}
            ></pull-request-file-type-chart>
          </div>
        ` : ''}
      </li>
    `;
  }
}

customElements.define('pull-request-list-item', PullRequestListItem);
