/* eslint-disable @typescript-eslint/camelcase */
import {Asset} from "../http/burstchain-interfaces";
import { BurstChainSDK } from '../http/burst-server-endpoints';
import { medicationsDictionary, userDictionary } from '../hello-world/dictionary-formats';
import { callbackify } from "util";
import { parse } from "querystring";

//rename console.log() to cb() for faster typing and to set up the black box on the test UI
const log = (line) => console.log(line)


export async function loginRequest(username: string, password: string){
  localStorage.setItem("email", username);
  
  //Login request to API, no longer needs chainClient
  const reqSpec = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: `{"username": "${username}", "password": "${password}"}`
  };

  //Gets API response
  fetch('https://testnet.burstiq.com/api/userauth/login', reqSpec)
  .then(resp => resp.json())
  .then(data => putTokenInLocalStorage(data))
  
}



//Take in response and store the JWT token in localstorage
function putTokenInLocalStorage(data){
  localStorage.setItem("token", JSON.stringify(data.token))
}




//create an asset on the medications blockchain, called when the donation form is filled out
export async function addDonation (drug_name, dose, quantity){
  
  //donor public ID is hard-coded
  let publicIdUser = "a33a569382be82588775ba9dcce2522399039c19" 

  const reqSpec = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    },
    body: `{"owners": ["${publicIdUser}"], "asset": {"drug_name": "${drug_name}", "dose": "${dose}", "quantity": "${quantity}"}}`
  };

  //Gets API response
  fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/asset', reqSpec)
  .then(resp => resp.json())
  .then(data => console.log(data))

}




//Query Medications with a specfic asset ID
function queryByAssetId(data){
  const reqSpec = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    },
    body: `{"queryTql": "SELECT * FROM Medications WHERE asset_id = '${data}'"}`
  };

  fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/assets/query', reqSpec)
  .then(resp => resp.json())
  .then(data => console.log(data))
}






//transfer ownership of a drug from a donor to the inventory
export async function transferToInventory (assetId, chainClient, medicationsDictionary, privateIdInventory, publicIdInventory, privateIdUser, publicIdUser) {
  const transferResp = await chainClient.transferAsset(medicationsDictionary.collection, privateIdInventory, assetId, [publicIdUser],
    [publicIdInventory], publicIdInventory);
  //the original owner should NO longer be able to see this asset
  let resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdUser, assetId);
  //the new owner should be able to see this asset
  resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdInventory, assetId);
}






//create a 2D array of strings to display the available inventory assets 
export async function getAvailableInventory () {
  
  //set inventory private ID
  const privateIdInventory = 'c50188204aecb09d';

  let inventory = await queryForInventory(privateIdInventory, "Approved")
  inventory = inventory.json();
  let arrOfInventory = Array.from(Array(inventory.length), () => new Array(3));
  for (let i = 0; i < inventory.length; i++) {

    arrOfInventory[i][0] = inventory[i].asset.drug_name;
    arrOfInventory[i][1] = inventory[i].asset.dose;
    arrOfInventory[i][2] = inventory[i].asset.quantity;
  }
  
  //returns a 2D JS array, where each row is a med, and each column is a name/dose/quantity in that order
  return arrOfInventory
}





//query for the array of medications in inventory matching the specified status
async function queryForInventory(privateIdInventory, status){
  const reqSpec = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `ID ${privateIdInventory}`
    },
    body: `{"queryTql": "SELECT * FROM Medications WHERE asset.status = '${status}'"}`
  };

  let userAssets = await fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/assets/query', reqSpec)
  return userAssets;
}





//transfer ownership of a drug from the inventory to a recipient
export async function transferFromInventory (assetId, chainClient, medicationsDictionary, privateIdInventory, publicIdInventory, privateIdUser, publicIdUser) {
  const transferResp = await chainClient.transferAsset(medicationsDictionary.collection, privateIdInventory, assetId, [publicIdInventory],
    [publicIdUser], publicIdUser);
  //the original owner should NO longer be able to see this asset
  let resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdInventory, assetId);
  //the new owner should be able to see this asset
  resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdUser, assetId);
}







//adds a prescription to a user's data on the user blockchain after they fill out a presciption request form
export async function addUserPrescription(inputValues: string[]){
  //TODO move this constructor up a level to be created within the HTML file where the inputValues array exists
  const prescription = {
    patient_contact: {
      name: inputValues[0],
      address: inputValues[1], 
      phone: inputValues[2], 
      email: inputValues[3] 
    },
    patient_info: {
      household_size: inputValues[4],
      household_annual_income: inputValues[5],
      insurance_status: inputValues[6],
      date_of_birth: inputValues[7],
      allergies: inputValues[8]
    },
    prescriber_contact: {
      name: inputValues[9],
      address: inputValues[10],
      phone: inputValues[11],
      email: inputValues[12]
    },
    primary_contact: {
      name: inputValues[13],
      phone: inputValues[14],
      email: inputValues[15]
    },
    prescription_info: {
      drug_name: inputValues[16],
      dose_strength: inputValues[17],
      dosing_schedule: inputValues[18],
      diagnosis: inputValues[19]
    },
    follow_up_contact: {
      name: inputValues[20],
      phone: inputValues[21],
      email: inputValues[22],
      organization: inputValues[23]
    },
    status: "Pending"
  };

  //set inventory private ID
  const privateIdInventory = 'c50188204aecb09d';

  let userAsset = await queryByUserEmail(privateIdInventory, localStorage.getItem("email"))

  //update the user to add this prescription:
  userAsset.prescriptions.push(prescription);

  //TODO update asset body
  const reqSpec = {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `ID ${privateIdInventory}`
    },
    body: ``
  };

  //Gets API response
  fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/RemedichainUsers/asset', reqSpec)
  .then(resp => resp.json())
  .then(data => console.log(data))

}





//Check RemedichainUsers dictionary for the user asset based off of the email of the current user logged in
async function queryByUserEmail(privateIdInventory, userEmail){
  const reqSpec = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `ID ${privateIdInventory}`
    },
    body: `{"queryTql": "SELECT * FROM RemedichainUsers WHERE asset.user_email = '${userEmail}'"}`
  };

  let userAssets = await fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/RemedichainUsers/assets/query', reqSpec)
  let userAsset = userAssets[0].asset;
  return userAsset;
}






//get all pending items in the inventory and deliver to midlevel code for display to pharmacist inventory page
export async function getPendingInventory () {
  //TODO method stub

  /*
   * Psuedocode:  If a user has the pharmacist role permissions, they will have access to an additional web page
   *              displaying the medication assets that are awaiting manual approval at Remedichain.
   *              They will be able to select a medication from the pending inventory to update it using the
   *              pharmacistApproval() function.
   * 
   *              This method should create a 2D array of strings and can be done by copying the 
   *              getAvailableInventory() method. However, instead of querying for assets with an available
   *              status, this should query for the assets with a pending status.
   */
}





//called when a pharmacist user clicks the button to approve medications for inventory
export async function pharmacistApproval (asset) {
  //TODO method stub

  /*
   * Psuedocode:  From the pending inventory page, a pharmacist user should be able to approve a medication.
   *              This will involve setting the technical data for the medication (e.g. expiration data, RX #, etc.)
   *              as well as updating the status of the medication asset from pending to available.
   */
}
