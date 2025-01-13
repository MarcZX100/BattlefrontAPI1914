declare class UtilApi {
    private apiClient;
    private contentItems;
    /**
     * Creates an instance of the UtilApi class.
     * @param {Record<string, any>} apiClient - The API client instance used to send requests.
     */
    constructor(apiClient: Record<string, any>);
    /**
     * Retrieves content items for a specific language.
     * The content items include various game elements such as units, upgrades, ranks, awards, etc.
     *
     * @param {string} [lang="en"] - The language for which to retrieve the content items (default is English).
     * @returns {Promise<any>} - A promise resolving to the content items in the specified language.
     */
    getContentItems(lang?: string): Promise<any>;
    /**
     * Retrieves content items for a specific language.
     * This method fetches the content items by first searching for a game and then getting its associated items.
     * This way, items are more complete in regards of data and are also already properly organized.
     *
     * @param {string} [lang="en"] - The language for which to retrieve the complete content items (default is English).
     * @returns {Promise<any>} - A promise resolving to the complete content items associated with the game.
     */
    getCompleteContentItems(lang?: string): Promise<any>;
    /**
     * Loads the complete content items and stores them in the `contentItems` property.
     * This method calls `getCompleteContentItems` and updates the `contentItems` state.
     *
     * @param {string} [lang="en"] - The language for which to load the complete content items (default is English).
     * @returns {Promise<Record<string, any>>} - A promise resolving to the loaded content items.
     */
    loadContentItems(lang?: string): Promise<Record<string, any>>;
}

export { UtilApi };
