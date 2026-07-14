if ('customElements' in window) {
  class DialogPolyfill extends HTMLElement {

  }

  class ThemeSelect extends HTMLElement {
    constructor() {
      super();

      this.root = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.root.innerHTML = `
        <div class="inner">
          <slot name="button">
            <theme-select-button>Select Theme</theme-select-button>
          </slot>

          <div id="menu" hidden>
            <div class="options-list">
              <slot></slot>
            </div>

            <button id="close_button" type="submit" aria-controls="menu">
              <span class="visually-hidden">Close</span>
            </button>
          </div>
        </div>

        <style>
          :host {
            display: block;
          }

          ::slotted(theme-select-option) {
            margin-top: 0;
          }

          .inner {
            display: flex;
            justify-content: flex-end;
          }

          .visually-hidden {
            position: absolute !important;
            height: 1px;
            width: 1px;
            overflow: hidden;
            clip: rect(1px, 1px, 1px, 1px);
          }

          .options-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            justify-content: space-evenly;
            list-style: none;
            padding: 0;
            width: 100%;
          }

          #menu {
            align-items: center;
            background: var(--menu-background, white);
            border-radius: 0.5em;
            color: var(--menu-color, black);
            justify-content: space-between;
            margin-right: 4em;
            padding: 0.5em;
            position: relative;
            z-index: var(--menu-z-index);
          }

          #close_button {
            align-items: center;
            background: var(--close-button-background, white);
            border: 0;
            border-radius: 100%;
            color: var(--close-button-color, black);
            display: flex;
            font: inherit;
            justify-content: center;
            padding: 0.5em;
            position: absolute;
            right: -4em;
          }

          #close_button::after {
            content: '╳';
            font-size: 1.5em;
            line-height: 1;
          }

          #menu:not([hidden]) {
            display: flex;
          }

          #menu #close_button {
            flex: 0 0 auto;
          }
        </style>
      `;

      this.openButton = this.querySelector('theme-select-button') || this.querySelector('theme-select-button');
      this.closeButton = this.root.getElementById('close_button');
      this.menu = this.root.getElementById('menu');

      this.themeClasses = Array
        .from(this.querySelectorAll('theme-select-option'))
        .map(option => option.getAttribute('theme-class'));

      this.openButton.addEventListener('click', () => {
        this.openButton.hidden = true;
        this.menu.hidden = false;
      });

      this.closeButton.addEventListener('click', () => {
        this.openButton.hidden = false;
        this.menu.hidden = true;
      });

      this.root.addEventListener('select-theme', event => {
        this.themeClasses.forEach(cls => {
          this.target.classList.remove(cls);
        });

        this.target.addEventListener('transitionend', () => {
        this.target.classList.remove('theme-select-switching');
        });

        this.target.classList.add(event.detail.themeClass);
        this.target.classList.add('theme-select-switching');
      });
    }

    get target() {
      return document.getElementById(this.getAttribute('aria-controls')) || document.body;
    }
  }

  class ThemeSelectOption extends HTMLElement {
    constructor() {
      super();

      this.root = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const themeClass = this.getAttribute('theme-class');

      this.root.innerHTML = `
        <li>
          <button type="submit">
            <div class="swatch"></div>
            <slot></slot>
          </button>

          <style>
            button {
              background: none;
              border: 0;
              color: inherit;
              font: inherit;
              padding: 0.5em;
              text-align: center;
            }

            .swatch {
              background: var(--swatch-background, black);
              border: var(--swatch-border, none);
              border-radius: 100%;
              height: 2em;
              margin-left: auto;
              margin-right: auto;
              width: 2em;
            }
          </style>
        </li>
      `;

      this.button = this.root.querySelector('button');

      this.button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('select-theme', {
          detail: {
            themeClass,
          },
          bubbles: true,
        }));
      });
    }
  }

  class ThemeSelectButton extends HTMLElement {
    constructor() {
      super();

      this.root = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.root.innerHTML = `
        <button type="button">
          <slot></slot>
        </button>

        <style>
          button {
            background: var(--background, none);
            border: var(--border, 0.0625rem solid white);
            border-radius: var(--border-radius, 2em);
            color: inherit;
            font: inherit;
            font-variant-caps: small-caps;
            letter-spacing: 0.0625ch;
            padding: var(--padding, 0.25em 1em);
            text-transform: lowercase;
          }
        </style>
      `;
    }
  }

  customElements.define('theme-select', ThemeSelect);
  customElements.define('theme-select-option', ThemeSelectOption);
  customElements.define('theme-select-button', ThemeSelectButton);
}
