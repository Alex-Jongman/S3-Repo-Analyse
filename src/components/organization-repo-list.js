// src/components/organization-repo-list.js
import { LitElement, html, css } from 'lit';
import { fetchOrganizationRepositories } from '../services/github-organization-service.js';
import './organization-repo-list-item.js';
import './pull-request-list.js';

/**
 * Web component for displaying repositories of a selected GitHub organization.
 * Data is fetched via the github-organization-service.
 *
 * @element organization-repo-list
 */
export class OrganizationRepoList extends LitElement {
  static properties = {
    org: { type: String },
    repositories: { type: Array },
    error: { type: String },
    githubToken: { type: String },
    selectedRepo: { type: String }
  };

  static styles = [
    css`
      :host {
        display: block;
      }
      .error {
        color: var(--mdui-color-error, #d32f2f);
      }
      .mdui-typo {
        margin: 8px 0;
      }
      .repo-list {
        list-style: none;
        padding: 0;
        margin: 0 0 16px 0;
      }
      /* The following styles are for MDUI/third-party content only */
      .mdui-list-item {
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.15s, color 0.15s, border 0.15s;
        display: block;
        padding: 4px 8px;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        border: 2px solid transparent;
        background: none;
        outline: none;
        min-width: 180px;
      }
      .mdui-list-item:hover, .mdui-list-item:focus {
        background: var(--mdui-color-primary-light, #e3f2fd);
        color: var(--mdui-color-primary, #1976d2);
        border-color: var(--mdui-color-primary, #1976d2);
        cursor: pointer;
      }
      .mdui-list-item.selected {
        background: var(--mdui-color-primary-light, #e3f2fd);
        border-color: var(--mdui-color-primary, #1976d2);
        color: var(--mdui-color-primary, #1976d2);
      }
      .mdui-list-item-icon {
        margin-right: 8px;
        color: var(--mdui-color-primary, #1976d2);
        vertical-align: middle;
      }
      .mdui-list-item-content {
        vertical-align: middle;
      }
    `
  ];

  constructor() {
    super();
    this.org = '';
    this.repositories = [];
    this.error = '';
    this.githubToken = '';
    this.selectedRepo = '';
  }

  updated(changedProps) {
    if (changedProps.has('org') || changedProps.has('githubToken')) {
      this.loadRepositories();
    }
  }

  /**
   * Loads the repositories for the selected organization.
   * Uses the GitHub token passed as a property.
   * @returns {Promise<void>}
   */
  async loadRepositories() {
    if (!this.org || !this.githubToken) {
      this.repositories = [];
      this.error = '';
      return;
    }
    try {
      const repos = await fetchOrganizationRepositories(this.org, this.githubToken);
      this.repositories = [...repos].sort((a, b) => a.name.localeCompare(b.name));
      this.error = '';
    } catch (err) {
      this.repositories = [];
      this.error = err.message;
    }
  }

  /**
   * Handles bubbling repo-selected event from item and sets selectedRepo.
   */
  handleRepoSelected(event) {
    this.selectedRepo = event.detail.repo;
    this.dispatchEvent(new CustomEvent('repo-selected', {
      detail: { repo: this.selectedRepo },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Renders the list of repositories for the selected organization.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }
    if (!this.org) {
      return html`<div class="mdui-typo">Select an organization to view its repositories.</div>`;
    }
    if (!this.repositories.length) {
      return html`<div class="mdui-typo">No repositories found for this organization.</div>`;
    }
    return html`
      <section class="repo-list mdui-list" style="display: grid; grid-template-areas: 'repo-list'; gap: 2px;">
        ${this.repositories.map(repo => html`
          <organization-repo-list-item
            .repository=${repo}
            .selected=${this.selectedRepo === repo.name}
            @repo-selected=${this.handleRepoSelected}
          ></organization-repo-list-item>
        `)}
      </section>
    `;
  }

  /**
   * Render in the light DOM so MDUI can style elements correctly.
   */
  createRenderRoot() {
    return this;
  }
}

customElements.define('organization-repo-list', OrganizationRepoList);
