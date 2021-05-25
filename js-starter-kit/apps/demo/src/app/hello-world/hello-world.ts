/* eslint-disable @typescript-eslint/camelcase */
import {BurstChainSDK, MetadataSDK} from "../http/burst-server-endpoints";
import {CollectionDictionary} from "../http/metadata-interfaces";
import {Asset} from "../http/burstchain-interfaces";

const log = (line) => console.log(line)

export async function demo(clientName: string, userName: string, password: string, server = 'https://testnet.burstiq.com', privateId?: string, cb = log) {

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
    collection: 'Prescriptions',

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
  if (!privateId) {
    privateId = await chainClient.genPrivateId();
  }
  cb(`Using private id ${privateId} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 3 - get the public id
  //
  cb('STEP 3 - get the public id');
  const publicId = await chainClient.getPublicId(privateId);
  cb(`Using public id ${publicId} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 4 - create asset for the dictionary
  //
  cb('STEP 4 - create asset for the dictionary');
  const asset = {
    name: 'Glucose',
    dose: '20',
    qty_remaining: `'${Math.floor(Math.random() * (Math.floor(10000) - Math.ceil(1000))) + Math.ceil(1000)}'`,
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

  const firstAssetId = await chainClient.createAsset(dictionary.collection, privateId, asset, assetMetadata,
    [publicId]);
  cb(`Asset created ${firstAssetId} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 5 - get status of last asset
  //
  cb('STEP 5 - get status of last asset');
  const acceptedMsg = await chainClient.getAssetStatus(dictionary.collection, privateId, firstAssetId);
  cb(`Status response message ${acceptedMsg}`);

  // ------------------------------------------------------------------------
  // STEP 6 - get asset via id
  //
  cb('STEP 6 - get asset via id');
  let resp = await chainClient.getLatestAsset(dictionary.collection, privateId, firstAssetId);
  const hash = resp.hash;
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 7 - get asset via hash
  //
  cb('STEP 7 - get asset via hash');
  resp = await chainClient.getSpecificAsset(dictionary.collection, privateId, hash);
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 8 - update asset
  //
  cb('STEP 8 - update asset');
  asset['monetary_value'] = 4.99;

  let tmpId = await chainClient.updateAsset(dictionary.collection, privateId, firstAssetId, asset, null);
  cb(`Asset updated ${tmpId} for this demo`);

  // ------------------------------------------------------------------------
  // STEP 9 - get asset via id (again)
  //
  cb('STEP 9 - get asset via id (again)');
  resp = await chainClient.getLatestAsset(dictionary.collection, privateId, firstAssetId);
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 10 - transfer the asset to another owner
  //
  cb('STEP 10 - transfer the asset to another owner');
  const secondPrivateId = await chainClient.genPrivateId();
  const secondPublicId = await chainClient.getPublicId(secondPrivateId);

  const transferResp = await chainClient.transferAsset(dictionary.collection, privateId, firstAssetId, [publicId],
    [secondPublicId], secondPublicId);
  cb(`transferred asset id ${transferResp}`);

  // the original owner should NO longer be able to see this asset
  cb('the original owner should NO longer be able to see this asset');
  resp = await chainClient.getLatestAsset(dictionary.collection, privateId, firstAssetId);
  cb(`ASSET should be NULL:\n ${JSON.stringify(resp, undefined, 2)}`);

  // the new owner should be able to see this asset
  cb('the new owner should be able to see this asset');
  resp = await chainClient.getLatestAsset(dictionary.collection, secondPrivateId, firstAssetId);
  cb(`ASSET:\n ${JSON.stringify(resp, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 11 - query via TQL
  //
  cb('STEP 11 - query via TQL');
  let tql = "WHERE asset.monetary_value = 4.99";

  let assets: Asset[] = await chainClient.query(dictionary.collection, secondPrivateId, tql);
  cb(`TQL 1 ASSET:\n ${JSON.stringify(assets, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 12 - query via TQL
  //
  cb('STEP 12 - query via TQL');
  tql = "SELECT asset.id FROM address WHERE asset.name = 'Glucose'";

  assets = await chainClient.query(dictionary.collection, privateId, tql);
  cb(`TQL 2 ASSET:\n ${JSON.stringify(assets, undefined, 2)}`);

  // ------------------------------------------------------------------------
  // STEP 13 - consent contract
  //
  cb('STEP 13 - consent contract');
  const endDate: Date = new Date();
  endDate.setDate(endDate.getDate() + 10);

  const c = `consents ${publicId} ` +
    `for ${dictionary.collection} ` +
    `when asset.state = 'CO' ` +
    `until Date('${endDate.toISOString()}')`; // todo: might need to be formatted to '%Y-%m-%d %H:%M:%S'

  tmpId = await chainClient.createSmartContract(dictionary.collection, secondPrivateId, c,
    {'loaded by': 'hello world demo'}, 'consent', 'first consent',
    [secondPublicId]);
  cb(`Smart Contract (consent) asset id ${tmpId} for this demo`);

  // the original owner should BE be able to see this asset now with the consent contract in place
  cb('the original owner should BE be able to see this asset now with the consent contract in place');
  resp = await chainClient.getLatestAsset(dictionary.collection, privateId, firstAssetId);
  cb(`ASSET should be VIEWABLE:\n ${JSON.stringify(resp, undefined, 2)}`);
}
