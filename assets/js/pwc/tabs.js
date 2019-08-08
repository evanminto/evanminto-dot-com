import { LitElement, html, css } from 'lit-element';
import keyboardObserver from './keyboardObserver.js';

class PwcElement extends LitElement {
  static get defaultRole() {
    return undefined;
  }

  static get defaultTabIndex() {
    return undefined;
  }

  setup() {

  }

  connectedCallback() {
    super.connectedCallback();
    this.setup();
  }

  constructor() {
    super();

    if (this.constructor.defaultRole !== undefined) {
      this.setAttribute('role', this.constructor.defaultRole);
    }

    if (this.constructor.defaultTabIndex !== undefined) {
      this.tabIndex = this.constructor.defaultTabIndex;
    }
  }
}

class TabbedInterfaceElement extends PwcElement {
  static get properties() {
    return {
      orientation: {
        type: String,
        reflect: true,
      },

      useLinks: {
        type: Boolean,
        reflect: true,
        attribute: 'use-links',
      },

      index: {
        type: Number,
      },
    };
  }

  static get styles() {
    return css`
    :host {
      display: block;
    }

    :host([orientation='vertical']) {
      display: flex;
    }

    :host([orientation='vertical']) ::slotted(pwc-tab-panel) {
      flex-basis: 100%;
    }

    :host([orientation='vertical']) ::slotted(pwc-tab-list) {
      --tab-direction: column;
      --text-align: left;
    }
    `;
  }

  get tabList() {
    return this.querySelector('pwc-tab-list');
  }

  get tabs() {
    const tabList = this.tabList;

    if (tabList) {
      return tabList.querySelectorAll('pwc-tab');
    }

    return [];
  }

  get panels() {
    return this.querySelectorAll('pwc-tab-panel');
  }

  get selectedTab() {
    return this.tabs[this.index];
  }

  set selectedTab(tab) {
    this.index = Array.from(tab.closest('pwc-tab-list').querySelectorAll('pwc-tab')).indexOf(tab);
  }

  get selectedPanel() {
    return this.panels[this.index];
  }

  set selectedPanel(panel) {
    this.index = Array.from(this.querySelectorAll('pwc-tab-panel')).indexOf(panel);
  }

  constructor() {
    super();

    this.orientation = 'horizontal';
    this.initialized = false;
    this.index = 0;
    this.useLinks = false;

    this.addEventListener('tab-click', event => this.selectedTab = event.target);
    this.addEventListener('tab-move-next', () => this.moveNext());
    this.addEventListener('tab-move-previous', () => this.movePrevious());
    this.addEventListener('tab-move-start', () => this.moveStart());
    this.addEventListener('tab-move-end', () => this.moveEnd());
  }

  moveNext() {
    const newIndex = this.index + 1;

    if (newIndex >= this.tabs.length) {
      this.index = 0;
    } else {
      this.index = newIndex;
    }
  }

  movePrevious() {
    const newIndex = this.index - 1;

    if (newIndex < 0) {
      this.index = this.tabs.length - 1;
    } else {
      this.index = newIndex;
    }
  }

  moveStart() {
    this.index = 0;
  }

  moveEnd() {
    this.index = this.tabs.length - 1;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'use-links':
        const tabList = this.tabList;

        if (tabList) {
          tabList.setup();
        }

        Array.from(this.tabs).forEach((tab, index) => {
          tab.setup();
        });

        Array.from(this.panels).forEach((panel, index) => {
          panel.setup();
        });

        break;

      case 'orientation':
        if (newValue) {
          this.setAttribute('aria-orientation', newValue);
        } else {
          this.removeAttribute('aria-orientation');
        }

        break;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  updated({ index }) {
    if (index !== this.index) {
      this.dispatchEvent(new CustomEvent('tab-change', {
        bubbles: true,
      }));

      Array.from(this.tabs).forEach((tab, index) => {
        tab.selected = (index === this.index);

        if (this.initialized && tab.selected) {
          tab.focus();
        }
      });

      Array.from(this.panels).forEach((panel, index) => {
        panel.selected = (index === this.index);
      });
    }

    this.initialized = true;
  }

  render() {
    return html`<slot></slot>`;
  }
}

class TabListElement extends PwcElement {
  static get defaultRole() {
    return 'tablist';
  }

  static get styles() {
    return css`
    :host {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
      text-align: center;
    }

    ::slotted(ul) {
      list-style: none;
      display: flex;
      flex-direction: var(--tab-direction, row);
      margin: 0;
      padding: 0;
    }
    `;
  }

  get useLinks() {
    const tabs = this.closest('pwc-tabs');

    return tabs && tabs.matches('[use-links]');
  }

