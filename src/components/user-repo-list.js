import { LitElement, html, css } from 'lit';
import { fetchUserRepositories } from '../services/github-api-service.js';

/**
 * Web component for displaying GitHub repositories of a user.
 * Data is fetched via the githubApiService.
 *
 * @element user-repo-list
 */
export class UserRepoList extends LitElement {
  static properties = {
    username: { type: String },
    repositories: { type: Array },
    error: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }
    .error {
      color: var(--mdui-color-error, #d32f2f);
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin-bottom: 8px;
    }
    /* Only style internal tags for MDUI/third-party content if needed */
  `;

  constructor() {
    super();
    // Use the username from the environment variable as default
    this.username = import.meta.env.VITE_GITHUB_USERNAME || '';
    this.repositories = [];
    this.error = '';
  }

  /**
   * Fetch repositories when username changes.
   * @param {Map} changedProps - The changed properties.
   */
  updated(changedProps) {
    if (changedProps.has('username')) {
      this.loadRepositories();
    }
  }

  /**
   * Loads the repositories of the user via the service.
   * Uses the GitHub token from the environment variable.
   * @returns {Promise<void>}
   */
  async loadRepositories() {
    if (!this.username || !import.meta.env.VITE_GITHUB_TOKEN) {
      this.repositories = [];
      this.error = '';
      return;
    }
    try {
      this.repositories = await fetchUserRepositories(this.username, import.meta.env.VITE_GITHUB_TOKEN);
      this.error = '';
    } catch (err) {
      this.repositories = [];
      this.error = err.message;
    }
  }

  /**
   * Renders the component UI.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    return html`
      <div>
        <h3>Repositories of ${this.username}</h3>
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
        <ul>
          ${this.repositories.map(repo => html`<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`)}
        </ul>
      </div>
    `;
  }
}

customElements.define('user-repo-list', UserRepoList);
