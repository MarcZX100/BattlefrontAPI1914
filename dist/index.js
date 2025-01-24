"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BytroFront: () => BytroFront
});
module.exports = __toCommonJS(index_exports);

// src/requestBuilder.ts
var import_js_sha1 = require("js-sha1");
var RequestBuilder = class {
  /**
   * Extracts the value of a specific query parameter from a given URL.
   *
   * @param name - The name of the parameter to retrieve.
   * @param url - The URL string to parse for the parameter.
   * @returns The value of the parameter if found, otherwise `null`.
   *
   * @example
   * ```typescript
   * const url = "https://www.supremacy1914.com/index.php?action=log&hash=yes&outputFormat=json&L=0";
   * const value = RequestBuilder.getParameterByName("outputFormat", url);
   * console.log(value); // Outputs: "0"
   * ```
   */
  static getParameterByName(name, url) {
    var _a;
    const regex = new RegExp(`[?&]${name.replace(/[[]]/g, "\\$&")}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    return results ? decodeURIComponent(((_a = results[2]) == null ? void 0 : _a.replace(/\+/g, " ")) || "") : null;
  }
  /**
   * Prepares an API request by encoding data, generating hashes, and constructing the request URL and payload.
   *
   * @param action - The API action or endpoint being invoked.
   * @param data - The payload to be sent with the request as key-value pairs.
   * @param config - Configuration object containing keys, user information, and other API settings.
   *   - `config.webapi.key` - The API key.
   *   - `config.webapi.version` - The API version.
   *   - `config.uber.authTstamp` - The authentication timestamp.
   *   - `config.uber.authHash` - The authentication hash.
   *   - `config.userId` - The ID of the authenticated user.
   *   - `config.trackingSource` - The source of the tracking data.
   *   - `config.websiteURL` - The base URL for the API.
   *   - Amongst many others.
   *
   * @returns An object containing:
   *   - `url`: The constructed request URL.
   *   - `postData`: The encoded payload to send with the request.
   *   - `type`: The HTTP method to use (always "POST").
   *
   * @example
   * ```typescript
   * const action = "getUserDetails";
   * const data = { userID: 12345 };
   * const config = {
   *   webapi: { key: "apiKey", version: "1.0" },
   *   uber: { authTstamp: "1276123139", authHash: "secureHash" },
   *   userId: "user123",
   *   trackingSource: "web",
   *   websiteURL: "https://supremacy1914.com/",
   * };
   *
   * const requestDetails = RequestBuilder.prepare(action, data, config);
   * console.log(requestDetails);
   * // Outputs:
   * // {
   * //   url: "https://supremacy1914.com/index.php?eID=api&key=apiKey&action=getUserDetails&hash=...",
   * //   postData: "data=...",
   * //   type: "POST",
   * // }
   * ```
   */
  static prepare(action, data, config) {
    const { key } = config.webapi;
    const { authTstamp, authHash } = config.uber;
    const { userId, trackingSource, websiteURL } = config;
    if (key !== "open") {
      Object.assign(data, { authTstamp, authUserID: userId });
    }
    data.source = trackingSource;
    const asParam = Object.entries(data).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v != null ? v : "")}`).join("&");
    const encoded = btoa(asParam);
    const postData = `data=${encoded}`;
    const hashBase = key === "open" ? `${key}${action}${encodeURIComponent(encoded)}` : `${key}${action}${asParam}${authHash}`;
    const hash = (0, import_js_sha1.sha1)(hashBase);
    const L = this.getParameterByName("L", websiteURL) || 0;
    const apiUrl = `${websiteURL}index.php?eID=api&key=${key}`;
    const url = `${apiUrl}&action=${action}&hash=${hash}&outputFormat=json&apiVersion=${config.webapi.version}&L=${L}&source=${trackingSource}`;
    return { url, postData, type: "POST" };
  }
};

