
export class GameApi {
    private apiClient: Record<string, any>;
    public availableServerLanguages: Record<string, any>;

    constructor(apiClient: Record<string, any>) {
        this.apiClient = apiClient;
        this.availableServerLanguages = ['cs', 'de', 'el', 'en', 'es', 'fr', 'id', 'it', 'ja', 'nl', 'pl', 'pt', 'ru', 'tr'];
    }

    async getToken(gameID: number) {
        const startTime = Date.now();
    
        let data = {
            gameID: gameID
        };
    
        let result = await this.apiClient.sendRequest("getGameToken", data);
        if (result.resultCode !== 0) {
            result = this.apiClient.errors.getError("game not found")
        }
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async search(numEntries: number = 10, page: number = 0, lang: string = "en", filter: string = "", scenarioID: number|null = null) {
        const startTime = Date.now();

        if (!(this.availableServerLanguages).includes(lang)) {
            console.warn(`Language ${lang} does not exist.`);
            lang = "en";
        };
        if (numEntries > 50){
            console.warn("The maximum number of entries allowed is 50.");
        } else if (numEntries < 5) {
            console.warn("The minimum number of entries allowed is 5.");
        };

        let data = {
            numEntriesPerPage: numEntries,
            page: page,
            lang: lang,
            isFilterSearch: !!filter,
            search: !!filter ? filter : null,
            global: 1,
            loadUserLoginData: 1,
            scenarioID: scenarioID
        };
    
        const result = await this.apiClient.sendRequest("getGames", data);
        
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    // As the server has to fetch every player in the game, this takes excessively long
    async getOverviewOld(gameID: number) {
        const startTime = Date.now();
    
        const data = {
            gameID: gameID,
        };
    
        const result = await this.apiClient.sendRequest("getGame", data);
        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getOverview(gameID: number) {
        const startTime = Date.now();
        
        let properties = await this.apiClient.sendRequest("getGames", {gameID: gameID}).then((result: any)=>{
            return result.result[0]?.properties
        });
        let players = await this.getAdvancedDetails(gameID, 1);
        
        if (properties == undefined || (typeof players.result) != "object") {
            return this.apiClient.errors.getError("game not found")
        }

        const realPlayers = Object.values(players.result.players).filter((x: any) => x.siteUserID > 1);
        
        const finalDictionary: any = realPlayers.reduce((dict: any, x: any) => {
            dict[x.siteUserID] = {
            siteUserID: x.siteUserID,
            playerID: x.playerID,
            login: x.userName,
            nation: x.nationName,
            teamID: x.teamID
            };
            return dict;
        }, {});
        
        const userDetails = await Promise.all(
            Object.keys(finalDictionary).map(siteUserID => this.apiClient.Users.getDetails(siteUserID))
        );
        
        userDetails.forEach(user => {
            const userId = user.result.id;
            if (finalDictionary[userId]) {
                finalDictionary[userId].profile = user.result;
            }
        });
        
        let result = {
            resultCode: 0,
            resultMessage: "ok",
            result: {
                logins: Object.values(finalDictionary),
                properties: properties
            },
            version: "4831_live",
            elapsedTime: (Date.now() - startTime)
        }
    
        return result;
    }

    async getAdvancedDetails(gameID: number, stateID: number = 0, stateOption: number|null = null) {
        const startTime = Date.now();

        let tokenRaw = await this.getToken(gameID);
        if (tokenRaw.resultCode !== 0) {
            return this.apiClient.errors.getError("game not found")
        }

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

    async getDetails(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 0);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getPlayers(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 1);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getNewspaper(gameID: number, day: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 2, day);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getAllNewspaper(gameID: number) {
        const startTime = Date.now();

        const resultLastDay = await this.getAdvancedDetails(gameID, 2);
        let lastDay = resultLastDay.result.day;

        const allNewspaper = await Promise.all(
            (Array.from({ length: lastDay + 1 }, (_, i) => i)).map(day => this.getNewspaper(gameID, day).then((x) => { return x.result }))
        );

        let result = {
            resultCode: 0,
            resultMessage: "ok",
            result: allNewspaper,
            version: "4831_live",
            elapsedTime: (Date.now() - startTime)
        }

        return result;
    }

    async getProvinces(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 3);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getMarket(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 4);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getRelations(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 5);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getItems(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 11);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getConfig(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 12);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

    async getStatistics(gameID: number) {
        const startTime = Date.now();

        const result = await this.getAdvancedDetails(gameID, 30);

        result.elapsedTime = (Date.now() - startTime);
        return result;
    }

}  