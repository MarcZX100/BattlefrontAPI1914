type UserSearch = {
  userID: string;
  username: string;
  avatar: string;
  disable: string;
  deleted: string;
};

export class UserApi {
  private apiClient: Record<string, any>;
  private defaultUserOptionsArray: Array<string>;
  private allUserOptionsArray: Array<string>;
  private rankingOptionsArray: Array<string>;

  /**
   * Creates an instance of the UserApi class.
   * @param {Record<string, any>} apiClient - The API client instance used to send requests.
   */
  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
    this.defaultUserOptionsArray = ["username", "avatarURL", "regTstamp", "alliance", "rankProgress", "gameStats"];
    this.allUserOptionsArray = ["acl", "alliance", "allianceInvites", "allianceMemberShip", "askForEmail", "askForPassword", "avatarURL", "country", "deletionStatus", "email", "emailChangeRequest", "inventory", "isPaying", "battlePassProgress", "lastOfferPurchaseTimeSeconds", "links", "minModVersion", "notifications", "pushNotificationPreferences", "rank", "rankProgress", "referrer", "regTstamp", "shopPlatform", "showSocialMediaButtons", "isAllowedToShowStoreLinks", "sources", "subscriptions", "unreadMessages", "useFastPaypalCheckout", "username", "useShop2017", "canAdjustEmail", "shouldDisableInGameUserRegistration", "canUseInventorySystem", "publisherID", "qualityMatchAdsSupport", "useFirefly", "mayUseGgsShopWithoutPaymentMethods","stats","scenarioStats","awardProgress", "gameStats"];
    this.rankingOptionsArray = ["monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank"];
  }

  /**
   * Retrieves detailed information for a specific user by their user ID.
   * Allows for the selection of specific properties to retrieve.
   * 
   * @param {number} userID - The unique identifier of the user.
   * @param {string[]} [options=this.defaultUserOptionsArray] - Optional list of user properties to include in the response.
   * @returns {Promise<any>} - A promise resolving to the user details, including the requested properties.
   */
  async getDetails(userID: number, options: string[] = this.defaultUserOptionsArray): Promise<any> {
    const startTime = Date.now();

    const data: Record<string, any> = { userID };

    if (Array.isArray(options)) {
      options.forEach((option) => {
        if ((this.allUserOptionsArray).includes(option)) {
          data[option] = 1;
        } else {
          console.warn(`The "${option}" option does not exist.`);
        }
      });
    }

    const result = await this.apiClient.sendRequest("getUserDetails", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  /**
   * Searches for a user by their username.
   * Optionally allows for an exact match search.
   * 
   * @param {string} username - The username to search for.
   * @param {boolean} [exactResult=false] - Flag to indicate whether the search should return only an exact match.
   * @returns {Promise<any>} - A promise resolving to the search results.
   */
  async search(username: string, exactResult: boolean = false) {
    const startTime = Date.now();

    const data = {
      username: username
    };

    const result = await this.apiClient.sendRequest("searchUser", data);
    if (exactResult) {
      if ((result.result).find((x: UserSearch) => (x.username).toLowerCase() == username.toLowerCase())) {
        result.result = [(result.result).find((x: UserSearch) => (x.username).toLowerCase() == username.toLowerCase())];
      } else {
        result.resultCode = -1;
        result.resultMessage = "not found";
      }
    }
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  /**
   * Sends a private message (PM) to a user.
   * 
   * @param {number} targetUserID - The user ID of the recipient.
   * @param {string} subject - The subject of the message.
   * @param {string} body - The body/content of the message.
   * @returns {Promise<any>} - A promise resolving to the result of the message sending request.
   */
  async sendMail(targetUserID: number, subject: string, body: string) {
    const startTime = Date.now();

    const data = {
      receiverID: targetUserID,
      subject: subject,
      body: body,
      mode: "pm"
    };

    const result = await this.apiClient.sendRequest("sendMessage", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }

  /**
   * Retrieves a ranking list based on a specified ranking type.
   * Allows pagination and selection of the number of entries to return.
   * 
   * @param {string} [type="globalRank"] - The type of ranking to fetch. Types allowed: "monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank".
   * @param {number} [page=0] - The page number for pagination.
   * @param {number} [numEntries=10] - The number of entries to retrieve per page.
   * @returns {Promise<any>} - A promise resolving to the ranking data for the selected type.
   */
  async getRanking(type: string = "globalRank", page: number = 0, numEntries: number = 10) {
    const startTime = Date.now();

    if (numEntries > 50){
      console.warn("The maximum number of entries allowed is 50.");
    } else if (numEntries < 5) {
      console.warn("The minimum number of entries allowed is 5.");
    }

    const data = {
      type: type,
      page: page,
      numEntries: numEntries
    };

    if (!(this.rankingOptionsArray).includes(type)) {
      return {
        resultCode: -1,
        resultMessage: "incorrect option",
        result: `The ${type} type does not exist.`,
        elapsedTime: (Date.now() - startTime),
        receivedData: data
      };
    }

    const result = await this.apiClient.sendRequest("getRankingFirefly", data);
    result.elapsedTime = (Date.now() - startTime);
    return result;
  }
}
