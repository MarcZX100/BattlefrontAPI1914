"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBuilder = void 0;
const js_sha1_1 = require("js-sha1");
/**
 * A utility class for constructing and preparing API requests.
 */
class RequestBuilder {
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
    static getParameterByName(name, url) {
        var _a;
        const regex = new RegExp(`[?&]${name.replace(/[[]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
        return results ? decodeURIComponent(((_a = results[2]) === null || _a === void 0 ? void 0 : _a.replace(/\+/g, ' ')) || '') : null;
    }
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
    static prepare(action, data, config) {
        const { key } = config.webapi;
        const { authTstamp, authHash } = config.uber;
        const { userId, trackingSource, websiteURL } = config;
        if (key !== 'open') {
            Object.assign(data, { authTstamp, authUserID: userId });
        }
        data.source = trackingSource;
        const asParam = Object.entries(data)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v !== null && v !== void 0 ? v : '')}`)
            .join('&');
        const encoded = btoa(asParam);
        const postData = `data=${encoded}`;
        const hashBase = key === 'open'
            ? `${key}${action}${encodeURIComponent(encoded)}`
            : `${key}${action}${asParam}${authHash}`;
        const hash = (0, js_sha1_1.sha1)(hashBase);
        const L = this.getParameterByName('L', websiteURL) || 0;
        const apiUrl = `${websiteURL}index.php?eID=api&key=${key}`;
        const url = `${apiUrl}&action=${action}&hash=${hash}&outputFormat=json&apiVersion=${config.webapi.version}&L=${L}&source=${trackingSource}`;
        return { url, postData, type: 'POST' };
    }
}
exports.RequestBuilder = RequestBuilder;
