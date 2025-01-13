/**
 * A utility class for constructing and preparing API requests.
 */
declare class RequestBuilder {
    /**
     * Extracts the value of a specific query parameter from a given URL.
     *
     * @param name - The name of the parameter to retrieve.
     * @param url - The URL string to parse for the parameter.
     * @returns The value of the parameter if found, otherwise `null`.
     *
     * @example
     * ```typescript
     * const url = "https://www.supremacy1914.com/index.php?action=log&hash=yes&outputFormat=json&L=0";
     * const value = RequestBuilder.getParameterByName("outputFormat", url);
     * console.log(value); // Outputs: "0"
     * ```
     */
    static getParameterByName(name: string, url: string): string | null;
    /**
     * Prepares an API request by encoding data, generating hashes, and constructing the request URL and payload.
     *
     * @param action - The API action or endpoint being invoked.
     * @param data - The payload to be sent with the request as key-value pairs.
     * @param config - Configuration object containing keys, user information, and other API settings.
     *   - `config.webapi.key` - The API key.
     *   - `config.webapi.version` - The API version.
     *   - `config.uber.authTstamp` - The authentication timestamp.
     *   - `config.uber.authHash` - The authentication hash.
     *   - `config.userId` - The ID of the authenticated user.
     *   - `config.trackingSource` - The source of the tracking data.
     *   - `config.websiteURL` - The base URL for the API.
     *   - Amongst many others.
     *
     * @returns An object containing:
     *   - `url`: The constructed request URL.
     *   - `postData`: The encoded payload to send with the request.
     *   - `type`: The HTTP method to use (always "POST").
     *
     * @example
     * ```typescript
     * const action = "getUserDetails";
     * const data = { userID: 12345 };
     * const config = {
     *   webapi: { key: "apiKey", version: "1.0" },
     *   uber: { authTstamp: "1276123139", authHash: "secureHash" },
     *   userId: "user123",
     *   trackingSource: "web",
     *   websiteURL: "https://supremacy1914.com/",
     * };
     *
     * const requestDetails = RequestBuilder.prepare(action, data, config);
     * console.log(requestDetails);
     * // Outputs:
     * // {
     * //   url: "https://supremacy1914.com/index.php?eID=api&key=apiKey&action=getUserDetails&hash=...",
     * //   postData: "data=...",
     * //   type: "POST",
     * // }
     * ```
     */
    static prepare(action: string, data: Record<string, any>, config: Record<string, any>): {
        url: string;
        postData: string;
        type: string;
    };
}

export { RequestBuilder };
