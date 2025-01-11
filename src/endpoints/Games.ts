  
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