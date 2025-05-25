// src/pages/main-page.js
import { LitElement, html, css } from 'lit';
import '../components/organization-repo-list.js';
import '../components/organization-list.js';

/**
 * Header component for displaying the selected organization and repository.
 *
 * @element selection-header
 * @property {String} org - The selected organization login.
 * @property {String} repo - The selected repository name.
 */
class SelectionHeader extends LitElement {
  static properties = {
    org: { type: String },
    repo: { type: String }
  };
  static styles = css`
    .header {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--mdui-color-primary, #1976d2);
      margin-bottom: 12px;
      margin-top: 8px;
      letter-spacing: 0.01em;
    }
    .header b {
      color: var(--mdui-color-primary, #1976d2);
    }
  `;
  render() {
    if (!this.org) return '';
    return html`
      <div class="header">
        Organization: <b>${this.org}</b>
        ${this.repo ? html` | Repository: <b>${this.repo}</b>` : ''}
      </div>
    `;
  }
  createRenderRoot() { return this; }
}
customElements.define('selection-header', SelectionHeader);

/**
 * Main page component responsible for rendering the organization selection and repository list.
 *
 * @element main-page
 */
export class MainPage extends LitElement {
  static properties = {
    selectedOrg: { type: String },
    selectedRepo: { type: String },
    githubToken: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      padding: 0;
      margin: 0;
      font-family: var(--mdui-typography-font-family, Roboto, Arial, sans-serif);
      background: var(--mdui-color-background, #fafafa);
      min-height: 100vh;
    }
    main {
      display: grid;
      grid-template-columns: 360px 1fr;
      grid-template-areas: 'sidebar main-content';
      min-height: 100vh;
    }
    aside {
      grid-area: sidebar;
      background: #fff;
      box-shadow: 2px 0 8px rgba(0,0,0,0.04);
      border-right: 1px solid #eee;
      display: grid;
      grid-template-rows: auto 1fr;
      min-width: 260px;
      width: 360px;
      max-width: 420px;
    }
    header {
      padding: 20px 16px 8px 16px;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--mdui-color-primary, #1976d2);
      border-bottom: 1px solid #eee;
    }
    section {
      grid-area: main-content;
      padding: 32px 24px;
      background: var(--mdui-color-background, #fafafa);
      min-width: 0;
      display: grid;
      grid-auto-rows: min-content;
      row-gap: 16px;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 24px;
      color: var(--mdui-color-primary, #1976d2);
    }
  `;

  constructor() {
    super();
    this.selectedOrg = '';
    this.selectedRepo = '';
    this.githubToken = import.meta.env.VITE_GITHUB_TOKEN || '';
  }

  /**
   * Handles organization selection from the organization-list component.
   * @param {CustomEvent} event
   */
  handleOrgSelected(event) {
    this.selectedOrg = event.detail.org;
    this.selectedRepo = '';
  }

  /**
   * Handles repository selection from the organization-repo-list component.
   * @param {CustomEvent} event
   */
  handleRepoSelected(event) {
    this.selectedRepo = event.detail.repo;
  }

  /**
   * Renders the main page layout with organization selection and repo list.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    return html`
      <main>
        <aside>
          <header>Organizations</header>
          <organization-list
            .selectedOrg=${this.selectedOrg}
            .githubToken=${this.githubToken}
            @org-selected=${this.handleOrgSelected}
          ></organization-list>
        </aside>
        <section>
          <selection-header .org=${this.selectedOrg} .repo=${this.selectedRepo}></selection-header>
          <h2>Repositories</h2>
          <organization-repo-list
            .org=${this.selectedOrg}
            .githubToken=${this.githubToken}
            .selectedRepo=${this.selectedRepo}
            @repo-selected=${this.handleRepoSelected}
          ></organization-repo-list>
        </section>
      </main>
    `;
  }
}

customElements.define('main-page', MainPage);
