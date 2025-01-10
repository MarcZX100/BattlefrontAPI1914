export class UserApi {
  private apiClient: Record<string, any>;
  private defaultOptionsArray: Array<string>;
  private allOptionsArray: Array<string>;

  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
    this.defaultOptionsArray = ["username", "avatarURL", "regTstamp", "alliance", "rankProgress", "gameStats"]
    this.allOptionsArray = ['acl', 'alliance', 'allianceInvites', 'allianceMemberShip', 'askForEmail', 'askForPassword', 'avatarURL', 'country', 'deletionStatus', 'email', 'emailChangeRequest', 'inventory', 'isPaying', 'battlePassProgress', 'lastOfferPurchaseTimeSeconds', 'links', 'minModVersion', 'notifications', 'pushNotificationPreferences', 'rank', 'rankProgress', 'referrer', 'regTstamp', 'shopPlatform', 'showSocialMediaButtons', 'isAllowedToShowStoreLinks', 'sources', 'subscriptions', 'unreadMessages', 'useFastPaypalCheckout', 'username', 'useShop2017', 'canAdjustEmail', 'shouldDisableInGameUserRegistration', 'canUseInventorySystem', 'publisherID', 'qualityMatchAdsSupport', 'useFirefly', 'mayUseGgsShopWithoutPaymentMethods','stats','scenarioStats','awardProgress', "gameStats"]
  }

  /**
   * Retrieves a user by their identificator. Can request a specific set of data based on properties given 
   * @param {Number} userID ID of the user (integer)
   * @param {Array} [options] Options in regards of the data required
   * @returns User
   */
  async getDetails(userID: number, options: string[] = this.defaultOptionsArray): Promise<any> {
    let startTime = Date.now();

    const data: Record<string, any> = { userID };

    if (Array.isArray(options)) {
      options.forEach((option) => {
        if ((this.allOptionsArray).includes(option)) {
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

  async search(username: string) {
    let startTime = Date.now();

    let data = {
      username: username
    }

    let result = await this.apiClient.sendRequest('searchUser', data);
    result.elapsedTime = (Date.now() - startTime)
    return result;
  }

  async sendMail() {

  }

  async getRanking() {

  }
}
