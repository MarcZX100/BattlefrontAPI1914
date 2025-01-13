declare class UserApi {
    private apiClient;
    private defaultUserOptionsArray;
    private allUserOptionsArray;
    private rankingOptionsArray;
    /**
     * Creates an instance of the UserApi class.
     * @param {Record<string, any>} apiClient - The API client instance used to send requests.
     */
    constructor(apiClient: Record<string, any>);
    /**
     * Retrieves detailed information for a specific user by their user ID.
     * Allows for the selection of specific properties to retrieve.
     *
     * @param {number} userID - The unique identifier of the user.
     * @param {string[]} [options=this.defaultUserOptionsArray] - Optional list of user properties to include in the response.
     * @returns {Promise<any>} - A promise resolving to the user details, including the requested properties.
     */
    getDetails(userID: number, options?: string[]): Promise<any>;
    /**
     * Searches for a user by their username.
     * Optionally allows for an exact match search.
     *
     * @param {string} username - The username to search for.
     * @param {boolean} [exactResult=false] - Flag to indicate whether the search should return only an exact match.
     * @returns {Promise<any>} - A promise resolving to the search results.
     */
    search(username: string, exactResult?: boolean): Promise<any>;
    /**
     * Sends a private message (PM) to a user.
     *
     * @param {number} targetUserID - The user ID of the recipient.
     * @param {string} subject - The subject of the message.
     * @param {string} body - The body/content of the message.
     * @returns {Promise<any>} - A promise resolving to the result of the message sending request.
     */
    sendMail(targetUserID: number, subject: string, body: string): Promise<any>;
    /**
     * Retrieves a ranking list based on a specified ranking type.
     * Allows pagination and selection of the number of entries to return.
     *
     * @param {string} [type="globalRank"] - The type of ranking to fetch. Types allowed: "monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank".
     * @param {number} [page=0] - The page number for pagination.
     * @param {number} [numEntries=10] - The number of entries to retrieve per page.
     * @returns {Promise<any>} - A promise resolving to the ranking data for the selected type.
     */
    getRanking(type?: string, page?: number, numEntries?: number): Promise<any>;
}

export { UserApi };
