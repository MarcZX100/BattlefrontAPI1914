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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BytroFront = void 0;
const requestBuilder_1 = require("./requestBuilder");
const errors_1 = __importDefault(require("./errors"));
const Util_1 = require("./endpoints/Util");
const Users_1 = require("./endpoints/Users");
const Games_1 = require("./endpoints/Games");
const Alliances_1 = require("./endpoints/Alliances");
/**
 * Represents the BytroFront client, providing access to various API endpoints
 * and utilities for interacting with the game server.
 */
class BytroFront {
    /**
     * Initializes the API client with a configuration object and sets up endpoint access.
     *
     * @param config - A configuration object containing settings required for API communication.
     */
    constructor(config) {
        this.config = config;
        this.errors = errors_1.default;
        this.Util = new Util_1.UtilApi(this);
        this.Users = new Users_1.UserApi(this);
        this.Games = new Games_1.GameApi(this);
        this.Alliances = new Alliances_1.AllianceApi(this);
    }
    /**
     * Sends a generic request to the API server with the specified action and data payload.
     *
     * @template T - The expected return type of the response.
     * @param action - The action or endpoint to call on the API server.
     * @param data - The payload data to include in the request, provided as key-value pairs.
     * @returns A promise resolving to the response from the server.
     * @throws Will throw an error if the request fails or if the server returns a non-OK status.
     *
     * @example
     * ```typescript
     * const response = await api.sendRequest('getUserDetails', { userID: 48035824 });
     * console.log(response);
     * ```
     */
    sendRequest(action, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, postData, type } = requestBuilder_1.RequestBuilder.prepare(action, data, this.config);
            try {
                const response = yield fetch(url, {
                    headers: {
                        'accept': '*/*',
                        'accept-language': 'en-US,en;q=0.9',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'x-requested-with': 'XMLHttpRequest',
                    },
                    body: type === 'POST' ? postData : undefined,
                    method: type,
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP request failed with status: ${response.statusText}`);
                }
                return yield response.json();
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Sends a game-specific request to a specified game server.
     *
     * @template T - The expected return type of the response.
     * @param gameID - The unique identifier of the game.
     * @param data - The payload data to include in the request, including game-specific details.
     * @returns A promise resolving to the response from the game server, typed as `T`.
     * @throws Will throw an error if the request fails or if the server returns a non-OK status.
     *
     * @example
     * ```typescript
     * const response = await api.sendGameRequest<GameState>('9182721', {
     *   gameServer: 'xxxxxxxx.c.bytro.com',
     *   stateID: 2,
     *   option: 3,
     *   rights: 'chat',
     *   userAuth: 'hash',
     *   tstamp: '1982337111',
     * });
     * console.log(response);
     * ```
     */
    sendGameRequest(gameID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://${data.gameServer}/`, {
                    headers: {
                        accept: "text/plain, */*; q=0.01",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        requestID: 0,
                        "@c": "ultshared.action.UltUpdateGameStateAction",
                        actions: [
                            {
                                requestID: "actionReq-1",
                                "@c": "ultshared.action.UltLoginAction",
                                resolution: "1920x1080",
                            },
                        ],
                        lastCallDuration: 0,
                        client: "s1914-client-ultimate",
                        siteUserID: 0,
                        adminLevel: 0,
                        gameID: gameID,
                        playerID: 0,
                        stateType: data.stateID,
                        option: data.option,
                        rights: data.rights,
                        userAuth: data.userAuth,
                        tstamp: data.tstamp,
                    }),
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                });
                if (!response.ok) {
                    throw new Error(`HTTP request failed with status: ${response.statusText}`);
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
exports.BytroFront = BytroFront;