// src/errors.ts
var CustomErrors = class {
  /**
   * Retrieves a structured error object based on a given result message.
   *
   * @param resultMessage - The error message to look up.
   * @returns An object containing the error details, including result codes,
   *          detailed messages, and additional metadata. If the error is not
   *          found, a default "unknown error" response is returned.
   *
   * @example
   * ```typescript
   * const error = CustomErrors.getError("game not found");
   * console.log(error);
   * // {
   * //   resultCode: -1,
   * //   resultMessage: "game not found",
   * //   resultMessageLarge: "The provided game ID was not found. Have you entered the proper client configuration?",
   * //   result: null,
   * //   version: "4831_live"
   * // }
   * ```
   */
  static getError(resultMessage) {
    const error = this.errors[resultMessage];
    return {
      resultCode: error ? error.resultCode : -1,
      resultMessage,
      resultMessageLarge: error ? error.resultMessageLarge : "Unknown error",
      result: error ? error.result : null,
      version: "4831_live"
      // I don't really know if the real API version changes, so as of now I'll keep it like this.
    };
  }
};
/**
 * A map of predefined errors, keyed by their result messages, providing
 * additional details such as result codes and detailed error descriptions.
 */
CustomErrors.errors = {
  "game not found": {
    resultCode: -1,
    resultMessageLarge: "The provided game ID was not found. Have you entered the proper client configuration?",
    result: null
  },
  "user not found": {
    resultCode: -1,
    resultMessageLarge: "The provided user ID was not found. Have you entered the proper client configuration?",
    result: null
  }
};
var errors_default = CustomErrors;

// src/index.ts
var import_puppeteer = __toESM(require("puppeteer"));
var import_jsdom = require("jsdom");

