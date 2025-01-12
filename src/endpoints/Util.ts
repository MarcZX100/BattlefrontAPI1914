export class UtilApi {
  private apiClient: Record<string, any>;
  private contentItems: Record<string, any>;

  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
    this.contentItems = {};
  }

  async getContentItems(lang: string = "en") {
    const startTime = Date.now();

    let data = {
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
    }

    const result = await this.apiClient.sendRequest("getContentItems", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }


  async getCompleteContentItems(lang: string = "en") {
    const startTime = Date.now();

    const gameList = await this.apiClient.Games.search(5, 0, lang, "", 8);
    let targetGameID = gameList.result.games[0].properties.gameID;

    const result = await this.apiClient.Games.getItems(targetGameID);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  async loadContentItems(lang: string = "en") {
    this.contentItems = await this.getCompleteContentItems(lang).then((result) => { return result.result });
    return this.contentItems;
  }

}
