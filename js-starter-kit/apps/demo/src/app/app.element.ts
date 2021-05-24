import './app.element.scss';
import { CustomElement } from './custom-element'
import { demo } from './hello-world/hello-world'


export class AppElement extends CustomElement {
  public static observedAttributes = [];

  css

  inputForm: HTMLFormElement
  inputNames: string[] = ['client', 'username', 'password', 'server', 'privateId']
  inputValues: string[]

  lines: string[] = []

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.css = `
      <style>
        details {
          border-radius: 4px;
          color: #333;
          background-color: rgba(0, 0, 0, 0);
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 3px 9px;
          margin-bottom: 9px;
        }

        summary {
          cursor: pointer;
          outline: none;
          height: 36px;
          line-height: 36px;
        }

        #runDemo {
          padding:0.35em 1.2em;
          border:2px solid black;
          margin:6px;
          border-radius:0.12em;
          box-sizing: border-box;
          font-weight:800;
          color:black;
          text-align:center;
        }
      </style>`

    this.shadowRoot.innerHTML = `
      ${this.css}
      <header>
        <h1>BurstIQ Burstchain Demo</h1>
      </header>
      <main>
        <form id="inputForm" class="inputs">
          <div>
            <label for="client">Client:</label>
            <input type="text" id="client" name="client" required size="30">
          </div>
          <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required size="30">
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required size="30">
          </div>
          <div>
            <label for="server">Server:</label>
            <input type="text" id="server" name="server" required size="30">
          </div>
          <div>
            <label for="privateId">PrivateID:</label>
            <input type="text" id="privateId" name="privateId" required size="30">
          </div>
          <div>
            <button id="runDemo" type="submit">Run Demo</button>
          </div>
        </form>

        <details open>
          <summary>Results</summary>
          <data-repeater data-bind="data:lines"></data-repeater>
        </details>
      </main>
    `;
  }

  init() {
    this.inputForm = this.shadowRoot.querySelector('#inputForm')
    const server = this.inputForm.elements.namedItem('server') as HTMLInputElement
    server.value = 'https://testnet.burstiq.com'
    this.inputForm.addEventListener('submit', e => e.preventDefault())
    this.shadowRoot.querySelector('#runDemo').addEventListener('click', this.runDemo.bind(this))
  }

  addLine(line) {
    console.log(line);
    this.lines = [...this.lines, line]
    this.setState({ lines: this.lines })
  }

  runDemo() {
    console.log('Running Demo:');
    this.lines = []
    if (this.inputForm.checkValidity()) {
      this.inputValues = this.inputNames.map(name => {
        const elm = this.inputForm.elements.namedItem(name) as HTMLInputElement
        return elm.value
      })
      // using spred operator creates a linting error
      demo(this.inputValues[0], this.inputValues[1], this.inputValues[2], this.inputValues[3], this.inputValues[4], this.addLine.bind(this))
    }
  }

  connectedCallback() {
    this.init()
  }

}

customElements.define('starter-kit-root', AppElement);
