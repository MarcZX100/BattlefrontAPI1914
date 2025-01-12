import { RequestBuilder } from './requestBuilder';
import CustomErrors from './errors';

import { UtilApi } from './endpoints/Util';
import { UserApi } from './endpoints/Users';
import { GameApi } from './endpoints/Games';
import { AllianceApi } from './endpoints/Alliances';

/**
 * Represents the BytroFront client, providing access to various API endpoints
 * and utilities for interacting with the game server.
 */
export class BytroFront {
  private config: Record<string, any>;
  private errors: Record<string, any>;

  /** Provides access to utility-related API methods and tools. */
  public Util: UtilApi;
  /** Provides access to user-related API methods. */
  public Users: UserApi;
  /** Provides access to game-related API methods. */
  public Games: GameApi;
  /** Provides access to alliance-related API methods. */
  public Alliances: AllianceApi;

  /**
   * Initializes the API client with a configuration object and sets up endpoint access.
   * 
   * @param config - A configuration object containing settings required for API communication.
   */
  constructor(config: Record<string, any>) {
    this.config = config;
    this.errors = CustomErrors;

    this.Util = new UtilApi(this);
    this.Users = new UserApi(this);
    this.Games = new GameApi(this);
    this.Alliances = new AllianceApi(this);
  }

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
  async sendRequest<T>(action: string, data: Record<string, any>): Promise<T> {
    const { url, postData, type } = RequestBuilder.prepare(action, data, this.config);

    try {
      const response = await fetch(url, {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: type === 'POST' ? postData : undefined,
        method: type,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP request failed with status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

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
  async sendGameRequest<T>(gameID: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(`https://${data.gameServer}/`, {
        headers: {
          accept: "text/plain, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: JSON.stringify({
          requestID: 0,
          "@c": "ultshared.action.UltUpdateGameStateAction",
          actions: [
            {
              requestID: "actionReq-1",
              "@c": "ultshared.action.UltLoginAction",
              resolution: "1920x1080",
            },
          ],
          lastCallDuration: 0,
          client: "s1914-client-ultimate",
          siteUserID: 0,
          adminLevel: 0,
          gameID: gameID,
          playerID: 0,
          stateType: data.stateID,
          option: data.option,
          rights: data.rights,
          userAuth: data.userAuth,
          tstamp: data.tstamp,
        }),
        method: "POST",
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`HTTP request failed with status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error during call to server "${data.gameServer}":`, error);

      throw error;
    }
  }
}
