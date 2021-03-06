import bridge from "@vkontakte/vk-bridge";

const VK_BRIDGE_CHECK_SCOPE_METHOD = 'VKWebAppCheckAllowedScopes';

export default class requestApiHelper {
  constructor(app_id, allowed_scopes) {
    this.app_id = app_id;
    this.scopes = allowed_scopes;
  }

  async trySendRequest(method, scope, params) {
    const send = (method, params) => {
      return bridge.send('VKWebAppCallAPIMethod', {"method": method, "request_id": "1234", "params": params});
    }

    if (bridge.supports(VK_BRIDGE_CHECK_SCOPE_METHOD) && !this.scopes.has(scope)) {
      try {
        const allowed_scopes = await bridge.send(VK_BRIDGE_CHECK_SCOPE_METHOD, {
          "app_id": this.app_id,
          "scopes": scope
        });
        this.setScope(scope, allowed_scopes.some((item) => {
          return item.scope === scope && item.allowed;
        }));
      } catch (e) {
        console.error(e);
      }
    }

    if (!this.scopes.get(scope)) {
      try {
        const auth_token_data = await bridge.send('VKWebAppGetAuthToken', {
          "app_id": this.app_id,
          "scope": scope
        });

        this.access_token = auth_token_data.access_token;
        this.setScope(scope, true);
      } catch (e) {
        console.error(e);
      }

      params['access_token'] = this.access_token;
      return send(method, params);
    } else {
      return send(method, params);
    }
  }

  setScope(scope, is_allowed) {
    this.scopes.set(scope, is_allowed);
    requestApiHelper.renderScopesInfo(Array.from(this.scopes.keys()));
  }

  static renderScopesInfo(scopes) {
    const scopesInfoWrap = document.querySelector('.scopes-banner');
    const scopesInfoEl = scopesInfoWrap && scopesInfoWrap.querySelector('.banner__description');

    if (!scopes || !scopes.length) {
      return;
    }

    scopesInfoWrap.classList.remove('hide');
    scopesInfoEl.innerHTML = scopes.join(", ");
  }
}