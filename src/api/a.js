const axios = require("axios");
const config = require("./config.js");
const messageResolver = require("./messageResolver");
const js_sha1 = require("js-sha1");

    
function isNullOrEmpty(obj) {
    if (!obj) {
      return true;
    }
  
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  
    return true;
}

function getParameterByName(name, url = config.websiteURL) {
  const escapedName = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${escapedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  return results ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null;
}




function prepareApiRequest2(action, data, successCallback, processOnlyLatestResult, processIncrementalResults, retry) {
    var _getParameterByName;

    if (!this.available) {
      if (successCallback) {
        successCallback({
          resultCode: 0,
          result: '',
          resultMessage: '',
          receivedData: {}
        });
      }

      return null;
    }
    /**
     * Debugging web callbacks means the data will be transmitted as GET parameters (allows copying the URL from
     * debuggers != firebug.
     * It will also print the complete API URL to the console for easier reference.
     *
     * @type {boolean}
     */


    const {
      debug
    } = config.webapi; // set this to true to be able to open the complete request in a new tab.

    let e; // this used to be done only for uber before the s1914 client also switched to this API auth mechanism
    // this user authentication parameters (session token based approach)

    if (config.webapi.key !== 'open') {
      data.authTstamp = config.uber.authTstamp;
      data.authUserID = config.userId;
    }

    data.source = config.trackingSource; // encode the data properly to transmit it without encoding problems:

    let asParam = '';
    const paramParts = []; // build URL query string (userID=123&myVar=1)
    // this used to be done with jQuery's $.param(data), but that one did not handle Functions correctly

    if (!isNullOrEmpty(data)) {
      for (e in data) {
        if (data.hasOwnProperty(e)) {
          let str = `${encodeURIComponent(e)}=`;

          if (data[e] !== undefined) {
            // otherwise this will resolve to the string "undefined" in the hash base, which is not correct
            str += encodeURIComponent(data[e]);
          }

          paramParts.push(str);
        }
      }

      asParam = paramParts.join('&');
    }

    const encoded = btoa(asParam); // base64_encodes the query string

    const postData = `data=${encoded}`;
    let rawData;

    if (config.webapi.key === 'open') {
      // legacy hup "open" hash handling
      rawData = config.webapi.key + action + encodeURIComponent(encoded); // encodeURIComponent == urlencode
    } else {
      // build hash to sign the request (this is basically the same as "asParam" but without the encoding)
      let hashBase = '';

      if (!isNullOrEmpty(data)) {
        for (e in data) {
          if (data.hasOwnProperty(e)) {
            if (data[e] === undefined) {
              // otherwise this will resolve to the string "undefined" in the hash base, which is not correct
              hashBase += `${e}=&`;
            } else {
              hashBase += `${e}=${data[e]}&`;
            }
          }
        }

        hashBase = hashBase.substr(0, hashBase.length - 1); // chop off last &
      }

      rawData = config.webapi.key + action + hashBase; // use the users authHash as the shared secret

      rawData += config.uber.authHash;
    } // generate sha-1 hash from raw data


    const hash = js_sha1()(rawData);
    const L = (_getParameterByName = getParameterByName('L')) !== null && _getParameterByName !== void 0 ? _getParameterByName : 0;
    this.apiUrl = `${config.websiteURL}index.php?eID=api&key=${config.webapi.key}`;
    const url = `${this.apiUrl}&action=${action}&hash=${hash}&outputFormat=json&apiVersion=${config.webapi.version}&L=${L}&source=${config.trackingSource}`;

    if (debug) {
      bl_print(`${action} Web API Call: ${url}&${postData}`);
    }

    let type = debug ? 'get' : 'post';

    if (postData.length > 200) {
      // URLs have a maximum length defined for GET requests. Larger payloads should be transmitted via POST
      type = 'post';
    }

    const resolverCallback = res => {
      // the result of the webapi is automatically resolved to local objects
      if (successCallback && res) {
        const webApiResponse = messageResolver.resolveAll(res, WebApiResponse.className);
        // ui_GameVersionHelper__WEBPACK_IMPORTED_MODULE_14__["gameVersionHelper"].setWebApiVersion(webApiResponse.version);
        successCallback(webApiResponse);
      }
    };

    const timeout = retry ? 5 * 1000 : 0;
    const ajaxSetup = new engine_network_AjaxSetup__WEBPACK_IMPORTED_MODULE_8__["AjaxSetup"](url, postData, timeout, resolverCallback, errorCallback, this.async, type);
    return new engine_network_AjaxRequest__WEBPACK_IMPORTED_MODULE_7__["AjaxRequest"](ajaxSetup, action, hash, processOnlyLatestResult, processIncrementalResults);
}

function prepareApiRequest(action, data) {
    const { debug } = config.webapi;
  
    if (config.webapi.key !== 'open') {
      data.authTstamp = config.uber.authTstamp;
      data.authUserID = config.userId;
    }
  
    data.source = config.trackingSource;
  
    const asParam = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key] ?? '')}`)
      .join('&');
  
    const encoded = btoa(asParam);
    const postData = `data=${encoded}`;
    let rawData;
  
    if (config.webapi.key === 'open') {
      rawData = config.webapi.key + action + encodeURIComponent(encoded);
    } else {
      const hashBase = Object.keys(data)
        .map(key => `${key}=${data[key] ?? ''}`)
        .join('&');
      rawData = config.webapi.key + action + hashBase + config.uber.authHash;
    }
  
    const hash = js_sha1(rawData);
    const L = getParameterByName('L') || 0;
  
    const apiUrl = `${config.websiteURL}index.php?eID=api&key=${config.webapi.key}`;
    const url = `${apiUrl}&action=${action}&hash=${hash}&outputFormat=json&apiVersion=${config.webapi.version}&L=${L}&source=${config.trackingSource}`;
  
    if (debug) {
      console.log(`${action} Web API Call: ${url}&${postData}`);
    }
  
    const type = postData.length > 200 ? 'post' : 'get';
  
    return { url, postData, type };
}


/**
     * Sends the request to the WebAPI.
     * request is prepared here {@link prepareApiRequest}
     *
     * @param {string} action
     * @param {object} data key value pairs
     * @param {LzrWebAPI~successCallback} [successCallback] A function that is called whenever request is finishes with success
     * @param {boolean} [useCooldown] set this to true when performing the same request within a timeframe of 500ms should be ignored
     * @param {boolean} [processOnlyLatestResult] set this to true when result of last request should be executed on client side
     * @param {boolean} [processIncrementalResults] set this to true when result of incremental requests should be executed on client side
     * @param {boolean} [retry] set this to true when the call should use a timeout/retry mechanism¿
     */
    
    
function sendApiRequest2(action, data, successCallback, useCooldown, processOnlyLatestResult, processIncrementalResults, retry) {
    const ajaxRequest = this.prepareApiRequest(action, data, successCallback, processOnlyLatestResult, processIncrementalResults, retry);
    engine_network_AjaxManager__WEBPACK_IMPORTED_MODULE_6__["ajaxManager"].performAjax(ajaxRequest, useCooldown);
}

async function sendApiRequest(action, data, successCallback, retry = false) {
    const { url, postData, type } = prepareApiRequest(action, data);
    console.log("url", url)
    console.log("postData", postData)
    console.log("type", type)
    try {
      const response = await fetch(url, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"130\", \"Opera GX\";v=\"115\", \"Not?A_Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": postData,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })
      console.log(await response.json())
  
      // Resolve response using the messageResolver
      if (successCallback) {
        const webApiResponse = messageResolver.resolveAll(response.data, "WebApiResponse");
        successCallback(webApiResponse);
      }
    } catch (error) {
      console.error("Error during API call:", error);
  
      if (retry) {
        console.log("Retrying...");
        setTimeout(() => sendApiRequest(action, data, successCallback, retry), 5000);
      }
    }
  }
  

sendApiRequest(
    "getAlliance", 
    {
        "allianceID": 504925,
        "members": 1,
        "invites": 1
    },
    (response) => {
        console.log("API Response:", response);
    },
    false // retry
)

properties = ["username"]
userID = 89236966
const data = {
    userID,
};
if (Array.isArray(properties)) {
    for (let i = 0; i < properties.length; i++) {
        data[properties[i]] = 1;
    }
} else {
    data[properties] = 1;
}

sendApiRequest(
    "getUserDetails", 
    data,
    (response) => {
        console.log("API Response:", response);
    },
    false // retry
)