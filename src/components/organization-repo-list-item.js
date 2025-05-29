// filepath: src/components/organization-repo-list-item.js
import { LitElement, html, css } from 'lit';

/**
 * Web component for displaying a single repository in an organization repo list.
 *
 * @element organization-repo-list-item
 * @property {Object} repository - The repository object to display.
 * @property {Boolean} selected - Whether this item is selected.
 */
export class OrganizationRepoListItem extends LitElement {
  static properties = {
    repository: { type: Object },
    selected: { type: Boolean }
  };

  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
      }
      .repo-row {
        display: grid;
        grid-template-areas: 'repo-name';
        align-items: center;
        gap: 10px;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, border 0.15s;
        font-weight: 500;
        border: 2px solid transparent;
        background: none;
        outline: none;
        min-width: 0;
        margin-bottom: 2px;
      }
      .repo-row:hover, .repo-row:focus {
        background: var(--mdui-color-primary-light, #e3f2fd);
        color: var(--mdui-color-primary, #1976d2);
        border-color: var(--mdui-color-primary, #1976d2);
      }
      :host([selected]) .repo-row {
        background: var(--mdui-color-primary-light, #e3f2fd);
        border-color: var(--mdui-color-primary, #1976d2);
        color: var(--mdui-color-primary, #1976d2);
      }
      .repo-name {
        grid-area: repo-name;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `
  ];

  handleClick() {
    this.dispatchEvent(new CustomEvent('repo-selected', {
      detail: { repo: this.repository.name },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <section class="repo-row mdui-list-item" tabindex="0" role="button" aria-pressed="${this.selected}" @click="${this.handleClick}">
        <span class="repo-name">${this.repository.name}</span>
      </section>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('organization-repo-list-item', OrganizationRepoListItem);
