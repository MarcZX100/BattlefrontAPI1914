var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/endpoints/Games.ts
var GameApi = class {
  /**
   * Creates an instance of the GameApi class.
   *
   * @param apiClient - An object that handles sending requests to the backend API.
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.availableServerLanguages = [
      "cs",
      "de",
      "el",
      "en",
      "es",
      "fr",
      "id",
      "it",
      "ja",
      "nl",
      "pl",
      "pt",
      "ru",
      "tr"
    ];
  }
  /**
   * Retrieves the token for a specific game.
   *
   * @param gameID - The identifier of the game.
   * @returns A promise resolving to the game token or an error if the game is not found.
   */
  getToken(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = { gameID };
      let result = yield this.apiClient.sendRequest("getGameToken", data);
      if (result.resultCode !== 0) {
        result = this.apiClient.errors.getError("game not found");
      }
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Searches for games based on various filters.
   *
   * @param numEntries - Number of entries to fetch (min 5, max 50). Defaults to 10.
   * @param page - The page number to fetch. Defaults to 0.
   * @param lang - Language filter. Defaults to "en".
   * @param filter - Search string for filtering. Optional.
   * @param scenarioID - Scenario ID for filtering. Optional.
   * @returns A promise resolving to the search results.
   */
  search(numEntries = 10, page = 0, lang = "en", filter = "", scenarioID = null) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      if (!this.availableServerLanguages.includes(lang)) {
        console.warn(`Language ${lang} does not exist.`);
        lang = "en";
      }
      if (numEntries > 50) {
        console.warn("The maximum number of entries allowed is 50.");
      } else if (numEntries < 5) {
        console.warn("The minimum number of entries allowed is 5.");
      }
      const data = {
        numEntriesPerPage: numEntries,
        page,
        lang,
        isFilterSearch: !!filter,
        search: filter || null,
        global: 1,
        loadUserLoginData: 1,
        scenarioID
      };
      const result = yield this.apiClient.sendRequest("getGames", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches original game overview. This call takes exceedingly longer, which is why {@link getOverview} was created.
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game overview.
   */
  getOverviewOld(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const data = { gameID };
      const result = yield this.apiClient.sendRequest("getGame", data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches a detailed overview of a game, including properties and player details.
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game overview or an error if the game is not found.
   */
  getOverview(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const properties = yield this.apiClient.sendRequest("getGames", { gameID }).then((result2) => {
        var _a;
        return (_a = result2.result[0]) == null ? void 0 : _a.properties;
      });
      const players = yield this.getAdvancedDetails(gameID, 1);
      if (!properties || typeof players.result !== "object") {
        return this.apiClient.errors.getError("game not found");
      }
      const realPlayers = Object.values(players.result.players).filter((x) => x.siteUserID > 1);
      const finalDictionary = realPlayers.reduce((dict, x) => {
        dict[x.siteUserID] = {
          siteUserID: x.siteUserID,
          playerID: x.playerID,
          login: x.userName,
          nation: x.nationName,
          teamID: x.teamID
        };
        return dict;
      }, {});
      const userDetails = yield Promise.all(
        Object.keys(finalDictionary).map(
          (siteUserID) => this.apiClient.Users.getDetails(siteUserID)
        )
      );
      userDetails.forEach((user) => {
        const userId = user.result.id;
        if (finalDictionary[userId]) {
          finalDictionary[userId].profile = user.result;
        }
      });
      const result = {
        resultCode: 0,
        resultMessage: "ok",
        result: {
          logins: Object.values(finalDictionary),
          properties
        },
        version: "4831_live",
        elapsedTime: Date.now() - startTime
      };
      return result;
    });
  }
  /**
   * Fetches an overview of a game, only including properties.
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game overview or an error if the game is not found.
   */
  getOverviewProperties(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const properties = yield this.apiClient.sendRequest("getGames", { gameID }).then((result2) => {
        var _a;
        return (_a = result2.result[0]) == null ? void 0 : _a.properties;
      });
      if (!properties) {
        return this.apiClient.errors.getError("game not found");
      }
      const result = {
        resultCode: 0,
        resultMessage: "ok",
        result: properties,
        version: "4831_live",
        elapsedTime: Date.now() - startTime
      };
      return result;
    });
  }
  /**
   * Fetches advanced game details based on state and state-specific options.
   *
   * @param gameID - The unique identifier for the game.
   * @param stateID - The state ID to fetch. Defaults to 0 which equals all.
   * @param stateOption - Additional state option. Optional.
   * @returns A promise resolving to the game details or an error if the game is not found.
   */
  getAdvancedDetails(gameID, stateID = 0, stateOption = null) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const tokenRaw = yield this.getToken(gameID);
      if (tokenRaw.resultCode !== 0) {
        return this.apiClient.errors.getError("game not found");
      }
      const token = tokenRaw.result.token;
      const data = {
        gameServer: token.gs,
        stateID,
        option: stateOption,
        rights: token.rights,
        userAuth: token.authHash,
        tstamp: token.authTstamp
      };
      const result = yield this.apiClient.sendGameRequest(gameID, data);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches game details with all states (stateID 0).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game details or an error if the game is not found.
   */
  getDetails(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 0);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches players for a given game (stateID 1).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game players or an error if the game is not found.
   */
  getPlayers(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 1);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches the newspaper for a specific day in the game (stateID 2).
   *
   * @param gameID - The unique identifier for the game.
   * @param day - The day to fetch the newspaper for.
   * @returns A promise resolving to the game newspaper or an error if the game is not found.
   */
  getNewspaper(gameID, day) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 2, day);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches all newspapers for a game (stateID 2).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to all the game newspapers or an error if the game is not found.
   */
  getAllNewspaper(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const resultLastDay = yield this.getAdvancedDetails(gameID, 2);
      const lastDay = resultLastDay.result.day;
      const allNewspaper = yield Promise.all(
        Array.from({ length: lastDay + 1 }, (_, i) => i).map(
          (day) => this.getNewspaper(gameID, day).then((x) => {
            return x.result;
          })
        )
      );
      const result = {
        resultCode: 0,
        resultMessage: "ok",
        result: allNewspaper,
        version: "4831_live",
        elapsedTime: Date.now() - startTime
      };
      return result;
    });
  }
  /**
   * Fetches provinces data for a given game (stateID 3).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the provinces data or an error if the game is not found.
   */
  getProvinces(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 3);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches a map with province statistics for a given game (stateID 3).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the map with province statistics or an error if the game is not found.
   */
  getMap(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 3);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches the scenario statistics for a game (stateID 12).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the scenario statistics or an error if the game is not found.
   */
  getScenarioStatistics(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 12);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
  /**
   * Fetches game-related statistics (stateID 30).
   *
   * @param gameID - The unique identifier for the game.
   * @returns A promise resolving to the game statistics or an error if the game is not found.
   */
  getStatistics(gameID) {
    return __async(this, null, function* () {
      const startTime = Date.now();
      const result = yield this.getAdvancedDetails(gameID, 30);
      result.elapsedTime = Date.now() - startTime;
      return result;
    });
  }
};
export {
  GameApi
};
//# sourceMappingURL=Games.mjs.map