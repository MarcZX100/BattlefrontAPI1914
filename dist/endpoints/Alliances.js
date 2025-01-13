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
exports.AllianceApi = void 0;
/**
 * Represents the API client for managing and retrieving information about alliances.
 */
class AllianceApi {
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
    getDetails(allianceID_1) {
        return __awaiter(this, arguments, void 0, function* (allianceID, members = true) {
            const startTime = Date.now();
            const data = {
                allianceID: allianceID,
                members: members ? 1 : 0,
                invites: 0,
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
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const data = {
                allianceID: allianceID,
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
    search(name_1) {
        return __awaiter(this, arguments, void 0, function* (name, exactResult = false) {
            const startTime = Date.now();
            const data = {
                name: name,
            };
            const result = yield this.apiClient.sendRequest("searchAlliance", data);
            if (exactResult) {
                const exactMatch = (result.result).find((x) => x.properties.name.toLowerCase() === name.toLowerCase());
                if (exactMatch) {
                    result.result = [exactMatch];
                }
                else {
                    result.resultCode = -1;
                    result.resultMessage = "not found";
                }
            }
            if ((result.result).length === 0) {
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
    getRanking() {
        return __awaiter(this, arguments, void 0, function* (page = 0, numEntries = 10) {
            const startTime = Date.now();
            if (numEntries > 50) {
                console.warn("The maximum number of entries allowed is 50.");
            }
            else if (numEntries < 10) {
                console.warn("The minimum number of entries allowed is 10.");
            }
            const data = {
                page: page,
                numEntries: numEntries,
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
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const data = {};
            const result = yield this.apiClient.sendRequest("getAlliances", data);
            result.elapsedTime = Date.now() - startTime;
            return result;
        });
    }
}
exports.AllianceApi = AllianceApi;
