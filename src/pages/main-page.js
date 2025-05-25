// src/pages/main-page.js
import { LitElement, html, css } from 'lit';
import '../components/organization-list.js';
import '../components/organization-repo-list.js';
import '../components/pull-request-list.js';
import 'mdui/components/icon.js';

/**
 * Main page component responsible for rendering the organization selection and repository list.
 *
 * @element main-page
 */
export class MainPage extends LitElement {
  static properties = {
    selectedOrg: { type: String },
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
    this.githubToken = import.meta.env.VITE_GITHUB_TOKEN || '';
  }

  /**
   * Handles organization selection from the organization-list component.
   * @param {CustomEvent} event
   */
  handleOrgSelected(event) {
    this.selectedOrg = event.detail.org;
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
          <h2>Repositories</h2>
          <organization-repo-list .org=${this.selectedOrg} .githubToken=${this.githubToken}></organization-repo-list>
          <h2>Pull Requests</h2>
          <pull-request-list .org=${this.selectedOrg} .githubToken=${this.githubToken}></pull-request-list>
        </section>
      </main>
    `;
  }
}

customElements.define('main-page', MainPage);
