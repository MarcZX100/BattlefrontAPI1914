/**
 * The GameApi class provides methods to interact with a game's server.
 * It supports operations like retrieving game tokens, searching for games, and fetching game details.
 */
declare class GameApi {
    /**
     * API client for sending requests to the server.
     */
    private apiClient;
    /**
     * Supported server languages for filtering games.
     */
    availableServerLanguages: string[];
    /**
     * Creates an instance of the GameApi class.
     *
     * @param apiClient - An object that handles sending requests to the backend API.
     */
    constructor(apiClient: Record<string, any>);
    /**
     * Retrieves the token for a specific game.
     *
     * @param gameID - The identifier of the game.
     * @returns A promise resolving to the game token or an error if the game is not found.
     */
    getToken(gameID: number): Promise<any>;
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
    search(numEntries?: number, page?: number, lang?: string, filter?: string, scenarioID?: number | null): Promise<any>;
    /**
     * Fetches original game overview. This call takes exceedingly longer, which is why {@link getOverview} was created.
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the game overview.
     */
    getOverviewOld(gameID: number): Promise<any>;
    /**
     * Fetches a detailed overview of a game, including properties and player details.
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the game overview or an error if the game is not found.
     */
    getOverview(gameID: number): Promise<any>;
    /**
     * Fetches advanced game details based on state and state-specific options.
     *
     * @param gameID - The unique identifier for the game.
     * @param stateID - The state ID to fetch. Defaults to 0 which equals all.
     * @param stateOption - Additional state option. Optional.
     * @returns A promise resolving to the game details or an error if the game is not found.
     */
    getAdvancedDetails(gameID: number, stateID?: number, stateOption?: number | null): Promise<any>;
    /**
     * Fetches game details with all states (stateID 0).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the game details or an error if the game is not found.
     */
    getDetails(gameID: number): Promise<any>;
    /**
     * Fetches players for a given game (stateID 1).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the game players or an error if the game is not found.
     */
    getPlayers(gameID: number): Promise<any>;
    /**
     * Fetches the newspaper for a specific day in the game (stateID 2).
     *
     * @param gameID - The unique identifier for the game.
     * @param day - The day to fetch the newspaper for.
     * @returns A promise resolving to the game newspaper or an error if the game is not found.
     */
    getNewspaper(gameID: number, day: number): Promise<any>;
    /**
     * Fetches all newspapers for a game (stateID 2).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to all the game newspapers or an error if the game is not found.
     */
    getAllNewspaper(gameID: number): Promise<{
        resultCode: number;
        resultMessage: string;
        result: any[];
        version: string;
        elapsedTime: number;
    }>;
    /**
     * Fetches provinces data for a given game (stateID 3).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the provinces data or an error if the game is not found.
     */
    getProvinces(gameID: number): Promise<any>;
    /**
     * Fetches a map with province statistics for a given game (stateID 4).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the map with province statistics or an error if the game is not found.
     */
    getMap(gameID: number): Promise<any>;
    /**
     * Fetches game-related statistics (stateID 5).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the game statistics or an error if the game is not found.
     */
    getStatistics(gameID: number): Promise<any>;
    /**
     * Fetches the scenario statistics for a game (stateID 6).
     *
     * @param gameID - The unique identifier for the game.
     * @returns A promise resolving to the scenario statistics or an error if the game is not found.
     */
    getScenarioStatistics(gameID: number): Promise<any>;
}

export { GameApi };
