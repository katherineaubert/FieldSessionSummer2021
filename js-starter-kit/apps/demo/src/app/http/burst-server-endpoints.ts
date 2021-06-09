/* eslint-disable @typescript-eslint/camelcase */
import { Asset } from './burstchain-interfaces';
import { CollectionDictionary } from './metadata-interfaces';

class Utilities {

  private readonly serverURI: string;

  constructor(serverURI: string) {
    this.serverURI = serverURI;
  }

  metadataURI(): string { return `${this.serverURI}/api/metadata` };

  chainURI(clientName: string): string {
    return `${this.serverURI}/api/burstchain/${clientName}`;
  }

  async processBasicResponse(response: Response): Promise<any> {
    const responseStr = await response.text();
    if (responseStr === '') return null;

    const responseJson = JSON.parse(responseStr);
    if (response.status !== 200) {
      console.error(`BurstServer Error: ${responseJson.message}`, responseJson.status);
      throw new Error(`BurstServer Error (${responseJson.status}): ${responseJson.message}`)
    } else {
      return responseJson;
    }
  }

  /**
   * Creates request specification for an IQ request
   */
  createNonChainReqSpec(
    method: string,
    body: object,
    basicAuth: string,
    useAuth: boolean
  ): object {

    const reqSpec = {
      method: method,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (useAuth) {
      reqSpec.headers['Authorization'] = `Basic ${window.btoa(basicAuth)}`
    }

    if (body) reqSpec['body'] = JSON.stringify(body);

    return reqSpec;
  }
}

export class BurstChainSDK {


  private readonly utilities: Utilities;

  private readonly clientName: string;

  constructor(serverURI: string, clientName: string) {
    this.clientName = clientName;
    this.utilities = new Utilities(serverURI);
  }

  /**
   * Generates a new anonymous private id
   * @returns
   */
  public async genPrivateId(): Promise<string> {

    const reqSpec = this.createChainReqSpec('GET', null, null);
    const response = await fetch(`${this.utilities.chainURI('')}id/private`, reqSpec);
    const responseJson = await this.utilities.processBasicResponse(response);

    return responseJson.private_id;
  }

  /**
   * Gets the public id for this private id
   * @param privateId
   * @return
   */
  public async getPublicId(privateId: string): Promise<string> {

    const reqSpec = this.createChainReqSpec('GET', null, privateId);
    const response = await fetch(`${this.utilities.chainURI('')}id/public`, reqSpec);
    const responseJson = await this.utilities.processBasicResponse(response);

    return responseJson.public_id;
  }

  /**
   * Create an asset in the BurstChain.
   * @param chainName: chain on which to create asset
   * @param privateId: privateId to use for creation
   * @param asset: actual data to post
   * @param assetMetadata: optional metadata object, can be anything you want
   * @param owners: list of publicIds of owners, must contain publicId of creator
   * @return the asset id of the newly created asset
   */
  public async createAsset(
    chainName: string,
    token: string,
    asset: object,
    assetMetadata: object,
    owners: string[]
  ): Promise<string> {
    console.log("Create Asset:")
    const responseJson = await this.chainCall(chainName, token, 'POST', '/asset', {
      asset: asset,
      asset_metadata: assetMetadata,
      owners: owners
    });

    return responseJson.asset_id;
  }

  /**
   * Update an asset in the BurstChain
   * @param chainName
   * @param privateId
   * @param assetId
   * @param asset
   * @param assetMetadata
   * @return the asset id of the newly created asset
   */
  public async updateAsset(
    chainName: string,
    privateId: string,
    assetId: string,
    asset: object,
    assetMetadata: object
  ): Promise<string> {

    const responseJson = await this.chainCall(chainName, privateId, 'PUT', '/asset', {
      asset: asset,
      asset_id: assetId,
      asset_metadata: assetMetadata
    });

    return responseJson.asset_id;
  }


  /**
   * Queries assets from the BurstChain
   * @param chainName
   * @param privateId
   * @param tqlQuery
   * @return
   */
  public async query(
    chainName: string,
    privateId: string,
    tqlQuery: string
  ): Promise<Asset[]> {

    const responseJson = await this.chainCall(chainName, privateId, 'POST', '/query', {
      queryTql: tqlQuery
    });

    return responseJson.assets;
  }

