/**
 * Represents the API client for managing and retrieving information about alliances.
 */
export class AllianceApi {
  /**
   * The API client instance used to send requests.
   */
  private apiClient: Record<string, any>;

  /**
   * Constructs a new instance of the `AllianceApi` class.
   * 
   * @param apiClient - The API client instance for sending requests.
   */
  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
  }

  /**
   * Retrieves detailed information about a specific alliance.
   * 
   * @param allianceID - The alliance's identifier.
   * @param members - Whether to include the list of alliance members in the response. Defaults to `true`.
   * @returns A promise resolving to the details of the specified alliance, including elapsed time.
   */
  async getDetails(allianceID: number, members: boolean = true) {
    const startTime = Date.now();
    const data = {
      allianceID: allianceID,
      members: members ? 1 : 0,
      invites: 0,
    };

    const result = await this.apiClient.sendRequest("getAlliance", data);
    result.elapsedTime = Date.now() - startTime;
    return result;
  }

  /**
   * Retrieves battle statistics for a given alliance.
   * 
   * @param allianceID - The alliance's identifier.
   * @returns A promise resolving to the battle statistics of the specified alliance, including elapsed time.
   */
  async getBattles(allianceID: number) {
    const startTime = Date.now();
    const data = {
      allianceID: allianceID,
    };

    const result = await this.apiClient.sendRequest("getAllianceBattleStats", data);
    result.elapsedTime = Date.now() - startTime;
    return result;
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
  async search(name: string, exactResult: boolean = false) {
    const startTime = Date.now();
    const data = {
      name: name,
    };

    const result = await this.apiClient.sendRequest("searchAlliance", data);
    if (exactResult) {
      const exactMatch = (result.result).find(
        (x: AllianceSearch) => x.properties.name.toLowerCase() === name.toLowerCase()
      );
      if (exactMatch) {
        result.result = [exactMatch];
      } else {
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
  }

  /**
   * Retrieves the alliance ranking, paginated by the specified page and number of entries.
   * 
   * @param page - The page of the ranking to retrieve. Defaults to `0`.
   * @param numEntries - The number of entries to retrieve per page. Defaults to `10`.
   *                     Must be between `10` and `50`. If out of range, a warning is logged.
   * @returns A promise resolving to the alliance ranking, including elapsed time.
   */
  async getRanking(page: number = 0, numEntries: number = 10) {
    const startTime = Date.now();

    if (numEntries > 50) {
      console.warn("The maximum number of entries allowed is 50.");
    } else if (numEntries < 10) {
      console.warn("The minimum number of entries allowed is 10.");
    }

    const data = {
      page: page,
      numEntries: numEntries,
    };

    const result = await this.apiClient.sendRequest("getAllianceRanking", data);
    result.elapsedTime = Date.now() - startTime;
    return result;
  }

  /**
   * Retrieves a list of open alliances. The result typically includes 30 alliances
   * that are not full, but the response cannot be further filtered.
   * 
   * @returns A promise resolving to the list of open alliances, including elapsed time.
   */
  async getOpenAlliances() {
    const startTime = Date.now();
    const data = {};

    const result = await this.apiClient.sendRequest("getAlliances", data);
    result.elapsedTime = Date.now() - startTime;
    return result;
  }
}

/**
 * Type representing the structure of an alliance search result.
 */
type AllianceSearch = {
  "@c": string;
  properties: Record<any, any>;
  stats: Record<any, any>;
};
