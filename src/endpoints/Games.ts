  
export class GameApi {
    private apiClient: Record<string, any>;


    constructor(apiClient: Record<string, any>) {
        this.apiClient = apiClient;
    }

    async getToken(gameID: number) {
        const startTime = Date.now();
    
        let data = {
            gameID: gameID
        };
    
        const result = await this.apiClient.sendRequest("getGameToken", data);
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async search(numEntries: number = 10, page: number = 0, lang: string = "en", filter: string = "") {
        const startTime = Date.now();

        let data = {
            numEntriesPerPage: numEntries,
            page: page,
            lang: lang,
            isFilterSearch: !!filter,
            search: !!filter ? filter : null,
            global: 1,
            password: 0,
            openSlots: 1,
            allianceGame: 0,
            loadUserLoginData: 1
        };

        if (numEntries > 50){
            console.warn("The maximum number of entries allowed is 50.");
        } else if (numEntries < 5) {
            console.warn("The minimum number of entries allowed is 5.");
        };
    
        const result = await this.apiClient.sendRequest("getGames", data);
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    // As the server has to fetch every player in the game, this takes excessively long
    async getOverview(gameID: number) {
        const startTime = Date.now();
    
        const data = {
            gameID: gameID,
        };
    
        const result = await this.apiClient.sendRequest("getGame", data);
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getDetails(gameID: number, stateID: number = 0, stateOption: number|null = null) {
        const startTime = Date.now();

        let tokenRaw = await this.getToken(gameID);
        let token = tokenRaw.result.token;

        let data = {
            gameServer: token.gs,
            stateID: stateID,
            option: stateOption,
            rights: token.rights,
            userAuth: token.authHash,
            tstamp: token.authTstamp
        };
        
        const result = await this.apiClient.sendGameRequest(gameID, data);
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }
}  