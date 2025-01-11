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

  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
    this.defaultUserOptionsArray = ["username", "avatarURL", "regTstamp", "alliance", "rankProgress", "gameStats"]
    this.allUserOptionsArray = ['acl', 'alliance', 'allianceInvites', 'allianceMemberShip', 'askForEmail', 'askForPassword', 'avatarURL', 'country', 'deletionStatus', 'email', 'emailChangeRequest', 'inventory', 'isPaying', 'battlePassProgress', 'lastOfferPurchaseTimeSeconds', 'links', 'minModVersion', 'notifications', 'pushNotificationPreferences', 'rank', 'rankProgress', 'referrer', 'regTstamp', 'shopPlatform', 'showSocialMediaButtons', 'isAllowedToShowStoreLinks', 'sources', 'subscriptions', 'unreadMessages', 'useFastPaypalCheckout', 'username', 'useShop2017', 'canAdjustEmail', 'shouldDisableInGameUserRegistration', 'canUseInventorySystem', 'publisherID', 'qualityMatchAdsSupport', 'useFirefly', 'mayUseGgsShopWithoutPaymentMethods','stats','scenarioStats','awardProgress', "gameStats"]
    this.rankingOptionsArray = ["monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank"];
  }

  /**
   * Retrieves a user by their identificator. Can request a specific set of data based on properties given 
   * @param {Number} userID ID of the user (integer)
   * @param {Array} [options] Options in regards of the data required
   * @returns User
   */
  async getDetails(userID: number, options: string[] = this.defaultUserOptionsArray): Promise<any> {
    let startTime = Date.now();

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

    let result = await this.apiClient.sendRequest('getUserDetails', data);
    result.elapsedTime = (Date.now() - startTime)
    return result;
  }

  async search(username: string, exactResult: boolean = false) {
    let startTime = Date.now();

    let data = {
      username: username
    };

    let result = await this.apiClient.sendRequest('searchUser', data);
    if (exactResult) {
      if ((result.result).find((x: UserSearch) => (x.username).toLowerCase() == username.toLowerCase())) {
        result.result = [(result.result).find((x: UserSearch) => (x.username).toLowerCase() == username.toLowerCase())]
      } else {
        result.resultCode = -1
        result.resultMessage = "not found"
      }
    }
    result.elapsedTime = (Date.now() - startTime)
    return result;
  }

  async sendMail(targetUserID: number, subject: string, body: string) {
    let startTime = Date.now();
    
    let data = {
      receiverID: targetUserID,
      subject: subject,
      body: body,
      mode: "pm"
    }

    let result = await this.apiClient.sendRequest('sendMessage', data);
    result.elapsedTime = (Date.now() - startTime)
    return result;
  }

  async getRanking(type: string = "globalRank", page: number = 0, numEntries: number = 10) {
    let startTime = Date.now();

    let data = {
      type: type, // ["monthRank", "weekRank", "globalRank", "highestMonthRank", "highestWeekRank", "lastMonthRank", "lastWeekRank"]
      page: page,
      numEntries: numEntries
    };

    if (numEntries > 50){
      console.warn("The maximum number of entries allowed is 50.")
    } else if (numEntries < 5) {
      console.warn("The minimum number of entries allowed is 5.")
    };

    if (!(this.rankingOptionsArray).includes(type)) {
      return {
        resultCode: -1,
        resultMessage: "incorrect option",
        result: `The ${type} type does not exist.`,
        elapsedTime: (Date.now() - startTime),
        receivedData: data
      }
    };

    let result = await this.apiClient.sendRequest('getRankingFirefly', data);
    result.elapsedTime = (Date.now() - startTime)
    return result;
  }
}
