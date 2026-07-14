class CodepenEmbed extends HTMLElement {
  connectedCallback() {
    const username = this.getAttribute('username');
    const pen = this.getAttribute('pen');
    const name = this.getAttribute('name') || pen;

    this.innerHTML = `
      <p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="vamptvo" data-slug-hash="${pen}" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="${name}">
        <span>See the Pen <a href="https://codepen.io/${username}/pen/${pen}/">
        ${name}</a> by Evan (<a href="https://codepen.io/vamptvo">@vamptvo</a>)
        on <a href="https://codepen.io">CodePen</a>.</span>
      </p>
    `;

    const script = document.createElement('script');
    script.src = 'https://static.codepen.io/assets/embed/ei.js';

    this.appendChild(script);
  }
}

customElements.define('codepen-embed', CodepenEmbed);
