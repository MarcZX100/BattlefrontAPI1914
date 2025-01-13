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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattlefrontAPI = void 0;
const requestBuilder_1 = require("./requestBuilder");
const Util_1 = require("./endpoints/Util");
const Users_1 = require("./endpoints/Users");
const Games_1 = require("./endpoints/Games");
const Alliances_1 = require("./endpoints/Alliances");
class BattlefrontAPI {
    constructor(config) {
        this.config = config;
        this.Util = new Util_1.UtilApi(this);
        this.Users = new Users_1.UserApi(this);
        this.Games = new Games_1.GameApi(this);
        this.Alliances = new Alliances_1.AllianceApi(this);
    }
    sendRequest(action_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (action, data, retry = false) {
            const { url, postData, type } = requestBuilder_1.RequestBuilder.prepare(action, data, this.config);
            try {
                const response = yield fetch(url, {
                    headers: {
                        accept: '*/*',
                        'accept-language': 'en-US,en;q=0.9',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        priority: 'u=1, i',
                        'sec-ch-ua': '"Chromium";v="130", "Opera GX";v="115", "Not?A_Brand";v="99"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'x-requested-with': 'XMLHttpRequest',
                    },
                    body: type === 'POST' ? postData : undefined,
                    method: type,
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return yield response.json();
            }
            catch (error) {
                console.error(`Error during API call to "${action}":`, error);
                if (retry) {
                    console.log('Retrying...');
                    return new Promise((resolve) => setTimeout(() => resolve(this.sendRequest(action, data, retry)), 5000));
                }
                throw error;
            }
        });
    }
    sendGameRequest(gameID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://${data.gameServer}/`, {
                    "headers": {
                        "accept": "text/plain, */*; q=0.01",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "sec-ch-ua": "\"Chromium\";v=\"130\", \"Opera GX\";v=\"115\", \"Not?A_Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site"
                    },
                    "body": JSON.stringify({
                        "requestID": 0,
                        "@c": "ultshared.action.UltUpdateGameStateAction",
                        "actions": [{
                                "requestID": "actionReq-1",
                                "@c": "ultshared.action.UltLoginAction",
                                "resolution": "1920x1080"
                            }],
                        "lastCallDuration": 0,
                        "client": "s1914-client-ultimate",
                        "siteUserID": 0,
                        "adminLevel": 0,
                        "gameID": gameID,
                        "playerID": 0,
                        "stateType": data.stateID,
                        "option": data.option,
                        "rights": data.rights,
                        "userAuth": data.userAuth,
                        "tstamp": data.tstamp
                    }),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "omit"
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return yield response.json();
            }
            catch (error) {
                console.error(`Error during call to server "${data.gameServer}":`, error);
                throw error;
            }
        });
    }
}
exports.BattlefrontAPI = BattlefrontAPI;
// export const client = new BattlefrontAPI(config);
