import bridge from "@vkontakte/vk-bridge";

const VK_BRIDGE_CHECK_SCOPE_METHOD = 'VKWebAppCheckAllowedScopes';

export default class requestApiHelper {
  constructor(app_id, allowed_scopes) {
    this.app_id = app_id;
    this.allowed_scopes = allowed_scopes;
  }

  checkAllowedScopes(scope) {
    if (!bridge.supports(VK_BRIDGE_CHECK_SCOPE_METHOD)) {
      return true;
    }

    bridge.send(VK_BRIDGE_CHECK_SCOPE_METHOD, {
      "app_id": this.app_id,
      "scopes": scope
    }).then(
      (data) => {
        this.allowed_scopes[scope] = data.some((item) => {
          return item.scope === scope && item.allowed;
        });

        return this.allowed_scopes[scope];
      }
    ).catch(console.error);
  }

  trySendRequest(method, scope, params) {
    if (!this.checkAllowedScopes(scope)) {
      throw new Error('scope is not allowed');
    }

    const send = (method, params) => {
      return bridge.send('VKWebAppCallAPIMethod', {"method": method, "request_id": "1234", "params": params});
    }

    if (!this.allowed_scopes[scope]) {
      bridge.send('VKWebAppGetAuthToken', {
        "app_id": this.app_id,
        "scope": scope
      }).then(
        (data) => {
          this.access_token = data.access_token
          this.allowed_scopes[scope] = true;
          return send(method, params);
        }
      ).catch(console.error);
    } else {
      return send(method, params);
    }
  }
}