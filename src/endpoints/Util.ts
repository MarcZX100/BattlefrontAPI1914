export class UtilApi {
  private apiClient: Record<string, any>;
  private contentItems: Record<string, any>;

  /**
   * Creates an instance of the UtilApi class.
   * @param {Record<string, any>} apiClient - The API client instance used to send requests.
   */
  constructor(apiClient: Record<string, any>) {
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
  async getContentItems(lang: string = "en") {
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

    const result = await this.apiClient.sendRequest("getContentItems", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  /**
   * Retrieves content items for a specific language.
   * This method fetches the content items by first searching for a game and then getting its associated items.
   * This way, items are more complete in regards of data and are also already properly organized.
   * 
   * @param {string} [lang="en"] - The language for which to retrieve the complete content items (default is English).
   * @returns {Promise<any>} - A promise resolving to the complete content items associated with the game.
   */
  async getCompleteContentItems(lang: string = "en") {
    const startTime = Date.now();

    // Fetch the list of games in the specified language
    const gameList = await this.apiClient.Games.search(5, 0, lang, "", 8);
    const targetGameID = gameList.result.games[0].properties.gameID;

    // Get the items for the specific game
    const result = await this.apiClient.Games.getItems(targetGameID);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  /**
   * Loads the complete content items and stores them in the `contentItems` property.
   * This method calls `getCompleteContentItems` and updates the `contentItems` state.
   * 
   * @param {string} [lang="en"] - The language for which to load the complete content items (default is English).
   * @returns {Promise<Record<string, any>>} - A promise resolving to the loaded content items.
   */
  async loadContentItems(lang: string = "en") {
    this.contentItems = await this.getCompleteContentItems(lang).then((result) => { return result.result; });
    return this.contentItems;
  }
}
