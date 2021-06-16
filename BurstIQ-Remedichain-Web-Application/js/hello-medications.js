"use strict";
/* eslint-disable @typescript-eslint/camelcase */
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
exports.addUserPrescription = exports.transferfromInventory = exports.queryForInventory = exports.pharmacistMedicationApproval = exports.transferToInventory = exports.addDonation = exports.loginRequest = void 0;



//////////////
//USER LOGIN//
//////////////

//enter a username and password to collect a JWT token and place it in local storage
function loginRequest(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var reqSpec;
        return __generator(this, function (_a) {
            localStorage.setItem("email", username);
            reqSpec = {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: "{\"username\": \"" + username + "\", \"password\": \"" + password + "\"}"
            };
            //Gets API response
            fetch('https://testnet.burstiq.com/api/userauth/login', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) {
                putTokenInLocalStorage(data);
                    console.log(data);
                    if (data.status == 200) {
                        location.assign("./account.html")
                    }
                    else {
                        alert("Sorry, you have entered the wrong username or password. Please try again.")
                    }
            });
            return [2 /*return*/];
        });
    });
}
exports.loginRequest = loginRequest;


//take in response and store the JWT token in localstorage
function putTokenInLocalStorage(data) {
    localStorage.setItem("token", data.token);
}


////////////////////////////
//Donation Form Submission//
////////////////////////////

//create an asset on the medications blockchain, called when the donation form is filled out
function addDonation(drug_name, dose, quantity) {
    return __awaiter(this, void 0, void 0, function () {
        var publicIdUser, reqSpec;
        return __generator(this, function (_a) {
            publicIdUser = "a33a569382be82588775ba9dcce2522399039c19";
            reqSpec = {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
                body: "{\"owners\": [\"" + publicIdUser + "\"], \"asset\": {\"drug_name\": \"" + drug_name + "\", \"dose\": \"" + dose + "\", \"quantity\": \"" + quantity + "\", \"status\": \"Pending\"}}"
            };
            //gets API response
            fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/asset', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) {
                    transferToInventory(data.asset_id);
                    console.log(data);

                    alert("Thank you for your donation! Remedichain will contact you shortly with shipping information.") //Popup that displays a thank you message
                    location.assign("./account.html") //Reroutes to the home page
            });
            return [2 /*return*/];
        });
    });
}
exports.addDonation = addDonation;


//transfer ownership of a drug from a donor to the inventory with a pending status
function transferToInventory(assetId) {
    return __awaiter(this, void 0, void 0, function () {
        var publicIdInventory, publicIdUser, reqSpec;
        return __generator(this, function (_a) {
            localStorage.setItem("newAssetId", assetId);
            publicIdInventory = "b3155808a4067004115271b53a1313ab419f4a64";
            publicIdUser = "a33a569382be82588775ba9dcce2522399039c19";
            reqSpec = {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
                body: "{\"asset_id\": \"" + assetId + "\",\"new_owners\": [\"" + publicIdInventory + "\"],\"new_signer_public_id\": \"" + publicIdInventory + "\",\"owners\": [\"" + publicIdUser + "\"]}"
            };
            fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/transfer', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return console.log(data); });
            return [2 /*return*/];
        });
    });
}
exports.transferToInventory = transferToInventory;


/////////////////////////////////////////////////////////////
//Demo Functionality for Pharmacist to Approve a Medication//
/////////////////////////////////////////////////////////////

function pharmacistMedicationApproval() {
    //get newly created asset from localStorage for demo
    var assetId = localStorage.getItem("newAssetId");
    //set inventory private ID
    var privateIdInventory = 'c50188204aecb09d';
    queryByAssetId(assetId, privateIdInventory);
}
exports.pharmacistMedicationApproval = pharmacistMedicationApproval;


//query Medications with a specfic asset ID
function queryByAssetId(assetId, privateIdInventory) {
    var reqSpec = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "ID " + privateIdInventory
        },
        body: "{\"queryTql\": \"SELECT * FROM Medications WHERE asset_id = '" + assetId + "'\"}"
    };
    fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/assets/query', reqSpec)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
        updateMedicationStatus(data, privateIdInventory);
        console.log(data);
    });
}


//update the asset from Pending status to Approved status
function updateMedicationStatus(response, privateIdInventory) {
    return __awaiter(this, void 0, void 0, function () {
        var userAsset, assetId, reqSpec;
        return __generator(this, function (_a) {
            userAsset = response.assets[0].asset;
            assetId = response.assets[0].asset_id;
            userAsset.status = "Approved";
            reqSpec = {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "ID " + privateIdInventory
                },
                body: "{\"asset\": " + JSON.stringify(userAsset) + ", \"asset_id\": \"" + assetId + "\"}"
            };
            console.log(reqSpec.body);
            //Gets API response
            fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/asset', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return console.log(data); });
            return [2 /*return*/];
        });
    });
}


/////////////////////////
//Display the Inventory//
/////////////////////////