// src/endpoints/Util.ts
var UtilApi = class {
  /**
   * Creates an instance of the UtilApi class.
   * @param {Record<string, any>} apiClient - The API client instance used to send requests.
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.contentItems = {};
  }
  /**
   * Retrieves content items for a specific language.
   * The content items include various game elements such as units, upgrades, ranks, awards, etc.
   * 
   * @param {string} [lang="en"] - The language for which to retrieve the content items (default is English).
   * @returns {Promise<any>} - A promise resolving to the content items in the specified language.
   */
  getContentItems(lang = "en") {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {
        locale: lang,
        units: 1,
        upgrades: 1,
        ranks: 1,
        awards: 1,
        mods: 1,
        premiums: 1,
        scenarios: 1,
        title: 1,
        researches: 1,
        item_packs: 1
      };
      const result = yield this.apiClient.sendRequest("getContentItems", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Retrieves content items for a specific language.
   * This method fetches the content items by first searching for a game and then getting its associated items.
   * This way, items are more complete in regards of data and are also already properly organized.
   * 
   * @param {string} [lang="en"] - The language for which to retrieve the complete content items (default is English).
   * @returns {Promise<any>} - A promise resolving to the complete content items associated with the game.
   */
  getCompleteContentItems(lang = "en") {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const gameList = yield this.apiClient.Games.search(5, 0, lang, "", 8);
      const targetGameID = gameList.result.games[0].properties.gameID;
      const result = yield this.apiClient.Games.getItems(targetGameID);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Loads the complete content items and stores them in the `contentItems` property.
   * This method calls `getCompleteContentItems` and updates the `contentItems` state.
   * 
   * @param {string} [lang="en"] - The language for which to load the complete content items (default is English).
   * @returns {Promise<Record<string, any>>} - A promise resolving to the loaded content items.
   */
  loadContentItems(lang = "en") {
    return __async(this, null, function* () {
      this.contentItems = yield this.getCompleteContentItems(lang).then((result) => {
        return result.result;
      });
      return this.contentItems;
    });
  }
};

// src/endpoints/Users.ts
var UserApi = class {
  /**
   * Creates an instance of the UserApi class.
   * @param {Record<string, any>} apiClient - The API client instance used to send requests.
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.defaultUserOptionsArray = ["username", "avatarURL", "regTstamp", "alliance", "rankProgress", "gameStats"];
    this.allUserOptionsArray = ["acl", "alliance", "allianceInvites", "allianceMemberShip", "askForEmail", "askForPassword", "avatarURL", "country", "deletionStatus", "email", "emailChangeRequest", "inventory", "isPaying", "battlePassProgress", "lastOfferPurchaseTimeSeconds", "links", "minModVersion", "notifications", "pushNotificationPreferences", "rank", "rankProgress", "referrer", "regTstamp", "shopPlatform", "showSocialMediaButtons", "isAllowedToShowStoreLinks", "sources", "subscriptions", "unreadMessages", "useFastPaypalCheckout", "username", "useShop2017", "canAdjustEmail", "shouldDisableInGameUserRegistration", "canUseInventorySystem", "publisherID", "qualityMatchAdsSupport", "useFirefly", "mayUseGgsShopWithoutPaymentMethods", "stats", "scenarioStats", "awardProgress", "gameStats"];
    this.rankingOptionsArray = ["monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank"];
  }
  /**
   * Retrieves detailed information for a specific user by their user ID.
   * Allows for the selection of specific properties to retrieve.
   * 
   * @param {number} userID - The unique identifier of the user.
   * @param {string[]} [options=this.defaultUserOptionsArray] - Optional list of user properties to include in the response.
   * @returns {Promise<any>} - A promise resolving to the user details, including the requested properties.
   */
  getDetails(_0) {
    return __async(this, arguments, function* (userID, options = this.defaultUserOptionsArray) {
      const startTime = Date.now();
      const data = { userID };
      if (Array.isArray(options)) {
        options.forEach((option) => {
          if (this.allUserOptionsArray.includes(option)) {
            data[option] = 1;
          } else {
            console.warn(`The "${option}" option does not exist.`);
          }
        });
      }
      const result = yield this.apiClient.sendRequest("getUserDetails", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Searches for a user by their username.
   * Optionally allows for an exact match search.
   * 
   * @param {string} username - The username to search for.
   * @param {boolean} [exactResult=false] - Flag to indicate whether the search should return only an exact match.
   * @returns {Promise<any>} - A promise resolving to the search results.
   */
  search(username, exactResult = false) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {
        username
      };
      const result = yield this.apiClient.sendRequest("searchUser", data);
      if (exactResult) {
        if (result.result.find((x) => x.username.toLowerCase() == username.toLowerCase())) {
          result.result = [result.result.find((x) => x.username.toLowerCase() == username.toLowerCase())];
        } else {
          result.resultCode = -1;
          result.resultMessage = "not found";
        }
      }
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Sends a private message (PM) to a user.
   * 
   * @param {number} targetUserID - The user ID of the recipient.
   * @param {string} subject - The subject of the message.
   * @param {string} body - The body/content of the message.
   * @returns {Promise<any>} - A promise resolving to the result of the message sending request.
   */
  sendMail(targetUserID, subject, body) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {
        receiverID: targetUserID,
        subject,
        body,
        mode: "pm"
      };
      const result = yield this.apiClient.sendRequest("sendMessage", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Retrieves a ranking list based on a specified ranking type.
   * Allows pagination and selection of the number of entries to return.
   * 
   * @param {string} [type="globalRank"] - The type of ranking to fetch. Types allowed: "monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank".
   * @param {number} [page=0] - The page number for pagination.
   * @param {number} [numEntries=10] - The number of entries to retrieve per page.
   * @returns {Promise<any>} - A promise resolving to the ranking data for the selected type.
   */
  getRanking(type = "globalRank", page = 0, numEntries = 10) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      if (numEntries > 50) {
        console.warn("The maximum number of entries allowed is 50.");
      } else if (numEntries < 5) {
        console.warn("The minimum number of entries allowed is 5.");
      }
      const data = {
        type,
        page,
        numEntries
      };
      if (!this.rankingOptionsArray.includes(type)) {
        return {
          resultCode: -1,
          resultMessage: "incorrect option",
          result: `The ${type} type does not exist.`,
          elapsedTime: Date.now() - startTime,
          receivedData: data
        };
      }
      const result = yield this.apiClient.sendRequest("getRankingFirefly", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
};

// src/endpoints/Games.ts
var GameApi = class {
  /**
   * Creates an instance of the GameApi class.
   *
   * @param apiClient - An object that handles sending requests to the backend API.
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.availableServerLanguages = [
      "cs",
      "de",
      "el",
      "en",
      "es",
      "fr",
      "id",
      "it",
      "ja",
      "nl",
      "pl",
      "pt",
      "ru",
      "tr"
    ];
  }
  /**
   * Retrieves the token for a specific game.
   *
   * @param gameID - The identifier of the game.
   * @returns A promise resolving to the game token or an error if the game is not found.
   */
  getToken(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = { gameID };
      let result = yield this.apiClient.sendRequest("getGameToken", data);
      if (result.resultCode !== 0) {
        result = this.apiClient.errors.getError("game not found");
      }
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Searches for games based on various filters.
   *
   * @param numEntries - Number of entries to fetch (min 5, max 50). Defaults to 10.
   * @param page - The page number to fetch. Defaults to 0.
   * @param lang - Language filter. Defaults to "en".
   * @param filter - Search string for filtering. Optional.
   * @param scenarioID - Scenario ID for filtering. Optional.
   * @returns A promise resolving to the search results.
   */
  search(numEntries = 10, page = 0, lang = "en", filter = "", scenarioID = null) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      if (!this.availableServerLanguages.includes(lang)) {
        console.warn(`Language ${lang} does not exist.`);
        lang = "en";
      }
      if (numEntries > 50) {
        console.warn("The maximum number of entries allowed is 50.");
      } else if (numEntries < 5) {
        console.warn("The minimum number of entries allowed is 5.");
      }
      const data = {
        numEntriesPerPage: numEntries,
        page,
        lang,
        isFilterSearch: !!filter,
        search: filter || null,
        global: 1,
        loadUserLoginData: 1,
        scenarioID
      };
      const result = yield this.apiClient.sendRequest("getGames", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches original game overview. This call takes exceedingly longer, which is why {@link getOverview} was created.
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game overview.
   */
  getOverviewOld(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = { gameID };
      const result = yield this.apiClient.sendRequest("getGame", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches a detailed overview of a game, including properties and player details.
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game overview or an error if the game is not found.
   */
  getOverview(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const properties = yield this.apiClient.sendRequest("getGames", { gameID }).then((result2) => {
        var _a;
        return (_a = result2.result[0]) == null ? void 0 : _a.properties;
      });
      const players = yield this.getAdvancedDetails(gameID, 1);
      if (!properties || typeof players.result !== "object") {
        return this.apiClient.errors.getError("game not found");
      }
      const realPlayers = Object.values(players.result.players).filter((x) => x.siteUserID > 1);
      const finalDictionary = realPlayers.reduce((dict, x) => {
        dict[x.siteUserID] = {
          siteUserID: x.siteUserID,
          playerID: x.playerID,
          login: x.userName,
          nation: x.nationName,
          teamID: x.teamID
        };
        return dict;
      }, {});
      const userDetails = yield Promise.all(
        Object.keys(finalDictionary).map(
          (siteUserID) => this.apiClient.Users.getDetails(siteUserID)
        )
      );
      userDetails.forEach((user) => {
        const userId = user.result.id;
        if (finalDictionary[userId]) {
          finalDictionary[userId].profile = user.result;
        }
      });
      const result = {
        resultCode: 0,
        resultMessage: "ok",
        result: {
          logins: Object.values(finalDictionary),
          properties
        },
        version: "4831_live",
        elapsedTime: Date.now() - startTime
      };
      return result;
    });
  }
  /**
   * Fetches an overview of a game, only including properties.
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game overview or an error if the game is not found.
   */
  getOverviewProperties(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const properties = yield this.apiClient.sendRequest("getGames", { gameID }).then((result2) => {
        var _a;
        return (_a = result2.result[0]) == null ? void 0 : _a.properties;
      });
      if (!properties) {
        return this.apiClient.errors.getError("game not found");
      }
      const result = {
        resultCode: 0,
        resultMessage: "ok",
        result: properties,
        version: "4831_live",
        elapsedTime: Date.now() - startTime
      };
      return result;
    });
  }
  /**
   * Fetches advanced game details based on state and state-specific options.
   *
   * @param gameID - The unique identifier for the game.
   * @param stateID - The state ID to fetch. Defaults to 0 which equals all.
   * @param stateOption - Additional state option. Optional.
   * @returns A promise resolving to the game details or an error if the game is not found.
   */
  getAdvancedDetails(gameID, stateID = 0, stateOption = null) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const tokenRaw = yield this.getToken(gameID);
      if (tokenRaw.resultCode !== 0) {
        return this.apiClient.errors.getError("game not found");
      }
      const token = tokenRaw.result.token;
      const data = {
        gameServer: token.gs,
        stateID,
        option: stateOption,
        rights: token.rights,
        userAuth: token.authHash,
        tstamp: token.authTstamp
      };
      const result = yield this.apiClient.sendGameRequest(gameID, data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches game details with all states (stateID 0).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game details or an error if the game is not found.
   */
  getDetails(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 0);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches players for a given game (stateID 1).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game players or an error if the game is not found.
   */
  getPlayers(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 1);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches the newspaper for a specific day in the game (stateID 2).
   *
   * @param gameID - The unique identifier for the game.
   * @param day - The day to fetch the newspaper for.
   * @returns A promise resolving to the game newspaper or an error if the game is not found.
   */
  getNewspaper(gameID, day) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 2, day);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches all newspapers for a game (stateID 2).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to all the game newspapers or an error if the game is not found.
   */
  getAllNewspaper(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const resultLastDay = yield this.getAdvancedDetails(gameID, 2);
      const lastDay = resultLastDay.result.day;
      const allNewspaper = yield Promise.all(
        Array.from({ length: lastDay + 1 }, (_, i) => i).map(
          (day) => this.getNewspaper(gameID, day).then((x) => {
            return x.result;
          })
        )
      );
      const result = {
        resultCode: 0,
        resultMessage: "ok",
        result: allNewspaper,
        version: "4831_live",
        elapsedTime: Date.now() - startTime
      };
      return result;
    });
  }
  /**
   * Fetches provinces data for a given game (stateID 3).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the provinces data or an error if the game is not found.
   */
  getProvinces(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 3);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches a map with province statistics for a given game (stateID 3).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the map with province statistics or an error if the game is not found.
   */
  getMap(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 3);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches the scenario statistics for a game (stateID 12).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the scenario statistics or an error if the game is not found.
   */
  getScenarioStatistics(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 12);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches game-related statistics (stateID 30).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game statistics or an error if the game is not found.
   */
  getStatistics(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 30);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
};

// src/endpoints/Alliances.ts
var AllianceApi = class {
  /**
   * Constructs a new instance of the `AllianceApi` class.
   * 
   * @param apiClient - The API client instance for sending requests.
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
  /**
   * Retrieves detailed information about a specific alliance.
   * 
   * @param allianceID - The alliance's identifier.
   * @param members - Whether to include the list of alliance members in the response. Defaults to `true`.
   * @returns A promise resolving to the details of the specified alliance, including elapsed time.
   */
  getDetails(allianceID, members = true) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {
        allianceID,
        members: members ? 1 : 0,
        invites: 0
      };
      const result = yield this.apiClient.sendRequest("getAlliance", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Retrieves battle statistics for a given alliance.
   * 
   * @param allianceID - The alliance's identifier.
   * @returns A promise resolving to the battle statistics of the specified alliance, including elapsed time.
   */
  getBattles(allianceID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {
        allianceID
      };
      const result = yield this.apiClient.sendRequest("getAllianceBattleStats", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Searches for alliances by name.
   * 
   * @param name - The name of the alliance to search for.
   * @param exactResult - Whether to return only exact matches for the alliance name. Defaults to `false`.
   * @returns A promise resolving to the search results, including elapsed time.
   * If `exactResult` is `true`, only exact matches are returned.
   * If no matches are found, the result code and message indicate "not found."
   */
  search(name, exactResult = false) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {
        name
      };
      const result = yield this.apiClient.sendRequest("searchAlliance", data);
      if (exactResult) {
        const exactMatch = result.result.find(
          (x) => x.properties.name.toLowerCase() === name.toLowerCase()
        );
        if (exactMatch) {
          result.result = [exactMatch];
        } else {
          result.resultCode = -1;
          result.resultMessage = "not found";
        }
      }
      if (result.result.length === 0) {
        result.resultCode = -1;
        result.resultMessage = "not found";
      }
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Retrieves the alliance ranking, paginated by the specified page and number of entries.
   * 
   * @param page - The page of the ranking to retrieve. Defaults to `0`.
   * @param numEntries - The number of entries to retrieve per page. Defaults to `10`.
   *                     Must be between `10` and `50`. If out of range, a warning is logged.
   * @returns A promise resolving to the alliance ranking, including elapsed time.
   */
  getRanking(page = 0, numEntries = 10) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      if (numEntries > 50) {
        console.warn("The maximum number of entries allowed is 50.");
      } else if (numEntries < 10) {
        console.warn("The minimum number of entries allowed is 10.");
      }
      const data = {
        page,
        numEntries
      };
      const result = yield this.apiClient.sendRequest("getAllianceRanking", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Retrieves a list of open alliances. The result typically includes 30 alliances
   * that are not full, but the response cannot be further filtered.
   * 
   * @returns A promise resolving to the list of open alliances, including elapsed time.
   */
  getOpenAlliances() {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = {};
      const result = yield this.apiClient.sendRequest("getAlliances", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
};

// src/index.ts
var BytroFront = class _BytroFront {
  /**
   * Initializes the API client with a configuration object and sets up endpoint access.
   * If the config was generated with the generateConfig method, the class's config will update automatically every 6 days
   * 
   * @param config - A configuration object containing settings required for API communication.
   */
  constructor(config) {
    this.config = config;
    this.errors = errors_default;
    this.Util = new UtilApi(this);
    this.Users = new UserApi(this);
    this.Games = new GameApi(this);
    this.Alliances = new AllianceApi(this);
    if (this.config.customPackageDetails && this.config.customPackageDetails.autoGenerate) {
      setInterval(() => __async(this, null, function* () {
        this.config = yield _BytroFront.generateConfig(this.config.customPackageDetails.username, this.config.customPackageDetails.password, this.config.customPackageDetails.domain);
        console.log(this.config);
      }), 6 * 24 * 60 * 60 * 1e3);
    }
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
    return __async(this, null, function* () {
      const { url, postData, type } = RequestBuilder.prepare(action, data, this.config);
      try {
        const response = yield fetch(url, {
          headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest"
          },
          body: type === "POST" ? postData : void 0,
          method: type,
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error(`HTTP request failed with status: ${response.statusText}`);
        }
        return yield response.json();
      } catch (error) {
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
    return __async(this, null, function* () {
      try {
        const response = yield fetch(`https://${data.gameServer}/`, {
          headers: {
            accept: "text/plain, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: JSON.stringify({
            requestID: 0,
            "@c": "ultshared.action.UltUpdateGameStateAction",
            actions: [
              {
                requestID: "actionReq-1",
                "@c": "ultshared.action.UltLoginAction",
                resolution: "1920x1080"
              }
            ],
            lastCallDuration: 0,
            client: "s1914-client-ultimate",
            siteUserID: 0,
            adminLevel: 0,
            gameID,
            playerID: 0,
            stateType: data.stateID,
            option: data.option,
            rights: data.rights,
            userAuth: data.userAuth,
            tstamp: data.tstamp
          }),
          method: "POST",
          mode: "cors",
          credentials: "omit"
        });
        if (!response.ok) {
          throw new Error(`HTTP request failed with status: ${response.statusText}`);
        }
        return yield response.json();
      } catch (error) {
        console.error(`Error during call to server "${data.gameServer}":`, error);
        throw error;
      }
    });
  }
  /**
  * Generates a configuration object by simulating a login process for the specified domain.
  *
  * This method uses Puppeteer to automate a browser session and interacts with the login
  * page of the given domain. After logging in, it retrieves an iframe source, navigates to it,
  * and extracts the configuration object from the page.
  *
  * @param username - The username to log in with.
  * @param password - The password to log in with.
  * @param domain - The domain to target for login and configuration retrieval. Defaults to "supremacy1914.com".
  *                 Examples:
  *                 - "supremacy1914.com" for Supremacy 1914 (default)
  *                 - "callofwar.com" for Call of War
  *                 - "ironorder1919.com" for Iron Order
  *                 - "supremacy1914.es" for the Spanish version of Supremacy 1914 (still allows data scrapping in other languages)
  * @param autoGenerate - Whether to auto generate login every 6 days when being handled by BytroFront instance.
  * @returns A Promise resolving to the configuration object extracted from the domain.
  * @throws An error if the iframe source cannot be located or if the configuration retrieval fails.
  *
  * @example
  * ```typescript
  * const config = await generateConfig("exampleUser", "examplePass", "callofwar.com");
  * console.log(config);
  * ```
  */
  static generateConfig(username, password, domain = "supremacy1914.com", autoGenerate = true) {
    return __async(this, null, function* () {
      let browser;
      let page;
      let newPage;
      try {
        if (!username || !password) {
          throw new Error("Username and password are required");
        }
        const enlace = `https://www.${domain}/index.php?id=188`;
        browser = yield import_puppeteer.default.launch({ headless: true });
        page = yield browser.newPage();
        yield page.goto(enlace);
        try {
          yield page.click(".login_text");
        } catch (e) {
          yield page.click("#sg_login_text");
        }
        yield page.type("#loginbox_login_input", username);
        yield page.type("#loginbox_password_input", password);
        yield page.click("#func_loginbutton");
        const iframeSrc = yield Promise.race([
          new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Iframe response timed out")), 1e4);
            page.on("response", (response) => __async(this, null, function* () {
              if (response.url().endsWith("/game.php?bust=1")) {
                clearTimeout(timeout);
                const responseBody = yield response.text();
                const dom = new import_jsdom.JSDOM(responseBody);
                const iframe = dom.window.document.querySelector("#ifm");
                resolve(iframe ? iframe.src : "");
              }
            }));
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Iframe response timed out")), 1e4))
        ]);
        if (!iframeSrc) {
          throw new Error("Iframe source not found");
        }
        page.removeAllListeners("response");
        yield page.close();
        newPage = yield browser.newPage();
        yield newPage.goto(iframeSrc);
        const config = yield Promise.race([
          new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Config response timed out")), 1e4);
            newPage.on("response", (response) => __async(this, null, function* () {
              try {
                if (response.url().includes("/index.php?action=getGames")) {
                  const config2 = yield newPage.evaluate(() => {
                    var _a, _b;
                    const hupConfig = (_b = (_a = window.hup) == null ? void 0 : _a.config) != null ? _b : null;
                    return hupConfig;
                  });
                  clearTimeout(timeout);
                  if (config2) {
                    config2.customPackageDetails = { username, password, domain, autoGenerate };
                    resolve(config2);
                  } else {
                    reject(new Error("Config not found in the page"));
                  }
                }
              } catch (error) {
                clearTimeout(timeout);
                reject(error);
              }
            }));
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Config response timed out")), 1e4))
        ]);
        if (!config) {
          throw new Error("Failed to retrieve configuration");
        }
        return config;
      } catch (error) {
        console.error("Error in generateConfig:", error);
        throw error;
      } finally {
        if (newPage && !newPage.isClosed()) {
          newPage.removeAllListeners("response");
          yield newPage.close();
        }
        if (page && !page.isClosed()) {
          page.removeAllListeners("response");
          yield page.close();
        }
        if (browser) yield browser.close();
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BytroFront
});
//# sourceMappingURL=index.js.map