import { sha1 } from 'js-sha1';

export class RequestBuilder {
  static getParameterByName(name: string, url: string): string | null {
    const regex = new RegExp(`[?&]${name.replace(/[[]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    return results ? decodeURIComponent(results[2]?.replace(/\+/g, ' ') || '') : null;
  }

  static prepare(action: string, data: Record<string, any>, config: Record<string, any>) {
    const { key } = config.webapi;
    const { authTstamp, authHash } = config.uber;
    const { userId, trackingSource, websiteURL } = config;

    if (key !== 'open') {
      Object.assign(data, { authTstamp, authUserID: userId });
    }
    data.source = trackingSource;

    const asParam = Object.entries(data)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`)
      .join('&');

    const encoded = btoa(asParam);
    const postData = `data=${encoded}`;
    const hashBase = key === 'open'
      ? `${key}${action}${encodeURIComponent(encoded)}`
      : `${key}${action}${asParam}${authHash}`;

    const hash = sha1(hashBase);
    const L = this.getParameterByName('L', websiteURL) || 0;

    const apiUrl = `${websiteURL}index.php?eID=api&key=${key}`;
    const url = `${apiUrl}&action=${action}&hash=${hash}&outputFormat=json&apiVersion=${config.webapi.version}&L=${L}&source=${trackingSource}`;
    
    return { url, postData, type: 'POST' };
  }
}