//query for the array of medications in inventory matching the specified status
function queryForInventory(status) {
    return __awaiter(this, void 0, void 0, function () {
        var privateIdInventory, reqSpec;
        return __generator(this, function (_a) {
            privateIdInventory = 'c50188204aecb09d';
            reqSpec = {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "ID " + privateIdInventory
                },
                body: "{\"queryTql\": \"SELECT * FROM Medications WHERE asset.status = '" + status + "'\"}"
            };
            fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/assets/query', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) {
                displayInventory(data.assets);
                console.log(data);
            });
            return [2 /*return*/];
        });
    });
}
exports.queryForInventory = queryForInventory;


//takes asset data to display the inventory as a table on the web page
function displayInventory(inventory) {
    var arrOfInventory = Array.from(Array(inventory.length), function () { return new Array(3); });
    for (var i = 0; i < inventory.length; i++) {
        arrOfInventory[i][0] = inventory[i].asset.drug_name;
        arrOfInventory[i][1] = inventory[i].asset.dose;
        arrOfInventory[i][2] = inventory[i].asset.quantity;
        //Temporary soln, print each asset to console
        console.log(arrOfInventory[i]);
    }

    //HTML code to show the table
    var table = document.getElementById('myTable')

    for (var i = 0; i < arrOfInventory.length; i++) {
        var row = `<tr>
                        <td>
                            <!--View Button-->
                            <button class="morebtn btn btn-primary" data-toggle="modal" data-target="#drugModal">
                                View
                            </button>
                        </td>
                        <td class="drugName">${arrOfInventory[i][0]}</td>
                        <td class="drugDose">${arrOfInventory[i][1]}</td>
                        <td class="drugQty">${arrOfInventory[i][2]}</td>
                    </tr>`
        table.innerHTML += row
    }
    localStorage.setItem("inventoryArray", arrOfInventory)
}

/////////////////////////////////
//Transfer Assets To Recipients//
/////////////////////////////////

//transfer ownership of an asset from the inventory to a recipient - in this case the same user as the donor
function transferfromInventory(assetId) {
    return __awaiter(this, void 0, void 0, function () {
        var privateIdInventory, publicIdInventory, publicIdUser, reqSpec;
        return __generator(this, function (_a) {
            privateIdInventory = "c50188204aecb09d";
            publicIdInventory = "b3155808a4067004115271b53a1313ab419f4a64";
            publicIdUser = "a33a569382be82588775ba9dcce2522399039c19";
            reqSpec = {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "ID " + privateIdInventory
                },
                body: "{\"asset_id\": \"" + assetId + "\",\"new_owners\": [\"" + publicIdUser + "\"],\"new_signer_public_id\": \"" + publicIdUser + "\",\"owners\": [\"" + publicIdInventory + "\"]}"
            };
            fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/Medications/transfer', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return console.log(data); });
            return [2 /*return*/];
        });
    });
}
exports.transferfromInventory = transferfromInventory;


/////////////////////////////
//Prescription Request Form//
/////////////////////////////

//adds a prescription to a user's data on the user blockchain after they fill out a presciption request form
function addUserPrescription(inputValues) {
    return __awaiter(this, void 0, void 0, function () {
        var prescription, privateIdInventory;
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
                    privateIdInventory = 'c50188204aecb09d';
                    return [4 /*yield*/, queryByUserEmail(privateIdInventory, prescription)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addUserPrescription = addUserPrescription;

//Check RemedichainUsers dictionary for the user asset based off of the email of the current user logged in
function queryByUserEmail(privateIdInventory, prescription) {
    return __awaiter(this, void 0, void 0, function () {
        var reqSpec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reqSpec = {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': "ID " + privateIdInventory
                        },
                        body: "{\"queryTql\": \"SELECT * FROM RemedichainUsers WHERE asset.user_email = 'johndoenor@gmail.com'\"}"
                    };
                    return [4 /*yield*/, fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/RemedichainUsers/assets/query', reqSpec)
                            .then(function (resp) { return resp.json(); })
                            .then(function (data) {
                                updateUserPrescriptions(data, privateIdInventory, prescription);
                                console.log(data);

                                alert("Your prescription request has been recieved. Remedichain will be in contact with you shortly!") //Popup that displays a thank you message
                                location.assign("./account.html") //Reroutes to the home page
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}

//update the user prescriptions array on the chain of user data
function updateUserPrescriptions(response, privateIdInventory, prescription) {
    return __awaiter(this, void 0, void 0, function () {
        var userAsset, assetId, reqSpec;
        return __generator(this, function (_a) {
            userAsset = response.assets[0].asset;
            assetId = response.assets[0].asset_id;
            userAsset.prescriptions.push(prescription);
            reqSpec = {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "ID " + privateIdInventory
                },
                body: "{\"asset\": " + JSON.stringify(userAsset) + ", \"asset_id\": \"" + assetId + "\"}"
            };
            //Gets API response
            fetch('https://testnet.burstiq.com/api/burstchain/mines_summer/RemedichainUsers/asset', reqSpec)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return console.log(data); });
            return [2 /*return*/];
        });
    });
}