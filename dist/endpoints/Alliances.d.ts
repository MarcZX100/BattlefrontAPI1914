/**
 * Represents the API client for managing and retrieving information about alliances.
 */
declare class AllianceApi {
    /**
     * The API client instance used to send requests.
     */
    private apiClient;
    /**
     * Constructs a new instance of the `AllianceApi` class.
     *
     * @param apiClient - The API client instance for sending requests.
     */
    constructor(apiClient: Record<string, any>);
    /**
     * Retrieves detailed information about a specific alliance.
     *
     * @param allianceID - The alliance's identifier.
     * @param members - Whether to include the list of alliance members in the response. Defaults to `true`.
     * @returns A promise resolving to the details of the specified alliance, including elapsed time.
     */
    getDetails(allianceID: number, members?: boolean): Promise<any>;
    /**
     * Retrieves battle statistics for a given alliance.
     *
     * @param allianceID - The alliance's identifier.
     * @returns A promise resolving to the battle statistics of the specified alliance, including elapsed time.
     */
    getBattles(allianceID: number): Promise<any>;
    /**
     * Searches for alliances by name.
     *
     * @param name - The name of the alliance to search for.
     * @param exactResult - Whether to return only exact matches for the alliance name. Defaults to `false`.
     * @returns A promise resolving to the search results, including elapsed time.
     * If `exactResult` is `true`, only exact matches are returned.
     * If no matches are found, the result code and message indicate "not found."
     */
    search(name: string, exactResult?: boolean): Promise<any>;
    /**
     * Retrieves the alliance ranking, paginated by the specified page and number of entries.
     *
     * @param page - The page of the ranking to retrieve. Defaults to `0`.
     * @param numEntries - The number of entries to retrieve per page. Defaults to `10`.
     *                     Must be between `10` and `50`. If out of range, a warning is logged.
     * @returns A promise resolving to the alliance ranking, including elapsed time.
     */
    getRanking(page?: number, numEntries?: number): Promise<any>;
    /**
     * Retrieves a list of open alliances. The result typically includes 30 alliances
     * that are not full, but the response cannot be further filtered.
     *
     * @returns A promise resolving to the list of open alliances, including elapsed time.
     */
    getOpenAlliances(): Promise<any>;
}

export { AllianceApi };
