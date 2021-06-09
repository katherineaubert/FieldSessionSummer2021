/* eslint-disable @typescript-eslint/camelcase */
import {Asset} from "../http/burstchain-interfaces";
import { BurstChainSDK } from '../http/burst-server-endpoints';
import { medicationsDictionary, userDictionary } from '../hello-world/dictionary-formats';
import { callbackify } from "util";
import { parse } from "querystring";

//rename console.log() to cb() for faster typing and to set up the black box on the test UI
const log = (line) => console.log(line)





//takes the user input from the donation form and uses it to create an asset on the medication blockchain
export async function donationFormSubmission(drugName: string, dose: string, quantity: string, userEmail: string, cb = log) {
  
  //create the burst chain client as a global variable
  const chainClient = new BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');

  //set inventory ID Pair
  const privateIdInventory = 'c50188204aecb09d';
  let publicIdInventory = await getInventoryPublicId(chainClient, privateIdInventory);
 
  //get user ID pair from email
  let privateIdUser = await getUserPrivateId(userEmail, chainClient, userDictionary, privateIdInventory, publicIdInventory, cb = log)
  let publicIdUser = await getUserPublicId(chainClient, privateIdUser)

  //Add the user donation to the blockchain
  let donationAssetId = await addDonation(drugName, dose, quantity, chainClient, medicationsDictionary, privateIdUser, publicIdUser)

  cb(`Donation added. Asset ID: ${donationAssetId}`)
}





//get the inventory public id based on the private id
export async function getInventoryPublicId (chainClient, privateIdInventory) {
  let publicIdInventory = await chainClient.getPublicId(privateIdInventory);
  return publicIdInventory;
}





//get the user's private id based on their email in the user blockchain
export async function getUserPrivateId (userEmail, chainClient, userDictionary, privateIdInventory, publicIdInventory, cb = log) {
  const tql = `SELECT asset.private_id FROM RemedichainUsers WHERE asset.user_email = '${userEmail}'`;
  let userAssets: Asset[] = await chainClient.query(userDictionary.collection, privateIdInventory, tql);
  
  const privateIdUser = userAssets[0].asset.private_id;

  return privateIdUser
}






//return the user's public id
export async function getUserPublicId (chainClient, privateIdUser) {
  let publicIdUser = await chainClient.getPublicId(privateIdUser);

  return publicIdUser
}




//create an asset on the medications blockchain, called when the donation form is filled out
export async function addDonation (drug_name, dose, quantity, chainClient, medicationsDictionary, privateIdUser, publicIdUser){
  const asset = {
    drug_name: drug_name,
    dose: dose,
    quantity: quantity
  };

  const assetMetadata = {
    loaded_by: 'hello medications demo'
  };

  const firstAssetId = await chainClient.createAsset(medicationsDictionary.collection, privateIdUser, asset, assetMetadata,
    [publicIdUser]);

  return firstAssetId;
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
  //create the burst chain client as a global variable
  const chainClient = new BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');
  //set inventory ID Pair
  const privateIdInventory = 'c50188204aecb09d';

  const tqlPrintInv = `SELECT * FROM Medications WHERE asset.status = 'Approved'`;
  const inventory: Asset[] = await chainClient.query(medicationsDictionary.collection, privateIdInventory, tqlPrintInv);
  let arrOfInventory = Array.from(Array(inventory.length), () => new Array(3));
  for (let i = 0; i < inventory.length; i++) {

    arrOfInventory[i][0] = inventory[i].asset.drug_name;
    arrOfInventory[i][1] = inventory[i].asset.dose;
    arrOfInventory[i][2] = inventory[i].asset.quantity;
  }
  
  //returns a 2D JS array, where each row is a med, and each column is a name/dose/quantity in that order
  return arrOfInventory
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
export async function storeDataFromPrescriptionRequest(inputValues: string[], userEmail: string, cb = log){
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

  //create the burst chain client as a global variable
  const chainClient = new BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');

  //set inventory ID Pair
  const privateIdInventory = 'c50188204aecb09d';
 
  //get the user asset from their email
  const tql = `SELECT * FROM RemedichainUsers WHERE asset.user_email = '${userEmail}'`;
  let userAssets: Asset[] = await chainClient.query(userDictionary.collection, privateIdInventory, tql);
  
  let asset = userAssets[0].asset;

  //get the id of the user asset
  let firstAssetId = userAssets[0].asset_id;

  //update the user to add this prescription:
  asset.prescriptions.push(prescription);

  //update the asset by adding the new prescription to the array of prescriptions
  let tmpId = await chainClient.updateAsset(userDictionary.collection, privateIdInventory, firstAssetId, asset, null);
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
