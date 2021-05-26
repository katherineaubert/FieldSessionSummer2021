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

//Inventory ID Pair
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



export async function getIdPair (userEmail) {
  //TODO fix the API query to see if we find the user based off the email and get their private id, otherwise gen a new id pair
  let tql = `WHERE asset.email = ${userEmail}`;
  let assets: Asset[] = await chainClient.query(prescriptionDictionary.collection, privateIdUser, tql);

  if (!privateIdUser) {
    privateIdUser = await chainClient.genPrivateId();
  }

  const publicIdUser = await chainClient.getPublicId(privateIdUser);
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

export async function transferToInventory (asset) {
  //TODO
}

export async function prescriberApproval (asset) {
  //TODO
}

