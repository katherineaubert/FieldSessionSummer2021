// imports for css
import { callbackify } from 'util';
import './app.element.scss';
import { CustomElement } from './custom-element'
import { addDonation, addUserPrescription, queryForInventory, loginRequest, pharmacistMedicationApproval } from './hello-world/hello-medications'

export class AppElement extends CustomElement {
  public static observedAttributes = [];

    // instance variables
    css

    inputForm: HTMLFormElement
    inputKeys: string[] = ['inputEmail', 'inputPassword']
    inputValues: string[]
    inputKeysTwo: string[] = ['drugName', 'dose', 'qty']
    inputValuesTwo: string[]
    lines: string[] = []


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
            <input id="inputEmail" type="text" name="username" placeholder="name@example.com" /> <!--Text field for Username-->
            <label for="inputEmail">Email Address</label> <!--Label for text field-->
          </div>
          <div>
            <input id="inputPassword" type="password" name="password" placeholder="Enter your password..." /> <!--Text field for Dosage Strength-->
            <label for="inputPassword">Password</label> <!--Label for text field-->
          </div>
          <div>
            <button id="runDemo" type="submit">Login</button>
          </div>
          <div>
            <button id="runDemoTwo" type="submit">Donate</button>
          </div>
          <div>
            <button id="runDemoThree" type="submit">Pharmacist Approval</button>
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

    this.shadowRoot.querySelector('#runDemoTwo').addEventListener('click', this.runDemoTwo.bind(this))

    this.shadowRoot.querySelector('#runDemoThree').addEventListener('click', this.runDemoThree.bind(this))
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
      

      //User Login API Call
      loginRequest(this.inputValues[0], this.inputValues[1])
    }
  }


  runDemoTwo() {
    console.log('Running Demo 2:');
    this.lines = []
    if (this.inputForm.checkValidity()) {
      this.inputValuesTwo = this.inputKeysTwo.map(name => {
        const elm = this.inputForm.elements.namedItem(name) as HTMLInputElement
        return elm.value
      })


      //Create Asset, Transfer to Inventory
      addDonation(this.inputValuesTwo[0], this.inputValuesTwo[1], this.inputValuesTwo[2]);
      
    }
  }


  runDemoThree() {
    console.log('Running Demo 3:');
    this.lines = []
    if (this.inputForm.checkValidity()) {
      this.inputValuesTwo = this.inputKeysTwo.map(name => {
        const elm = this.inputForm.elements.namedItem(name) as HTMLInputElement
        return elm.value
      })

      //Query asset by ID, Update asset.status
      pharmacistMedicationApproval()

      //Query asset by user email, Update asset.prescriptions[]
      addUserPrescription(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta',
      'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau',
      'upsilon', 'fi', 'chi', 'psi', 'omega'])
      
      //Query for inventory, display inventory
      queryForInventory("Approved")
      
    }
  }

  connectedCallback() {
    this.init()
  }

}

customElements.define('starter-kit-root', AppElement);

// function displayInventory(){
//   let invArrString = []
//   let invArrPromise = getAvailableInventory();
//   invArrPromise.then(
//      value => {
//         for (let i = 0; i < value.length; i++){
//           invArrString.push(value[i])
//         }
//         for (let i = 0; i < invArrString.length; i++){
//           console.log(invArrString[i]);
//           //document.write(invArrString[i]);
         
//         }
      
      
//     }
//   ).catch(
//     error => {
//       invArrString = ["No Inventory - Error"]
//       error = "There was an error loading the inventory. Please try again."; alert(error)
      
//     }
//   )
// }
