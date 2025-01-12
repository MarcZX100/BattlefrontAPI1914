import { RequestBuilder } from './requestBuilder';
import CustomErrors from './errors';

import { UtilApi } from './endpoints/Util';
import { UserApi } from './endpoints/Users';
import { GameApi } from './endpoints/Games';
import { AllianceApi } from './endpoints/Alliances';

export class BattlefrontAPI {
  private config: Record<string, any>;
  private errors: Record<string, any>;

  public Util: UtilApi;
  public Users: UserApi;
  public Games: GameApi;
  public Alliances: AllianceApi;

  constructor(config: Record<string, any>) {
    this.config = config;
    this.errors = CustomErrors;

    this.Util = new UtilApi(this);
    this.Users = new UserApi(this);
    this.Games = new GameApi(this);
    this.Alliances = new AllianceApi(this);
  }


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

  async sendGameRequest<T>(gameID: string, data: Record<string, any>): Promise<T> {

    try {
      const response = await fetch(`https://${data.gameServer}/`, {
        "headers": {
          "accept": "text/plain, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        "body": JSON.stringify({
              "requestID": 0,
              "@c": "ultshared.action.UltUpdateGameStateAction",
              "actions": [{
                  "requestID": "actionReq-1",
                  "@c": "ultshared.action.UltLoginAction",
                  "resolution": "1920x1080"
              }],
              "lastCallDuration": 0,
              "client": "s1914-client-ultimate",
              "siteUserID": 0,
              "adminLevel": 0,
              "gameID": gameID,
              "playerID": 0,
              "stateType": data.stateID,
              "option": data.option,
              "rights": data.rights,
              "userAuth": data.userAuth,
              "tstamp": data.tstamp
          }),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
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
