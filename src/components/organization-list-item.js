// src/components/organization-list-item.js
import { LitElement, html, css } from 'lit';
import 'mdui/components/icon.js';
import '@mdui/icons/business.js';

/**
 * Web component for displaying a single GitHub organization in a list.
 *
 * @element organization-list-item
 * @property {Object} organization - The organization object to display.
 * @property {Boolean} selected - Whether this item is selected.
 */
export class OrganizationListItem extends LitElement {
  static properties = {
    organization: { type: Object },
    selected: { type: Boolean }
  };

  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
      }
      .item-row {
        display: flex;
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
      .item-row:hover, .item-row:focus {
        background: var(--mdui-color-primary-light, #e3f2fd);
        color: var(--mdui-color-primary, #1976d2);
        border-color: var(--mdui-color-primary, #1976d2);
      }
      :host([selected]) .item-row {
        background: var(--mdui-color-primary-light, #e3f2fd);
        border-color: var(--mdui-color-primary, #1976d2);
        color: var(--mdui-color-primary, #1976d2);
      }
      mdui-icon-business {
        color: var(--mdui-color-primary, #1976d2);
        font-size: 22px;
        flex-shrink: 0;
      }
      .mdui-list-item-content {
        flex: 1 1 0%;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `
  ];

  handleClick() {
    this.dispatchEvent(new CustomEvent('org-selected', {
      detail: { org: this.organization.login },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="item-row" tabindex="0" role="button" aria-pressed="${this.selected}">
        <!-- <mdui-icon name="business"></mdui-icon> -->
        <mdui-icon-business></mdui-icon-business>
        <span class="mdui-list-item-content">${this.organization.login}</span>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    this.setAttribute('aria-pressed', String(this.selected));
    this.addEventListener('click', this.handleClick);
  }

  updated(changedProps) {
    if (changedProps.has('selected')) {
      this.setAttribute('aria-pressed', String(this.selected));
    }
  }
}

customElements.define('organization-list-item', OrganizationListItem);
