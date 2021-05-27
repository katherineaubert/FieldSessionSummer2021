/* eslint-disable @typescript-eslint/camelcase */
import {BurstChainSDK, MetadataSDK} from "../http/burst-server-endpoints";
import {CollectionDictionary} from "../http/metadata-interfaces";
import {Asset} from "../http/burstchain-interfaces";

//rename console.log() to cb() for faster typing
const log = (line) => console.log(line)
const cb = log;

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


//create an object representing the prescription dictionary
const prescriptionDictionary: CollectionDictionary = {
  collection: 'Prescription',

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
const userDictionary: CollectionDictionary = {
  collection: 'RemedichainUsers',

  indexes: [{
    unique: true,
    attributes: ['email']
  }],

  rootnode: {
    attributes: [{
      name: 'email',
      required: true
    }, {
      name: 'name'
    }, {
      name: 'privateId'
    }]
  }
};


//Homepage: User Logs In
export async function userLogin(userName: string, password: string) {

    cb('\n'
      + '--------------------------------------------------------------\n'
      + 'Burst Chain Client - Hello Prescription Demo\n'
      + 'Copyright (c) 2015-2021 BurstIQ, Inc.\n'
      + '--------------------------------------------------------------\n')

  
}


let privateIdUser = null;
let publicIdUser = null;

export async function getIdPair (userEmail) {
  //TODO fix the API query to see if we find the user based off the email and get their private id, otherwise gen a new id pair
  let tql = `WHERE asset.email = ${userEmail}`;
  let assets: Asset[] = await chainClient.query(prescriptionDictionary.collection, privateIdUser, tql);

  if (!privateIdUser) {
    privateIdUser = await chainClient.genPrivateId();
  }

  publicIdUser = await chainClient.getPublicId(privateIdUser);
}


//create an asset on the prescription blockchain, called when the donation form is filled out
export async function addDonation (drugName, dose, quantity){
  const asset = {
    name: drugName,
    dose: dose,
    qty_remaining: quantity
  };
  
  const assetMetadata = {
    loaded_by: 'hello prescription demo'
  };

  const firstAssetId = await chainClient.createAsset(prescriptionDictionary.collection, privateIdUser, asset, assetMetadata,
    [publicIdUser]);
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

//get all available items in the inventory and deliver to midlevel code for display
export async function getAvailableInventory () {
  //TODO
}

//get all items in the inventory and deliver to midlevel code for display
export async function getFullInventory () {
  //TODO
}
