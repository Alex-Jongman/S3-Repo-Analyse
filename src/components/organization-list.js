import { LitElement, html, css } from 'lit';
import { fetchUserOrganizations } from '../services/github-organization-service.js';
import './organization-list-item.js';

/**
 * Web component for displaying the user's GitHub organizations as a list.
 * Delegates rendering of each item to organization-list-item.
 *
 * @element organization-list
 */
export class OrganizationList extends LitElement {
  static properties = {
    organizations: { type: Array },
    error: { type: String },
    selectedOrg: { type: String },
    githubToken: { type: String }
  };

  static styles = [
    css`
      :host {
        display: block;
        padding: 8px;
        box-sizing: border-box;
      }
      .list-container {
        display: grid;
        grid-template-columns: 1fr; /* Ensure a single column layout */
        gap: 2px; /* Spacing between items */
        padding: 4px;
        border-radius: 4px;
        background: var(--mdui-color-surface, #fff);
      }
      .error { 
        color: var(--mdui-color-error, #d32f2f);
        padding: 8px;
        margin: 8px 0;
        border-radius: 4px;
        background: var(--mdui-color-error-container, #fde7e7);
      }
      .mdui-typo { 
        margin: 8px 0;
        padding: 8px;
        color: var(--mdui-color-on-surface-variant, #666);
      }
    `
  ];

  constructor() {
    super();
    this.organizations = [];
    this.error = '';
    this.selectedOrg = '';
    this.githubToken = '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.githubToken) {
      this.loadOrganizations();
    }
  }

  updated(changedProps) {
    if (changedProps.has('githubToken')) {
      if (this.githubToken) {
        this.loadOrganizations();
      }
    }
  }

  async loadOrganizations() {
    if (!this.githubToken) {
      this.organizations = [];
      this.error = 'GitHub token is missing.';
      return;
    }
    try {
      this.organizations = await fetchUserOrganizations(this.githubToken);
      this.error = '';
    } catch (err) {
      this.organizations = [];
      this.error = err.message;
    }
  }

  /**
   * Handles bubbling org-selected event from item and re-dispatches it.
   */
  handleOrgSelected(event) {
    this.selectedOrg = event.detail.org;
    this.dispatchEvent(new CustomEvent('org-selected', {
      detail: { org: event.detail.org },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }
    if (!this.organizations.length) {
      return html`<div class="mdui-typo">No organizations found.</div>`;
    }
    return html`
      <div class="list-container">
        ${this.organizations.map(org => html`
          <organization-list-item
            .organization=${org}
            .selected=${this.selectedOrg === org.login}
            @org-selected=${this.handleOrgSelected}
          ></organization-list-item>
        `)}
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('organization-list', OrganizationList);
