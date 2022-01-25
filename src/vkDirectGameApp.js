import methods from './methods';
import apiRequests from './api_requests';
import notify from './notify';
import renderMethods from './renderMethods';
import renderApiRequests from './renderApiRequests';
import getHelperForMethod from './getHelperForMethod';
import getHelperForRequestApi from './getHelperForRequestApi';
import requestApiHelper from './requestApiHelper';
import bridge from '@vkontakte/vk-bridge';
import UrlParser from "./UrlParser";

class vkDirectGameApp {
  constructor() {
    this.urlParser = null;
  }

  //Выводим список доступных методов на экран и запускаем vk-bridge
  init() {
    this._init();
  }

  _init = () => {
    this.urlParser = new UrlParser();
    this.urlParser.parseUri();
    const modifier = this.urlParser.getParam('platform') === 'web' ? 'web' : '';
    this.app_id = parseInt(this.urlParser.getParam('api_id'));
    this.access_token = this.urlParser.getParam('access_token');
    this.renderHashInfo();
    this.addHandlers();
    renderMethods(methods, modifier);
    renderApiRequests(apiRequests);
    this.allowed_scopes = this.getAllowedScopes();
    this.requestApiHelper = new requestApiHelper(this.app_id, this.allowed_scopes);
    requestApiHelper.renderScopesInfo(Array.from(this.allowed_scopes.keys()));
  };

  renderHashInfo() {
    const hash = this.urlParser.getParam('hash');
    const hashInfoWrap = document.querySelector('.hash-banner');
    const hashInfoEl = hashInfoWrap.querySelector('.banner__description');

    if (!hash || !hash.length) {
      return;
    }

    hashInfoWrap.classList.remove('hide');
    hashInfoEl.innerHTML = hash;
  }

  toggleMoreInfoMethod(methodName, el) {
    const moreInfoBlock = el.parentElement.querySelector('.method-item__more');
    const iconToggle = el.querySelector('.icon-toggle');
    const helper = getHelperForMethod(methodName);

    helper.updateRequestInfo();
    moreInfoBlock.classList.toggle('hide');

    if (moreInfoBlock.classList.contains('hide')) {
      iconToggle.innerHTML = '+';
    } else {
      iconToggle.innerHTML = '-';
    }
  }

  toggleRequestInfo(requestApiName, el) {
    const moreInfoBlock = el.parentElement.querySelector('.method-item__more');
    const iconToggle = el.querySelector('.icon-toggle');
    const helper = getHelperForRequestApi(requestApiName);

    helper.showRequestApi();
    moreInfoBlock.classList.toggle('hide');

    if (moreInfoBlock.classList.contains('hide')) {
      iconToggle.innerHTML = '+';
    } else {
      iconToggle.innerHTML = '-';
    }
  }

  filterMethods(el) {
    const query = el.value;
    const filterMethods = methods.filter((item) => {
      return ~item.name.toUpperCase().indexOf(query.toUpperCase());
    });

    renderMethods(filterMethods);
  }

  updateRequest(methodName) {
    const helper = getHelperForMethod(methodName);
    helper.updateRequestInfo();
  }

  send(methodName) {
    if (!bridge.supports(methodName)) {
      notify('Метод не поддерживается');
      return;
    }

    const helper = getHelperForMethod(methodName);
    bridge.send(methodName, helper.getRequestParams()).then(
      data => helper.showSuccessResponse(data)
    ).catch(
      error => helper.showErrorResponse(error)
    );
  }

  tryCallApi(requestName) {
    const helper = getHelperForRequestApi(requestName);
    const scopeForApiRequest = helper.getScopeForApiRequest();
    const params = {"access_token": this.access_token, "v": "5.131"};
    helper.showRequestApi(params);
    this.requestApiHelper.trySendRequest(helper.currentMethod.name, scopeForApiRequest, params).then(
      data => helper.showSuccessResponse(data)
    ).catch(
      error => helper.showErrorResponse(error)
    )
  }

  addHandlers() {
    const allTabs = document.querySelectorAll('.tab-item');

    allTabs.forEach((tab) => {
      tab.addEventListener('click', (eventObject) => {
        const targetTab = eventObject.target;

        if (!targetTab || targetTab.classList.contains('active')) {
          return;
        }

        allTabs.forEach((element) => {
          element.classList.remove('active');
        });

        const contentWrap = document.querySelector('.' + targetTab.dataset.tab);

        if (!contentWrap) {
          return;
        }

        document.querySelectorAll('.content-wrap').forEach((element) => {
          element.classList.remove('active');
        });

        contentWrap.classList.add('active');
        targetTab.classList.add('active');
      });
    })
  }

  getAllowedScopes() {
    const scopes_raw = this.urlParser.getParam('access_token_settings');

    if (!scopes_raw) {
      return new Map();
    }

    const allowed_scopes = unescape(scopes_raw).split(',');

    if (!allowed_scopes || allowed_scopes.length <= 0) {
      return new Map();
    }

    return new Map(allowed_scopes.map(scope => [scope, true]));
  }
}

export default vkDirectGameApp;
