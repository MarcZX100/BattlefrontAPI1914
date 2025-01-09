import { sha1 } from 'js-sha1';


export class RequestBuilder {
  static getParameterByName(name: string, url: string): string | null {
    const escapedName = name.replace(/[[]]/g, '\\$&');
    const regex = new RegExp(`[?&]${escapedName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    return results ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null;
  }
  static prepare(action: string, data: Record<string, any>, config: Record<string, any>) {
    if (config.webapi.key !== 'open') {
      data.authTstamp = config.uber.authTstamp;
      data.authUserID = config.userId;
    }

    data.source = config.trackingSource;

    const asParam = Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key] ?? '')}`)
      .join('&');

    const encoded = btoa(asParam);
    const postData = `data=${encoded}`;
    let rawData;

    if (config.webapi.key === 'open') {
      rawData = config.webapi.key + action + encodeURIComponent(encoded);
    } else {
      const hashBase = Object.keys(data)
        .map((key) => `${key}=${data[key] ?? ''}`)
        .join('&');
      rawData = config.webapi.key + action + hashBase + config.uber.authHash;
    }

    const hash = sha1(rawData);
    const L = RequestBuilder.getParameterByName('L', config.websiteURL) || 0;

    const apiUrl = `${config.websiteURL}index.php?eID=api&key=${config.webapi.key}`;
    const url = `${apiUrl}&action=${action}&hash=${hash}&outputFormat=json&apiVersion=${config.webapi.version}&L=${L}&source=${config.trackingSource}`;

    const type = "POST"; //postData.length > 200 ? 'POST' : 'GET';

    return { url, postData, type };
  }
}
