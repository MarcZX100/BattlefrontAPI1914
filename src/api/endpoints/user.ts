export class UserApi {
  private apiClient: Record<string, any>;

  constructor(apiClient: Record<string, any>) {
    this.apiClient = apiClient;
  }

  async getUserDetails(userID: number, properties: string[] = []): Promise<any> {
    const data: Record<string, any> = { userID };

    if (Array.isArray(properties)) {
      properties.forEach((prop) => (data[prop] = 1));
    }

    return this.apiClient.sendRequest('getUserDetails', data);
  }
}
