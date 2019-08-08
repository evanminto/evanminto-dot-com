class ObservedItem {
  constructor(element, typeMap) {
    this.element = element;
    this.typeMap = typeMap;
  }

  matchEvent(event) {
    const keys = Object.keys(this.typeMap);

    for (let i = 0; i < keys.length; i++) {
      const type = keys[i];
      const def = this.typeMap[type];
      const response = {
        type,
        preventDefault: def.preventDefault,
      };

      if (typeof def === 'string') {
        if (event.key === def) {
          return response;
        }
      } else if (def === true) {
        if (event.key === type) {
          return response;
        }
      } else {
        const key = (def.key === undefined || event.key === def.key);
        const alt = (def.altKey === undefined || event.altKey === def.altKey);
        const ctrl = (def.ctrlKey === undefined || event.ctrlKey === def.ctrlKey);
        const meta = (def.metaKey === undefined || event.metaKey === def.metaKey);
        const shift = (def.shiftKey === undefined || event.shiftKey === def.shiftKey);

        if (key && alt && ctrl && meta && shift) {
          return response;
        }
      }
    }
  }
}

export class KeyboardObserver {
  constructor() {
    this.observedItems = [];
    this.observing = false;
    this.activeObservedItem = undefined;
  }

  observe(el, typeMap = {}) {
    this.observedItems.push(new ObservedItem(el, typeMap));

    if (!this.observing) {
      this.startObserving();
    }
  }

  startObserving() {
    document.body.addEventListener('focusout', event => {
      event.composedPath().forEach((el => {
        if (this.activeObservedItem && el === this.activeObservedItem.element) {
          this.activeObservedItem = undefined;
        }
      }));
    });

    document.body.addEventListener('focusin', event => {
      const path = event.composedPath();
      let item;

      for (let i = 0; i < path.length; i++) {
        const el = path[i];
        const matches = this.observedItems.filter(i => i.element === el);

        if (matches.length > 0) {
          item = matches[0];
          break;
        }
      }

      if (item) {
        this.activeObservedItem = item;
      } else {
        this.activeObservedItem = undefined;
      }
    });

    window.addEventListener('keydown', event => {
      if (!this.activeObservedItem) {
        return;
      }

      const typeData = this.activeObservedItem.matchEvent(event);

      if (typeData) {
        if (typeData.preventDefault) {
          event.preventDefault();
        }

        const keyEvent = new CustomEvent('pwc-key', {
          bubbles: true,
          cancelable: true,
          detail: {
            type: typeData.type,
          },
        });

        this.activeObservedItem.element.dispatchEvent(keyEvent);

        if (keyEvent.defaultPrevented) {
          event.preventDefault();
        }
      }
    });

    this.observing = true;
  }
}

export default new KeyboardObserver();
