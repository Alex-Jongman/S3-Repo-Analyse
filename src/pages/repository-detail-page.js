import { LitElement, html, css } from 'lit';
import 'mdui/components/icon.js';
import '@mdui/icons/backspace.js';
import '../components/pull-request-list.js';

/**
 * Page component for displaying details of a selected organization and repository.
 *
 * @element repository-detail-page
 * @property {String} org - The selected organization login name.
 * @property {String} repo - The selected repository name.
 * @property {Function} onBack - Callback for back navigation.
 */
export class RepositoryDetailPage extends LitElement {
  static properties = {
    org: { type: String },
    repo: { type: String },
    githubToken: { type: String },
    onBack: { type: Function }
  };

  static styles = [
    css`
      :host {
        display: block;
        padding: 24px;
      }
      .header {
        display: grid;
        grid-template-areas: 'back title';
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
      }
      .back-btn {
        grid-area: back;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background 0.2s;
      }
      .back-btn:hover {
        background: var(--mdui-color-primary-light, #e3f2fd);
      }
      .title {
        grid-area: title;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--mdui-color-primary, #1976d2);
      }
      .info {
        margin-top: 16px;
        font-size: 1.1rem;
        color: var(--mdui-color-on-surface-variant, #666);
      }
    `
  ];

  /**
   * Handles the back button click event.
   */
  handleBack() {
    if (typeof this.onBack === 'function') {
      this.onBack();
    } else {
      this.dispatchEvent(new CustomEvent('navigate-back', { bubbles: true, composed: true }));
    }
  }

  render() {
    return html`
      <main>
        <section class="header">
          <button class="back-btn mdui-btn mdui-btn-icon" @click="${this.handleBack}" aria-label="Back">
            <mdui-icon-backspace></mdui-icon-backspace>
          </button>
          <span class="title">${this.org} / ${this.repo}</span>
        </section>
        <section class="info">
          <div>Organization: <strong>${this.org}</strong></div>
          <div>Repository: <strong>${this.repo}</strong></div>
        </section>
        <pull-request-list
          .org=${this.org}
          .repo=${this.repo}
          .githubToken=${this.githubToken}
        ></pull-request-list>
      </main>
    `;
  }
}

customElements.define('repository-detail-page', RepositoryDetailPage);
