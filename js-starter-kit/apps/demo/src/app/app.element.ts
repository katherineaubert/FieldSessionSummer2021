// imports for css
import './app.element.scss';
import { CustomElement } from './custom-element'
import { demo } from './hello-world/hello-medications'

export class AppElement extends CustomElement {
  public static observedAttributes = [];

    // instance variables
    css

    inputForm: HTMLFormElement
    inputKeys: string[] = ['drugName', 'dose', 'qty']
    inputValues: string[]
    lines: string[] = [] // you may need an = [] at the end but maybe not im not sure

    constructor() {
        // inherits customElement
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
        <h1>Test Donation Form</h1>
      </header>
      <main>
        <form id="inputForm" class="inputs">
          <div>
            <label for="drugName">Drug Name:</label>
            <input type="text" id="drugName" name="drugName" required size="30">
          </div>
          <div>
            <label for="dose">Dose:</label>
            <input type="text" id="dose" name="dose" required size="30">
          </div>
          <div>
            <label for="qty">Quantity:</label>
            <input type="text" id="qty" name="qty" required size="30">
          </div>
          <div>
            <button id="runDemo" type="submit">Donate Pills</button>
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
    // const server = this.inputForm.elements.namedItem('server') as HTMLInputElement
    // server.value = 'https://testnet.burstiq.com'
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
      this.inputValues = this.inputKeys.map(name => {
        const elm = this.inputForm.elements.namedItem(name) as HTMLInputElement
        return elm.value
      })
      // using spred operator creates a linting error
      
      
      demo(this.inputValues[0], this.inputValues[1], this.inputValues[2], "johndoenor@gmail.com", this.addLine.bind(this));
     

    } else {
      console.log("If statement has failed.")
    }
  }

  connectedCallback() {
    this.init()
  }

}

customElements.define('starter-kit-root', AppElement);
