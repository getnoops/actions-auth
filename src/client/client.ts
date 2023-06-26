import { HttpClient } from '@actions/http-client';

interface ClientOptions {
  basePath?: string;
  providerId: string;
  token: string;
  audience: string;
}

// userAgent is the default user agent.
const userAgent = `getnoops:actions-auth/1.0.0`;

export class Client  {
  readonly basePath: string;
  readonly providerId: string;
  readonly token: string;
  readonly audience: string;

  readonly client: HttpClient;

  constructor(opts: ClientOptions) {
    this.basePath = opts.basePath || 'https://sts.getnoops.com';
    this.providerId = opts.providerId;
    this.token = opts.token;
    this.audience = opts.audience;

    this.client = new HttpClient(userAgent);
  }
  
  async getAuthToken(): Promise<string> {
    const pth = this.basePath + `/token`;

    const data = {
      audience: this.providerId,
      grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
      requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token',
      scope: 'noops',
      subjectTokenType: 'urn:ietf:params:oauth:token-type:jwt',
      subjectToken: this.token,
    };

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const resp = await this.client.request('POST', pth, JSON.stringify(data), headers);
      const body = await resp.readBody();
      const statusCode = resp.message.statusCode || 500;
      if (statusCode >= 400) {
        throw new Error(`(${statusCode}) ${body}`);
      }
      const parsed = JSON.parse(body);
      return parsed['access_token'];
    } catch (err) {
      throw new Error(
        `Failed to generate federated token for ${this.providerId}: ${err}`,
      );
    }
  }
}