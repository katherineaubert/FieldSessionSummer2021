/* eslint-disable @typescript-eslint/camelcase */
import {BurstChainSDK, MetadataSDK} from "../http/burst-server-endpoints";
import {CollectionDictionary} from "../http/metadata-interfaces";
import {Asset} from "../http/burstchain-interfaces";

//rename console.log() to cb() for faster typing
const log = (line) => console.log(line)

//set up global variables
const clientName = 'mines_summer';
const server = 'https://testnet.burstiq.com'

// create the burst chain client
const chainClient = new BurstChainSDK(server, clientName);

//set inventory ID Pair
const privateIdInventory = 'c50188204aecb09d';
let publicIdInventory;
async function getInventoryPublicId () {
  publicIdInventory = await chainClient.getPublicId(privateIdInventory);
}


//create an object representing the medications dictionary
const medicationsDictionary: CollectionDictionary = {
  collection: 'Medications',

  indexes: [{
    unique: true,
    attributes: ['serial']
  }],

  rootnode: {
    attributes: [{
      name: 'name',
      required: true
    }, {
      name: 'dose',
      required: true
    }, {
      name: 'qty_remaining',
      required: true
    }, {
      name: 'expiration_date'
    }, {
      name: 'NDC'
    }, {
      name: 'form'
    }, {
      name: 'manufacturer'
    }, {
      name: 'lot'
    }, {
      name: 'serial'
    }, {
      name: 'monetary_value'
    }]
  }
};

//create an object representing the user dictionary
const usersDictionary: CollectionDictionary = {
  collection: 'RemedichainUsers',

  indexes: [{
    unique: true,
    attributes: ['user_email']
  }],

  rootnode: {
    attributes: [{
      name: 'user_name',
    }, {
      name: 'user_email',
      required: true
    }, {
      name: 'user_phone'
    }, {
      name: 'private_id'
    }, {
      name: 'prescriptions'
    }
    ]
  }
};


//Homepage: User Creates Account. Temporarily out of scope.
export async function userCreateAccount(userName: string, password: string) {

  cb('\n'
    + '--------------------------------------------------------------\n'
    + 'Burst Chain Client - Hello Medications Demo\n'
    + 'Copyright (c) 2015-2021 BurstIQ, Inc.\n'
    + '--------------------------------------------------------------\n')


}


//TODO delete this hard-coded value for the donor private ID
let privateIdUser = null;
let publicIdUser = null;

//need to test this function once again using postman
export async function getIdPair (userEmail) {
  const tql = `SELECT asset.private_id FROM RemedichainUsers WHERE asset.user_email = ${userEmail}`;
  let userAssets = await chainClient.query(usersDictionary.collection, privateIdInventory, tql);
  privateIdUser = userAssets[0].asset.private_id;
  publicIdUser = await chainClient.getPublicId(privateIdUser);

  cb(privateIdInventory + " " + publicIdInventory + " \n" + privateIdUser + " " + publicIdUser);
}

getIdPair("johndoenor@gmail.com")

//create an asset on the medications blockchain, called when the donation form is filled out
export async function addDonation (drugName, dose, quantity){
  const asset = {
    name: drugName,
    dose: dose,
    qty_remaining: quantity
  };

  const assetMetadata = {
    loaded_by: 'hello medications demo'
  };

  const firstAssetId = await chainClient.createAsset(medicationsDictionary.collection, privateIdUser, asset, assetMetadata,
    [publicIdUser]);

  return firstAssetId;
}





//transfer ownership of a drug from a donor to the inventory
export async function transferToInventory (assetId) {
  
  const transferResp = await chainClient.transferAsset(medicationsDictionary.collection, privateIdInventory, assetId, [publicIdUser],
    [publicIdInventory], publicIdInventory);

  //the original owner should NO longer be able to see this asset
  let resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdUser, assetId);

  //the new owner should be able to see this asset
  resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdInventory, assetId);
}





//transfer ownership of a drug from the inventory to a recipient
export async function transferFromInventory (assetId) {

  const transferResp = await chainClient.transferAsset(medicationsDictionary.collection, privateIdInventory, assetId, [publicIdInventory],
    [publicIdUser], publicIdUser);

  //the original owner should NO longer be able to see this asset
  let resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdInventory, assetId);

  //the new owner should be able to see this asset
  resp = await chainClient.getLatestAsset(medicationsDictionary.collection, privateIdUser, assetId);
}






//called when a pharmacist user clicks the button to approve medications for inventory
export async function pharmacistApproval (assetId) {
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
