/* eslint-disable @typescript-eslint/camelcase */
import {Asset} from "../http/burstchain-interfaces";
import { BurstChainSDK } from '../http/burst-server-endpoints';
import { medicationsDictionary, userDictionary } from '../hello-world/dictionary-formats';
import { callbackify } from "util";
import { parse } from "querystring";

//rename console.log() to cb() for faster typing
const log = (line) => console.log(line)



export async function demo(drugName: string, dose: string, quantity: string, userEmail: string, cb = log) {
  
  // create the burst chain client as a global variable
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

  // create the burst chain client as a global variable
  const chainClient = new BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');

  //set inventory ID Pair
  const privateIdInventory = 'c50188204aecb09d';
  let publicIdInventory = await getInventoryPublicId(chainClient, privateIdInventory);
 
  //Get the user asset from their email
  const tql = `SELECT asset FROM RemedichainUsers WHERE asset.user_email = '${userEmail}'`;
  let userAssets: Asset[] = await chainClient.query(userDictionary.collection, privateIdInventory, tql);
  let asset = userAssets[0];

  //Get the id of the user asset
  let firstAssetId = asset.asset_id;
  //Update the user to add this prescription:
  asset.asset.prescriptions.push(prescription);

  let tmpId = await chainClient.updateAsset(userDictionary.collection, privateIdInventory, firstAssetId, asset, null);
  cb(`Asset updated ${tmpId} for this demo`);
}





/*
 *These are helper functions used in the wrapper functions above.
 */

//Homepage: User Creates Account. Temporarily out of scope.
export async function userCreateAccount(userName: string, password: string, cb = log) {

  cb('\n'
    + '--------------------------------------------------------------\n'
    + 'Burst Chain Client - Hello Medications Demo\n'
    + 'Copyright (c) 2015-2021 BurstIQ, Inc.\n'
    + '--------------------------------------------------------------\n')


}

export async function getInventoryPublicId (chainClient, privateIdInventory) {
  let publicIdInventory = await chainClient.getPublicId(privateIdInventory);
  return publicIdInventory;
}


//Get the user's private Id based on their email in the user blockchain
export async function getUserPrivateId (userEmail, chainClient, userDictionary, privateIdInventory, publicIdInventory, cb = log) {
  const tql = `SELECT asset.private_id FROM RemedichainUsers WHERE asset.user_email = '${userEmail}'`;
  let userAssets: Asset[] = await chainClient.query(userDictionary.collection, privateIdInventory, tql);
  
  const privateIdUser = userAssets[0].asset.private_id;

  return privateIdUser
}

//Return the user's public id
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




//called when a pharmacist user clicks the button to approve medications for inventory
export async function pharmacistApproval (asset) {
  //TODO
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




//get all available items in the inventory and deliver to midlevel code for display to main inventory page
export async function getAvailableInventory (chainClient, privateIdInventory) {
  const tqlPrintInv = `SELECT asset.name FROM Medications`;
  let inventory: Asset[] = await chainClient.query(userDictionary.collection, privateIdInventory, tqlPrintInv);
  for (var i = 0; i < inventory.length; i++) {
    if(inventory[i].asset.status == "Approved") {
      console.log(JSON.parse(inventory[i].asset)); 
    }
    


  }
}




//get all pending items in the inventory and deliver to midlevel code for display to pharmacist inventory page
export async function getPendingInventory () {
  //TODO
}
