const { promisify } = require('util');
const request = promisify(require('request'));

class OAuth2Client {
  constructor(emitter, auth) {
    this.emitter = emitter;
    this.auth = auth;
  }

  checkOAuth2Keys(keys) {
    this.emitter.logger.trace('Check keys = %j', keys);
    if (!keys) {
      throw new Error('cfg.auth.oauth2.keys can not be empty');
    }
    if (!keys.access_token) {
      throw new Error('No access tokens were returned by the OAuth2 provider');
    }
    if (!keys.refresh_token) {
      throw new Error('No refresh tokens were returned by the OAuth2 provider. Try to add access_type:offline as an additional parameter');
    }
  }

  async fetchNewToken() {
    this.emitter.logger.debug('Fetching new oauth2 token...');
    const { oauth2 } = this.auth;
    const authTokenResponse = await request({
      uri: oauth2.tokenUri,
      method: 'POST',
      json: true,
      simple: false,
      resolveWithFullResponse: true,
      form: {
        refresh_token: oauth2.keys.refresh_token,
        grant_type: 'refresh_token',
        client_id: oauth2.clientId,
        client_secret: oauth2.clientSecret,
        scope: oauth2.scopes ? oauth2.scopes.join(' ') : '',
      },
    });

    this.emitter.logger.trace('New token fetched : %j', authTokenResponse);

    if (authTokenResponse.statusCode >= 400) {
      throw new Error(`Error in authentication.  Status code: ${authTokenResponse.statusCode}, Body: ${JSON.stringify(authTokenResponse.body)}`);
    }

    return authTokenResponse.body;
  }

  async getValidToken() {
    const { keys } = this.auth.oauth2;
    this.checkOAuth2Keys(keys);
    const tokenExpiryTime = new Date(keys.tokenExpiryTime);
    const now = new Date();
    if (now < tokenExpiryTime) {
      this.emitter.logger.debug('Previously valid token found.');
      return keys.access_token;
    }

    const tokenRefreshStartTime = new Date();
    const oldRefreshToken = this.auth.oauth2.keys.refresh_token;
    this.auth.oauth2.keys = await this.fetchNewToken();
    if (!this.auth.oauth2.keys.refresh_token) {
      this.emitter.logger.debug('refresh_token was not returned, use old refresh_token');
      this.auth.oauth2.keys.refresh_token = oldRefreshToken;
    }
    this.checkOAuth2Keys(this.auth.oauth2.keys);
    // we need this check because expires_in is optional in oauth2
    if (this.auth.oauth2.keys.expires_in) {
      this.auth.oauth2.keys.tokenExpiryTime = (new Date(tokenRefreshStartTime.getTime()
        + (this.auth.oauth2.keys.expires_in * 1000))).toISOString();
    }
    this.emitter.logger.trace('Emit updateKeys = %j', this.auth);
    this.emitter.emit('updateKeys', { auth: this.auth });

    return this.auth.oauth2.keys.access_token;
  }
}

module.exports.OAuth2Client = OAuth2Client;