  get orientation() {
    const tabs = this.closest('pwc-tabs');

    return tabs.orientation;
  }

  constructor() {
    super();

    keyboardObserver.observe(this, {
      ArrowRight: true,
      ArrowLeft: true,
      ArrowDown: true,
      ArrowUp: true,
      Home: true,
      End: true,
    });

    this.addEventListener('pwc-key', event => {
      if (!this.useLinks) {
        if (event.detail.type === 'ArrowRight') {
          if (this.orientation !== 'vertical') {
            event.preventDefault();

            this.dispatchEvent(new CustomEvent('tab-move-next', {
              bubbles: true,
            }));
          }
        }

        if (event.detail.type === 'ArrowLeft') {
          if (this.orientation !== 'vertical') {
            event.preventDefault();

            this.dispatchEvent(new CustomEvent('tab-move-previous', {
              bubbles: true,
            }));
          }
        }

        if (event.detail.type === 'ArrowDown') {
          if (this.orientation === 'vertical') {
            event.preventDefault();

            this.dispatchEvent(new CustomEvent('tab-move-next', {
              bubbles: true,
            }));
          }
        }

        if (event.detail.type === 'ArrowUp') {
          if (this.orientation === 'vertical') {
            event.preventDefault();

            this.dispatchEvent(new CustomEvent('tab-move-previous', {
              bubbles: true,
            }));
          }
        }

        if (event.detail.type === 'Home') {
          event.preventDefault();

          this.dispatchEvent(new CustomEvent('tab-move-start', {
            bubbles: true,
          }));
        }

        if (event.detail.type === 'End') {
          event.preventDefault();

          this.dispatchEvent(new CustomEvent('tab-move-end', {
            bubbles: true,
          }));
        }
      }
    });
  }

  setup() {
    if (this.useLinks) {
      this.removeAttribute('role');
    }

    const listEls = this.querySelectorAll('ul, li');

    if (listEls.length > 0) {
      Array.from(listEls).forEach(el => {
        if (this.useLinks) {
          el.removeAttribute('role');
        } else {
          el.setAttribute('role', 'presentation');
        }
      });
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

class TabElement extends PwcElement {
  static get properties() {
    return {
      selected: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
    :host {
      display: block;
      text-align: var(--text-align, center);
    }

    :host([selected]) {
      background: black;
      color: white;
    }

    ::slotted(a) {
      color: inherit;
      cursor: var(--link-cursor, default);
      display: block;
      text-decoration: none;
    }
    `;
  }

  get useLinks() {
    const tabs = this.closest('pwc-tabs');

    return tabs && tabs.matches('[use-links]');
  }

  get link() {
    return this.querySelector('a');
  }

  get panel() {
    const link = this.link;

    if (link) {
      const id = new URL(link.href).hash.substring(1);

      if (id) {
        return document.getElementById(id);
      }
    }
  }

  focus() {
    this.querySelector('a').focus();
  }

  setup() {
    const a = this.querySelector('a');

    if (a) {
      if (this.useLinks) {
        a.removeAttribute('role');
        a.removeAttribute('tabindex');
      } else {
        a.setAttribute('role', 'tab');
        if (this.selected) {
          a.tabIndex = 0;
        } else {
          a.tabIndex = -1;
        }
      }

      this.requestUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', event => {
      if (event.target.matches('a')) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('tab-click', {
          bubbles: true,
        }));
      }
    });
  }

  updated() {
    const a = this.querySelector('a');

    if (a) {
      if (!this.useLinks) {
        if (this.selected) {
          a.tabIndex = 0;
        } else {
          a.tabIndex = -1;
        }
      }
    }
  }

  render() {
    return html`
      <span class="wrapper" style="--link-cursor: ${this.useLinks ? 'pointer': 'default'}">
        <slot></slot>
      </span>
    `;
  }
}

class TabPanelElement extends PwcElement {
  static get defaultRole() {
    return 'tabpanel';
  }

  static get defaultTabIndex() {
    return 0;
  }

  static get properties() {
    return {
      selected: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
    :host {
      display: none;
    }

    :host([selected]) {
      display: block;
    }
    `;
  }

  get useLinks() {
    const tabs = this.closest('pwc-tabs');

    return tabs && tabs.matches('[use-links]');
  }

  setup() {
    if (this.useLinks) {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
      this.removeAttribute('aria-selected');
    }
  }

  updated() {
    if (!this.useLinks) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

if ('customElements' in window) {
  customElements.define('pwc-tab', TabElement);
  customElements.define('pwc-tab-list', TabListElement);
  customElements.define('pwc-tab-panel', TabPanelElement);
  customElements.define('pwc-tabs', TabbedInterfaceElement);
}
