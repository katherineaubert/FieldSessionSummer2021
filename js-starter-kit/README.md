# What is the BurstIQ JS Starter Kit

## Contents:
- What is the BurstIQ JS Starter Kit
- A Word on Swagger
- Your PublicId and PrivateId
- install and Run the hello-world app
- Testing the UI
- Looking at what the hello-world app did
- Glossary


## What is the BurstIQ JS Starter Kit
So what us the BurstIQ: JS Starter Kit?

The BurstIQ: JS Starter Kit is a bare bones demo app specifically designed to exercises many of the REST endpoints you would need to get started using Burstchain.

After reviewing the app you can either adapt the basic code provided, or use it as a guide to create your own app using the javascript framework of your choice.


## A Word on Swagger


Swagger is a toolset for describing and documenting REST APIs. The format is both machine-readable and human-readable.
As a result, it can be used to share documentation among product managers, testers and developers,
but can also be used by various tools to automate API-related processes.

Here at BurstIQ we use Swagger to automate the sharing API documentation with our team and our customers.

more: https://testnet-developer.burstiq.com/swagger



## Your PublicId and PrivateId
All users must have a private/public ID pair in order to interact with a chain. Each ID pair is tied to one (and only one) user. The ID enforces ownership of an asset
and identifies users that have been granted access to non-owned assets via Consent Contracts (more on this later). Within a chain, users can only query and view assets that they “own” and assets for which they have permissioned access to via a Consent Contract. Assets must have at least one owner but may have multiple owners.

Any entity can request a private ID by calling the endpoint below with a valid client (data space) name.



### Get PrivateId
you can generated a privateId by executing a GET request to the following endpoint:

`/api/burstchain/ip/private`

you can also use Postman or execute the following curl command:

`curl -X GET "https://testnet.burstiq.com/api/burstchain/id/private" -H "accept: application/json"`

The newly generated private_id will be returned in the response please keep it for your records, as there is no way to look it up if it is lost.


Most of the endpoints within the  BurstChain API require the user’s private ID to be supplied in the header as follows"


`Authorization: ID {private_id}`


more: https://testnet-developer.burstiq.com/swagger

### Get PublicId
The entity can request it’s public ID at any time by executing a GET request to the following endpoint, with the entity’s private ID in the header.
ys

`/api/burstchain/ip/public`

you can also use Postman or execute the following curl command:

`curl -X GET "https://testnet.burstiq.com/api/burstchain/id/public" -H "accept: application/json" -H "Authorization: ID {{YOUR-PRIVATEID-HERE}}"`


The api will return the Public Id associated with the supplied private_id

more: https://testnet-developer.burstiq.com/swagger


## install and Run the hello-world app
You should have received a .zip file containing the project.  
Extract it to a folder of your choosing, then open a terminal window and change to the newly created folder with the project.

*NOTE: The next step requires you to have node and npm installed

Install Dependencies

`npm i`

Run the app

`npm run start`

In your browser navigate to the following url: http://localhost:4200


## Testing the UI
Now that we have the app up and running, we see that there is some data required to actuallt run the tool...

- Need: Client => name of your client space
- Need: UserName => your testnet username
- Need: Password => your testnet password
- Need: Server => for the sake of this start default for now
- Need: PrivateId => you probably already have your private id , if not see below where we will discuss creating yourself a private id

Provide the required credential info and click the 'Run Demo' button.

If you dont have a privateId yet please see below...


## Looking at what the hello-world app did


### Step 1: Create Dictionary:

To get started, you will need to create definitions of what data will be stored, how it will be structured and what datatypes are represented in the data.
It is possible to establish a dictionary that is completely unstructured, completely structured, or somewhere in the middle.

Step 1 the hello-world created a new dictionary to represent Address data as follows


```json
{
  "collection": "address",
  "indexes": [
    {
      "unique": true,
      "attributes": [
        "id"
      ]
    }
  ],
  "rootnode": {
    "attributes": [
      {
        "name": "id",
        "required": true
      },
      {
        "name": "addr1"
      },
      {
        "name": "addr2"
      },
      {
        "name": "city"
      },
      {
        "name": "state"
      },
      {
        "name": "zip"
      }
    ]
  }
}
```


There are several other metadata API calls; but for the purposes of IQ and BurstChain, only the dictionary metadata is required.

more in dictionaries: https://testnet-developer.burstiq.com/docs/metadata/dictionary


### Step 4: Create our first asset:

Based on the chain definition (dictionary), assets that meet that definition are created and stored in the chain. Assets can be
added and updated using the burst-chain-ctrl endpoints. BurstChain allows the owner of an asset to update that asset. In the event
of an update, the previous asset will still be preserved in its location on the chain but is no longer available for query
(except by the owner viewing the asset’s history). Consent Contracts only grant another user permission to view the most current
version of the asset.

Assets can be added (POST) or updated (PUT) by executing a POST (create) or PUT (edit) request to the following URL:

`{base_url}/api/burstchain/{client_name}/{chain_name}/asset`


here is the body:
```json
{
  "asset": {
    "id": "'2123'",
    "addr1": "123 Main St",
    "city": "Nowhere",
    "state": "XX",
    "zip": "12345-0000"
  },
  "asset_metadata": {
    "loaded_by": "hello world demo"
  },
  "owners": [
    "YOUR-PUBLICID-HERE"
  ]
}
```

The response will include the asset_id for the new record


### Step 6: Retrieve Asset via Id

chain_name: address

asset_id: asset_id returned from step 4

Request URL (GET): https://testnet.burstiq.com/api/burstchain/burstiq/{{chain_name}}/{{asset_id}}/latest



### Step 11: Query assets using TQL

There are multiple ways for a user to query a chain within the BurstChain. Remember that the BurstChain only allows the requestor to see assets that it owns OR has been
granted access to via Consent Contract(s) by other data owners.

Methods:

Map/Reduce - a map/reduce set of functions can be submitted to run against the chain
TQL - an ANSI-like SQL language that allows a user to write familiar SQL to query assets
Endpoints:


POST {base_url}/api/burstchain/{client_name}/{chain_name}/mapreduce/query

POST {base_url}/api/burstchain/{client_name}/{chain_name}/query

more: https://testnet-developer.burstiq.com/docs/query/tql


## Glossary
A brief definition of some of the terms discussed in this post.
more: https://testnet-developer.burstiq.com/docs/glossary/glossary

- **Asset**: a piece of data (stored in a block)
- **Block**: the smallest discrete unit of asset(s) on the platform. May contain one or more assets
- **Chain**: a series of blocks that all relate to each other (or build from each other).
- **Client or Company**: The entity that is developing an application or service on top of BurstChain
- **Client Data Space**: the reserved, separate data space where data is not allowed to transition to any other data space; it is identified by a client name that is used throughout the BurstChain API
- **Dictionary**:
a set of definitions created by a data owner that allow BurstChain to properly organize and understand the data, data types and data structures; a dictionary belongs to the client’s data space
more: https://testnet-developer.burstiq.com/docs/metadata/dictionary

- **TQL	Tiny Query Language**:  allows for users familiar with SQL to begin queries into IQ and/or BurstChain
more: https://testnet-developer.burstiq.com/docs/query/tql


