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
}

export { BytroFront };
