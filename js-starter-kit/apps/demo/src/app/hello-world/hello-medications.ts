/* eslint-disable @typescript-eslint/camelcase */
import {BurstChainSDK, MetadataSDK} from "../http/burst-server-endpoints";
import {CollectionDictionary} from "../http/metadata-interfaces";
import {Asset} from "../http/burstchain-interfaces";

//rename console.log() to cb() for faster typing
const log = (line) => console.log(line)

//Homepage: User Creates Account. Temporarily out of scope.
export async function userCreateAccount(userName: string, password: string, cb = log) {

  cb('\n'
    + '--------------------------------------------------------------\n'
    + 'Burst Chain Client - Hello Medications Demo\n'
    + 'Copyright (c) 2015-2021 BurstIQ, Inc.\n'
    + '--------------------------------------------------------------\n')


}

//Get the user's private Id based on their email in the user blockchain
export async function getUserPrivateId (userEmail, chainClient, medicationsDictionary, privateIdInventory, publicIdInventory, cb = log) {
  const tql = `SELECT asset.private_id FROM RemedichainUsers WHERE asset.user_email = ${userEmail}`;
  let userAssets = await chainClient.query(medicationsDictionary.collection, privateIdInventory, tql);
  const privateIdUser = userAssets[0].asset.private_id;

  return privateIdUser
}

//Return the user's public id
export async function getUserPublicId (chainClient, privateIdUser, cb = log) {
  let publicIdUser = await chainClient.getPublicId(privateIdUser);

  return publicIdUser
}


//create an asset on the medications blockchain, called when the donation form is filled out
export async function addDonation (drug_name, dose, quantity, chainClient, medicationsDictionary, privateIdUser, publicIdUser, cb = log){
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
export async function transferToInventory (asset) {
  //TODO
}

//called when a pharmacist user clicks the button to approve medications for inventory
export async function pharmacistApproval (asset) {
  //TODO
}

//transfer ownership of a drug from the inventory to a recipient
export async function transferFromInventory (asset) {
  //TODO
}

//get all available items in the inventory and deliver to midlevel code for display to main inventory page
export async function getAvailableInventory () {
  //TODO
}

//get all pending items in the inventory and deliver to midlevel code for display to pharmacist inventory page
export async function getPendingInventory () {
  //TODO
}
