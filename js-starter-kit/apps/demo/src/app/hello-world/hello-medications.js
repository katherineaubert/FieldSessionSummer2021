"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.userCreateAccount = exports.pharmacistApproval = exports.getPendingInventory = exports.getAvailableInventory = exports.transferFromInventory = exports.transferToInventory = exports.addDonation = exports.getUserPublicId = exports.getUserPrivateId = exports.getInventoryPublicId = exports.storeDataFromPrescriptionRequest = exports.demo = void 0;
var burst_server_endpoints_1 = require("../http/burst-server-endpoints");
var dictionary_formats_1 = require("../hello-world/dictionary-formats");
//rename console.log() to cb() for faster typing
var log = function (line) { return console.log(line); };
function demo(drugName, dose, quantity, userEmail, cb) {
    if (cb === void 0) { cb = log; }
    return __awaiter(this, void 0, void 0, function () {
        var chainClient, privateIdInventory, publicIdInventory, privateIdUser, publicIdUser, donationAssetId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chainClient = new burst_server_endpoints_1.BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');
                    privateIdInventory = 'c50188204aecb09d';
                    return [4 /*yield*/, getInventoryPublicId(chainClient, privateIdInventory)];
                case 1:
                    publicIdInventory = _a.sent();
                    return [4 /*yield*/, getUserPrivateId(userEmail, chainClient, dictionary_formats_1.userDictionary, privateIdInventory, publicIdInventory, cb = log)];
                case 2:
                    privateIdUser = _a.sent();
                    return [4 /*yield*/, getUserPublicId(chainClient, privateIdUser)
                        //Add the user donation to the blockchain
                    ];
                case 3:
                    publicIdUser = _a.sent();
                    return [4 /*yield*/, addDonation(drugName, dose, quantity, chainClient, dictionary_formats_1.medicationsDictionary, privateIdUser, publicIdUser)];
                case 4:
                    donationAssetId = _a.sent();
                    cb("Donation added. Asset ID: " + donationAssetId);
                    return [2 /*return*/];
            }
        });
    });
}
exports.demo = demo;
function storeDataFromPrescriptionRequest(inputValues, userEmail, cb) {
    if (cb === void 0) { cb = log; }
    return __awaiter(this, void 0, void 0, function () {
        var prescription, chainClient, privateIdInventory, tql, userAssets, asset, firstAssetId, tmpId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prescription = {
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
                    chainClient = new burst_server_endpoints_1.BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');
                    privateIdInventory = 'c50188204aecb09d';
                    tql = "SELECT * FROM RemedichainUsers WHERE asset.user_email = '" + userEmail + "'";
                    return [4 /*yield*/, chainClient.query(dictionary_formats_1.userDictionary.collection, privateIdInventory, tql)];
                case 1:
                    userAssets = _a.sent();
                    asset = userAssets[0].asset;
                    firstAssetId = userAssets[0].asset_id;
                    //Update the user to add this prescription:
                    asset.prescriptions.push(prescription);
                    return [4 /*yield*/, chainClient.updateAsset(dictionary_formats_1.userDictionary.collection, privateIdInventory, firstAssetId, asset, null)];
                case 2:
                    tmpId = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.storeDataFromPrescriptionRequest = storeDataFromPrescriptionRequest;
/*
 *These are helper functions used in the wrapper functions above.
 */
function getInventoryPublicId(chainClient, privateIdInventory) {
    return __awaiter(this, void 0, void 0, function () {
        var publicIdInventory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chainClient.getPublicId(privateIdInventory)];
                case 1:
                    publicIdInventory = _a.sent();
                    return [2 /*return*/, publicIdInventory];
            }
        });
    });
}
exports.getInventoryPublicId = getInventoryPublicId;
//Get the user's private Id based on their email in the user blockchain
function getUserPrivateId(userEmail, chainClient, userDictionary, privateIdInventory, publicIdInventory, cb) {
    if (cb === void 0) { cb = log; }
    return __awaiter(this, void 0, void 0, function () {
        var tql, userAssets, privateIdUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tql = "SELECT asset.private_id FROM RemedichainUsers WHERE asset.user_email = '" + userEmail + "'";
                    return [4 /*yield*/, chainClient.query(userDictionary.collection, privateIdInventory, tql)];
                case 1:
                    userAssets = _a.sent();
                    privateIdUser = userAssets[0].asset.private_id;
                    return [2 /*return*/, privateIdUser];
            }
        });
    });
}
exports.getUserPrivateId = getUserPrivateId;
//Return the user's public id
function getUserPublicId(chainClient, privateIdUser) {
    return __awaiter(this, void 0, void 0, function () {
        var publicIdUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chainClient.getPublicId(privateIdUser)];
                case 1:
                    publicIdUser = _a.sent();
                    return [2 /*return*/, publicIdUser];
            }
        });
    });
}
exports.getUserPublicId = getUserPublicId;
//create an asset on the medications blockchain, called when the donation form is filled out
function addDonation(drug_name, dose, quantity, chainClient, medicationsDictionary, privateIdUser, publicIdUser) {
    return __awaiter(this, void 0, void 0, function () {
        var asset, assetMetadata, firstAssetId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    asset = {
                        drug_name: drug_name,
                        dose: dose,
                        quantity: quantity
                    };
                    assetMetadata = {
                        loaded_by: 'hello medications demo'
                    };
                    return [4 /*yield*/, chainClient.createAsset(medicationsDictionary.collection, privateIdUser, asset, assetMetadata, [publicIdUser])];
                case 1:
                    firstAssetId = _a.sent();
                    return [2 /*return*/, firstAssetId];
            }
        });
    });
}
exports.addDonation = addDonation;
//transfer ownership of a drug from a donor to the inventory
function transferToInventory(assetId, chainClient, medicationsDictionary, privateIdInventory, publicIdInventory, privateIdUser, publicIdUser) {
    return __awaiter(this, void 0, void 0, function () {
        var transferResp, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chainClient.transferAsset(medicationsDictionary.collection, privateIdInventory, assetId, [publicIdUser], [publicIdInventory], publicIdInventory)];
                case 1:
                    transferResp = _a.sent();
                    return [4 /*yield*/, chainClient.getLatestAsset(medicationsDictionary.collection, privateIdUser, assetId)];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, chainClient.getLatestAsset(medicationsDictionary.collection, privateIdInventory, assetId)];
                case 3:
                    //the new owner should be able to see this asset
                    resp = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.transferToInventory = transferToInventory;
//transfer ownership of a drug from the inventory to a recipient
function transferFromInventory(assetId, chainClient, medicationsDictionary, privateIdInventory, publicIdInventory, privateIdUser, publicIdUser) {
    return __awaiter(this, void 0, void 0, function () {
        var transferResp, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chainClient.transferAsset(medicationsDictionary.collection, privateIdInventory, assetId, [publicIdInventory], [publicIdUser], publicIdUser)];
                case 1:
                    transferResp = _a.sent();
                    return [4 /*yield*/, chainClient.getLatestAsset(medicationsDictionary.collection, privateIdInventory, assetId)];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, chainClient.getLatestAsset(medicationsDictionary.collection, privateIdUser, assetId)];
                case 3:
                    //the new owner should be able to see this asset
                    resp = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.transferFromInventory = transferFromInventory;
// this is hello-medications.ts, the callee
function getAvailableInventory() {
    return __awaiter(this, void 0, void 0, function () {
        var chainClient, privateIdInventory, tqlPrintInv, inventory, arrOfInventory, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chainClient = new burst_server_endpoints_1.BurstChainSDK('https://testnet.burstiq.com', 'mines_summer');
                    privateIdInventory = 'c50188204aecb09d';
                    tqlPrintInv = "SELECT * FROM Medications WHERE asset.status = 'Approved'";
                    return [4 /*yield*/, chainClient.query(dictionary_formats_1.medicationsDictionary.collection, privateIdInventory, tqlPrintInv)];
                case 1:
                    inventory = _a.sent();
                    arrOfInventory = Array.from(Array(inventory.length), function () { return new Array(3); });
                    for (i = 0; i < inventory.length; i++) {
                        arrOfInventory[i][0] = inventory[i].asset.drug_name;
                        arrOfInventory[i][1] = inventory[i].asset.dose;
                        arrOfInventory[i][2] = inventory[i].asset.quantity;
                    }
                    // returns a 2D JS array, where each row is a med, and each column is a name/dose/quantity in that order
                    return [2 /*return*/, arrOfInventory
                        //return Promise.resolve(arrOfInventory).then(response => cb(response))
                    ];
            }
        });
    });
}
exports.getAvailableInventory = getAvailableInventory;
//get all pending items in the inventory and deliver to midlevel code for display to pharmacist inventory page
function getPendingInventory() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.getPendingInventory = getPendingInventory;
//called when a pharmacist user clicks the button to approve medications for inventory
function pharmacistApproval(asset) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.pharmacistApproval = pharmacistApproval;
//Homepage: User Creates Account. Temporarily out of scope.
function userCreateAccount(userName, password, cb) {
    if (cb === void 0) { cb = log; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            cb('\n'
                + '--------------------------------------------------------------\n'
                + 'Burst Chain Client - Hello Medications Demo\n'
                + 'Copyright (c) 2015-2021 BurstIQ, Inc.\n'
                + '--------------------------------------------------------------\n');
            return [2 /*return*/];
        });
    });
}
exports.userCreateAccount = userCreateAccount;
