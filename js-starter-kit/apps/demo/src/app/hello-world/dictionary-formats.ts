/* eslint-disable @typescript-eslint/camelcase */
import {CollectionDictionary} from "../http/metadata-interfaces";

//create an object representing the medications dictionary
export const medicationsDictionary: CollectionDictionary = {
  collection: 'Medications',

  // indexes: [{
  //   unique: true,
  //   attributes: ['RX']
  // }],

  rootnode: {
    attributes: [{
      name: 'drug_name',
      required: true
    }, {
      name: 'dose',
      required: true
    }, {
      name: 'quantity',
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
      name: 'monetary_value'
    }, {
      name: 'RX'
    }, {
      name: 'status'
    }]
  }
};

//create an object representing the user dictionary
export const userDictionary: CollectionDictionary = {
  collection: 'RemedichainUsers',

  indexes: [{
    unique: true,
    attributes: ['email']
  }],

  rootnode: {
    attributes: [{
      name: 'user_name'
    }, {
      name: 'user_email',
      required: true
    }, {
      name: 'user_phone'
    }, {
      name: 'private_id'
    }, {
      name: 'prescriptions' 
    }]
  }
};