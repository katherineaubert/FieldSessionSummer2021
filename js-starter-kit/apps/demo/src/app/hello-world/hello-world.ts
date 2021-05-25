/* eslint-disable @typescript-eslint/camelcase */
import {BurstChainSDK, MetadataSDK} from "../http/burst-server-endpoints";
import {CollectionDictionary} from "../http/metadata-interfaces";
import {Asset} from "../http/burstchain-interfaces";

const log = (line) => console.log(line)

export async function demo(clientName: string, userName: string, password: string, server = 'https://testnet.burstiq.com', privateIdInventory?: string, cb = log) {

    cb('\n'
      + '--------------------------------------------------------------\n'
      + 'Burst Chain Client - Hello World Demo\n'
      + 'Copyright (c) 2015-2020 BurstIQ, Inc.\n'
      + '--------------------------------------------------------------\n')

  // create the burst chain client
  const chainClient = new BurstChainSDK(server, clientName);
  const metadataClient = new MetadataSDK(server, userName, password);

  // ------------------------------------------------------------------------
  // STEP 1 - Setup the dictionary for a chain
  //
  cb('STEP 1 - Setup the dictionary for a chain')

  const dictionary: CollectionDictionary = {
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

  const respMsg = await metadataClient.saveDictionary(dictionary);
  cb(`PUT dictionary response: ${respMsg}`)

  // ------------------------------------------------------------------------
  // STEP 2 - get a private id
  //
  cb('STEP 2 - get a private id');
  if (!privateIdInventory) {
    cb(`ENTERED IF STATEMENT`);
    privateIdInventory = await chainClient.genPrivateId();
  }
  cb(`Using private id ${privateIdInventory} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 3 - get the public id
  //
  cb('STEP 3 - get the public id');
  const publicIdInventory = await chainClient.getPublicId(privateIdInventory);
  cb(`Using public id ${publicIdInventory} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 4 - create asset for the dictionary
  //
  cb('STEP 4 - create asset for the dictionary');
  const asset = {
    name: 'Glucose',
    dose: '20',
    qty_remaining: 1,
    expiration_date: '02-02-2222',
    NDC: '12345-0000',
    form: 'tablet',
    manufacturer: 'Tandem',
    lot: '12345-0000',
    serial: '12345-0000',
    monetary_value: 9.99
  };
  
  const assetMetadata = {
    loaded_by: 'hello world demo'
  };

  const firstAssetId = await chainClient.createAsset(dictionary.collection, privateIdInventory, asset, assetMetadata,
    [publicIdInventory]);
  cb(`Asset created ${firstAssetId} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 5 - get status of last asset
  //
  cb('STEP 5 - get status of last asset');
  const acceptedMsg = await chainClient.getAssetStatus(dictionary.collection, privateIdInventory, firstAssetId);
  cb(`Status response message ${acceptedMsg}`);

  // ------------------------------------------------------------------------
  // STEP 6 - get asset via id
  //
  cb('STEP 6 - get asset via id');
  let resp = await chainClient.getLatestAsset(dictionary.collection, privateIdInventory, firstAssetId);
  const hash = resp.hash;
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 7 - get asset via hash
  //
  cb('STEP 7 - get asset via hash');
  resp = await chainClient.getSpecificAsset(dictionary.collection, privateIdInventory, hash);
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 8 - update asset
  //
  cb('STEP 8 - update asset');
  asset['monetary_value'] = 4.99;

  let tmpId = await chainClient.updateAsset(dictionary.collection, privateIdInventory, firstAssetId, asset, null);
  cb(`Asset updated ${tmpId} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 9 - get asset via id (again)
  //
  cb('STEP 9 - get asset via id (again)');
  resp = await chainClient.getLatestAsset(dictionary.collection, privateIdInventory, firstAssetId);
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 10 - transfer the asset to another owner
  //
  cb('STEP 10 - transfer the asset to another owner');
  
//TODO create if statement logic for multiple donors/recipients (in case private/public dne)  
//Create Donor ID pair
  const donorPrivateId = 'ac1c850d653806cf';
  const donorPublicId = await chainClient.getPublicId(donorPrivateId);
//Create Recipient ID pair
  const recipientPrivateId = '8046fbe68954c257';
  const recipientPublicId = await chainClient.getPublicId(recipientPrivateId);

  const transferResp = await chainClient.transferAsset(dictionary.collection, privateIdInventory, firstAssetId, [publicIdInventory],
    [donorPublicId], donorPublicId);
  cb(`transferred asset id ${transferResp}`);

  // the original owner should NO longer be able to see this asset
  cb('the original owner should NO longer be able to see this asset');
  resp = await chainClient.getLatestAsset(dictionary.collection, privateIdInventory, firstAssetId);
  cb(`ASSET should be NULL:\n ${JSON.stringify(resp, undefined, 2)}`);

  // the new owner should be able to see this asset
  cb('the new owner should be able to see this asset');
  resp = await chainClient.getLatestAsset(dictionary.collection, donorPrivateId, firstAssetId);
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 11 - query via TQL
  //
  cb('STEP 11 - query via TQL');
  let tql = "WHERE asset.monetary_value = 4.99";

  let assets: Asset[] = await chainClient.query(dictionary.collection, donorPrivateId, tql);
  cb(`TQL 1 ASSET:\n ${JSON.stringify(assets, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 12 - query via TQL
  //
  cb('STEP 12 - query via TQL');
  tql = "SELECT asset.id FROM Prescription WHERE asset.name = 'Glucose'";

  assets = await chainClient.query(dictionary.collection, privateIdInventory, tql);
  cb(`TQL 2 ASSET:\n ${JSON.stringify(assets, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 13 - consent contract
  //
  cb('STEP 13 - consent contract');
  const endDate: Date = new Date();
  endDate.setDate(endDate.getDate() + 10);

  const c = `consents ${publicIdInventory} ` +
    `for ${dictionary.collection} ` +
    `when asset.state = 'CO' ` +
    `until Date('${endDate.toISOString()}')`; // todo: might need to be formatted to '%Y-%m-%d %H:%M:%S'

  tmpId = await chainClient.createSmartContract(dictionary.collection, donorPrivateId, c,
    {'loaded by': 'hello world demo'}, 'consent', 'first consent',
    [donorPublicId]);
  cb(`Smart Contract (consent) asset id ${tmpId} for this demo`);

  // the original owner should BE be able to see this asset now with the consent contract in place
  cb('the original owner should BE be able to see this asset now with the consent contract in place');
  resp = await chainClient.getLatestAsset(dictionary.collection, privateIdInventory, firstAssetId);
  cb(`ASSET should be VIEWABLE:\n ${JSON.stringify(resp, undefined, 2)}`);
}
