type AllianceSearch = {
  "@c": string;
  properties: Record<any, any>;
  stats: Record<any, any>;
};

export class AllianceApi {
  private apiClient: Record<string, any>;

  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
  }

  async getDetails(allianceID: number, members: boolean = true) {
    const startTime = Date.now();
    let data = {
      allianceID: allianceID,
      members: (members ? 1 : 0),
      invites: 0
    }

    const result = await this.apiClient.sendRequest("getAlliance", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  async getBattles(allianceID: number) {
    const startTime = Date.now();
    let data = {
      allianceID: allianceID
    }

    const result = await this.apiClient.sendRequest("getAllianceBattleStats", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }


  async search(name: string, exactResult: boolean = false) {
    const startTime = Date.now();

    const data = {
      name: name
    };

    const result = await this.apiClient.sendRequest("searchAlliance", data);
    if (exactResult) {
      if ((result.result).find((x: AllianceSearch) => (x.properties.name).toLowerCase() == name.toLowerCase())) {
        result.result = [(result.result).find((x: AllianceSearch) => (x.properties.name).toLowerCase() == name.toLowerCase())];
      } else {
        result.resultCode = -1;
        result.resultMessage = "not found";
      }
    }
    if ((result.result).length == 0) {
        result.resultCode = -1;
        result.resultMessage = "not found";
    }
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }


  async getRanking(page: number = 0, numEntries: number = 10) {
    const startTime = Date.now();

    let data = {
      page: page,
      numEntries: numEntries
    };

    if (numEntries > 50){
      console.warn("The maximum number of entries allowed is 50.");
    } else if (numEntries < 10) {
      console.warn("The minimum number of entries allowed is 10.");
    };

    const result = await this.apiClient.sendRequest("getAllianceRanking", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  // Returns random 30 open alliances, apparently all not full. Can't find any way to make it be more specific
  async getOpenAlliances() {
    const startTime = Date.now();

    let data = {};

    const result = await this.apiClient.sendRequest("getAlliances", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

}
