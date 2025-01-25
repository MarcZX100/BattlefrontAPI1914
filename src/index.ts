import { RequestBuilder } from './requestBuilder';
import CustomErrors from './errors';
import puppeteer from 'puppeteer';
import { JSDOM } from "jsdom";

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
   * If the config was generated with the generateConfig method, the class's config will update automatically every 6 days
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

    if (this.config.customPackageDetails && this.config.customPackageDetails.autoGenerate) {
      setInterval(async () => {
        this.config = await BytroFront.generateConfig(this.config.customPackageDetails.username, this.config.customPackageDetails.password, this.config.customPackageDetails.domain);
      }, 6 * 24 * 60 * 60 * 1000); // 6 days in milliseconds
    }
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
 * @param autoGenerate - Whether to auto generate login every 6 days when being handled by BytroFront instance.
 * @returns A Promise resolving to the configuration object extracted from the domain.
 * @throws An error if the iframe source cannot be located or if the configuration retrieval fails.
 *
 * @example
 * ```typescript
 * const config = await generateConfig("exampleUser", "examplePass", "callofwar.com");
 * console.log(config);
 * ```
 */
  static async generateConfig(
    username: string,
    password: string,
    domain: string = "supremacy1914.com",
    autoGenerate: boolean = true
  ): Promise<any> {
    let browser: any;
    let page: any;
    let newPage: any;
  
    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }
  
      const enlace = `https://www.${domain}/index.php?id=188`;
  
      browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
        headless: true 
      });
  
      page = await browser.newPage();
      await page.goto(enlace);
  
      // Handle login button clicks with visibility and timing checks
      try {
        await page.waitForSelector(".login_text", { visible: true, timeout: 5000 });
        await page.click(".login_text"); // Supremacy1914 and Iron Order
      } catch (e) {
        console.warn("Fallback to #sg_login_text");
        await page.waitForSelector("#sg_login_text", { visible: true, timeout: 5000 });
        await page.click("#sg_login_text"); // Call of War
      }
  
      // Input credentials
      await page.waitForSelector("#loginbox_login_input", { visible: true });
      await page.type("#loginbox_login_input", username);
      await page.type("#loginbox_password_input", password);
  
      // Click login button
      await page.waitForSelector("#func_loginbutton", { visible: true });
      await page.click("#func_loginbutton");
  
      // Wait for iframe response
      const iframeSrc: any = await Promise.race([
        new Promise<string>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Iframe response timed out")), 10000);
          page.on("response", async (response: any) => {
            if (response.url().endsWith("/game.php?bust=1")) {
              clearTimeout(timeout);
              const responseBody = await response.text();
              const dom = new JSDOM(responseBody);
              const iframe = dom.window.document.querySelector("#ifm") as HTMLIFrameElement | null;
              resolve(iframe ? iframe.src : "");
            }
          });
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Iframe response timed out")), 10000)),
      ]);
  
      if (!iframeSrc) {
        throw new Error("Iframe source not found");
      }
  
      // Close the login page
      page.removeAllListeners('response');
      await page.close();
  
      // Open iframe in a new page
      newPage = await browser.newPage();
      await newPage.goto(iframeSrc);
  
      // Extract configuration
      const config: any = await newPage.evaluate(() => {
        const hupConfig = (window as any).hup?.config ?? null;
        if (hupConfig) {
          return hupConfig;
        }
        throw new Error("Config not found");
      });
  
      config.customPackageDetails = { username, password, domain, autoGenerate };
      return config;
    } catch (error) {
      console.error("Error in generateConfig:", error);
      throw error;
    } finally {
      if (newPage && !newPage.isClosed()) {
        newPage.removeAllListeners('response');
        await newPage.close();
      }
      if (page && !page.isClosed()) {
        page.removeAllListeners('response');
        await page.close();
      }
      if (browser) await browser.close();
    }
  }
  
  
  

}
