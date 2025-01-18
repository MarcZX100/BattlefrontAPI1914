import { UtilApi } from './endpoints/Util.mjs';
import { UserApi } from './endpoints/Users.mjs';
import { GameApi } from './endpoints/Games.mjs';
import { AllianceApi } from './endpoints/Alliances.mjs';

/**
 * Represents the BytroFront client, providing access to various API endpoints
 * and utilities for interacting with the game server.
 */
declare class BytroFront {
    private config;
    private errors;
    /** Provides access to utility-related API methods and tools. */
    Util: UtilApi;
    /** Provides access to user-related API methods. */
    Users: UserApi;
    /** Provides access to game-related API methods. */
    Games: GameApi;
    /** Provides access to alliance-related API methods. */
    Alliances: AllianceApi;
    /**
     * Initializes the API client with a configuration object and sets up endpoint access.
     *
     * @param config - A configuration object containing settings required for API communication.
     */
    constructor(config: Record<string, any>);
    /**
     * Sends a generic request to the API server with the specified action and data payload.
     *
     * @template T - The expected return type of the response.
     * @param action - The action or endpoint to call on the API server.
     * @param data - The payload data to include in the request, provided as key-value pairs.
     * @returns A promise resolving to the response from the server.
     * @throws Will throw an error if the request fails or if the server returns a non-OK status.
     *
     * @example
     * ```typescript
     * const response = await api.sendRequest('getUserDetails', { userID: 48035824 });
     * console.log(response);
     * ```
     */
    sendRequest<T>(action: string, data: Record<string, any>): Promise<T>;
    /**
     * Sends a game-specific request to a specified game server.
     *
     * @template T - The expected return type of the response.
     * @param gameID - The unique identifier of the game.
     * @param data - The payload data to include in the request, including game-specific details.
     * @returns A promise resolving to the response from the game server, typed as `T`.
     * @throws Will throw an error if the request fails or if the server returns a non-OK status.
     *
     * @example
     * ```typescript
     * const response = await api.sendGameRequest<GameState>('9182721', {
     *   gameServer: 'xxxxxxxx.c.bytro.com',
     *   stateID: 2,
     *   option: 3,
     *   rights: 'chat',
     *   userAuth: 'hash',
     *   tstamp: '1982337111',
     * });
     * console.log(response);
     * ```
     */
    sendGameRequest<T>(gameID: string, data: Record<string, any>): Promise<T>;
    /**
   * Generates a configuration object by simulating a login process for the specified domain.
   *
   * This method uses Puppeteer to automate a browser session and interacts with the login
   * page of the given domain. After logging in, it retrieves an iframe source, navigates to it,
   * and extracts the configuration object from the page.
   *
   * @param username - The username to log in with.
   * @param password - The password to log in with.
   * @param domain - The domain to target for login and configuration retrieval. Defaults to "supremacy1914.com".
   *                 Examples:
   *                 - "supremacy1914.com" for Supremacy 1914 (default)
   *                 - "callofwar.com" for Call of War
   *                 - "ironorder1919.com" for Iron Order
   *                 - "supremacy1914.es" for the Spanish version of Supremacy 1914 (still allows data scrapping in other languages)
   * @returns A Promise resolving to the configuration object extracted from the domain.
   * @throws An error if the iframe source cannot be located or if the configuration retrieval fails.
   *
   * @example
   * ```typescript
   * const config = await generateConfig("exampleUser", "examplePass", "callofwar.com");
   * console.log(config);
   * ```
   */
    static generateConfig(username: string, password: string, domain?: string): Promise<any>;
}

export { BytroFront };
