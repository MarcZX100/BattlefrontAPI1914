import { RequestBuilder } from './requestBuilder';
import { UtilApi } from './endpoints/Util';
import { UserApi } from './endpoints/Users';
import { GameApi } from './endpoints/Games';
import { AllianceApi } from './endpoints/Alliances';

export class BattlefrontAPI {
  private config: Record<string, any>;

  public Util: UtilApi;
  public Users: UserApi;
  public Games: GameApi;
  public Alliances: AllianceApi;

  constructor(config: Record<string, any>) {
    this.config = config;

    this.Util = new UtilApi(this);
    this.Users = new UserApi(this);
    this.Games = new GameApi(this);
    this.Alliances = new AllianceApi(this);
  }

  async sendRequest<T>(action: string, data: Record<string, any>, retry = false): Promise<T> {
    const { url, postData, type } = RequestBuilder.prepare(action, data, this.config);

    try {
      const response = await fetch(url, {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="130", "Opera GX";v="115", "Not?A_Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: type === 'POST' ? postData : undefined,
        method: type,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error during API call to "${action}":`, error);

      if (retry) {
        console.log('Retrying...');
        return new Promise((resolve) =>
          setTimeout(() => resolve(this.sendRequest<T>(action, data, retry)), 5000)
        );
      }

      throw error;
    }
  }

  async sendGameRequest<T>(gameID: string, data: Record<string, any>): Promise<T> {

    try {
      const response = await fetch(`https://${data.gameServer}/`, {
        "headers": {
          "accept": "text/plain, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": "\"Chromium\";v=\"130\", \"Opera GX\";v=\"115\", \"Not?A_Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site"
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
        throw new Error(`HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error during call to server "${data.gameServer}":`, error);

      throw error;
    }
  }

}
