export class DataRepeater extends HTMLElement {

  html
  _data
  css

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.css = `
      <style>
        pre {
          padding: 9px;
          border-radius: 4px;
          background-color: black;
          color: #eee;
        }
      </style>
    `
  }

  connectedCallback() {
    this.html = this.innerHTML;
  }

  get data() {
    return this._data;
  }

  set data(items) {
    this._data = items;
    this.shadowRoot.innerHTML = `${this.css}<pre>${items.reduce((acc, item) => `${acc}\n${item}`, ``)}</pre>`;
  }
}

customElements.define('data-repeater', DataRepeater);
