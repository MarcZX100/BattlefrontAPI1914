import config from './config';
import { RequestBuilder } from './requestBuilder';
import { UserApi } from './endpoints/Users';

export class BattlefrontAPI {
  private config: Record<string, any>;

  public Users: UserApi;

  constructor() {
    this.config = config;

    this.Users = new UserApi(this);
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
}

// export const client = new BattlefrontAPI(config);