  /**
   * Create a smart contract in the BurstChain
   * @param chainName
   * @param privateId
   * @param contract
   * @param smartContractMetadata
   * @param smartContractType
   * @param name
   * @param owners
   */
  public async createSmartContract(
    chainName: string,
    privateId: string,
    contract: string,
    smartContractMetadata: object,
    smartContractType: string,
    name: string,
    owners: string[]
  ): Promise<string> {

    const responseJson = await this.chainCall(chainName, privateId, 'POST', '/smartcontract', {
      contract: contract,
      smart_contract_type: smartContractType,
      name: name,
      owners: owners,
      smart_contract_metadata: smartContractMetadata
    });

    return responseJson.asset_id;
  }

  /**
   * Transfers an asset in the BurstChain.
   * @param chainName
   * @param privateId
   * @param assetId
   * @param owners
   * @param newOwners
   * @param newSignerPublicId
   */
  public async transferAsset(
    chainName: string,
    privateId: string,
    assetId: string,
    owners: string[],
    newOwners: string[],
    newSignerPublicId: string
  ): Promise<string> {

    const responseJson =  await this.chainCall(chainName, privateId, 'POST', '/transfer', {
      asset_id: assetId,
      owners: owners,
      new_owners: newOwners,
      new_signer_public_id: newSignerPublicId
    });

    return responseJson.asset_id;
  }

  /**
   * Get an asset and all of it's history (transfers and updates) from BurstChain.
   * @param chainName
   * @param privateId
   * @param assetId
   */
  public async history(
    chainName: string,
    privateId: string,
    assetId: string
  ): Promise<Asset[]> {

    const responseJson = await this.chainCall(chainName, privateId, 'GET', `/${assetId}/history`,
      null);

    return responseJson.assets;
  }

  /**
   * Gets the latest version of an asset (its latest Create or Update).
   * @param chainName
   * @param privateId
   * @param assetId
   */
  public async getLatestAsset(
    chainName: string,
    privateId: string,
    assetId: string
  ): Promise<Asset> {

    return await this.chainCall(chainName, privateId, 'GET', `/${assetId}/latest`,
      null);
  }

  /**
   * Gets a specific asset status (Candidate or Accepted).
   * @param chainName
   * @param privateId
   * @param assetId
   */
  public async getAssetStatus(
    chainName: string,
    privateId: string,
    assetId: string
  ): Promise<string> {

    const responseJson = await this.chainCall(chainName, privateId, 'GET', `/${assetId}/status`,
      null);

    return responseJson.message;
  }

  /**
   * Gets a specific asset.
   * @param chainName
   * @param privateId
   * @param hash
   */
  public async getSpecificAsset(
    chainName: string,
    privateId: string,
    hash: string
  ): Promise<Asset> {

    return await this.chainCall(chainName, privateId, 'GET', `/${hash}`,
      null);
  }

  /**
   *
   * @param chainName
   * @param privateId
   * @param method
   * @param endpoint
   * @param body
   */
  private async chainCall(
    chainName: string,
    token: string,
    method: string,
    endpoint: string,
    body: object
  ): Promise<any> {
    console.log("chaincall")
    const reqSpec = this.createChainReqSpec(method, body, token);
    const response = await fetch(`${this.utilities.chainURI(this.clientName)}/${chainName}${endpoint}`, reqSpec);

    return await this.utilities.processBasicResponse(response);
  }

  /**
   *
   * @param method
   * @param body
   * @param privateId
   */
  private createChainReqSpec(
    method: string,
    body: object,
    token: string
  ): any {
    console.log("reqspec")
    const reqSpec = {
      method: method,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    // private id not passed in on generate private id endpoint
    if (token) reqSpec.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    if (body) reqSpec['body'] = JSON.stringify(body);

    return reqSpec;
  }

}

export class MetadataSDK {

  private readonly utilities: Utilities;

  private readonly basicAuth: string;

  constructor(serverURI: string, userName: string, password: string) {
    this.basicAuth = `${userName}:${password}`;
    this.utilities = new Utilities(serverURI);
  }

  /**
   * Provides the user the ability to save new or update based on unique dictionary name.
   * @param dictionary
   */
  public async saveDictionary(dictionary: CollectionDictionary): Promise<string> {

    const responseJson = await this.metadataCall('PUT', '/dictionary', dictionary);

    return responseJson.message;
  }

  private async metadataCall(
    method: string,
    endpoint: string,
    body: object,
    useAuth = true
  ): Promise<any> {


    const reqSpec = this.utilities.createNonChainReqSpec(method, body, this.basicAuth, useAuth);
    const response = await fetch(`${this.utilities.metadataURI()}${endpoint}`, reqSpec);

    return await this.utilities.processBasicResponse(response);
  }
}

