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
    this.urlParser = new UrlParser();
    this.urlParser.parseUri();
    const modifier = this.urlParser.getParam('platform') === 'web' ? 'web' : '';
    this.app_id = parseInt(this.urlParser.getParam('api_id'));
    this.access_token = this.urlParser.getParam('access_token');
    this.renderHashInfo();
    this.addHandlers();
    renderMethods(methods, modifier);
    renderApiRequests(apiRequests);
    this.requestApiHelper = new requestApiHelper(this.app_id);
    bridge.send('VKWebAppInit', {});
  }

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

    helper.showRequest();
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

  send(methodName) {
    if (!bridge.supports(methodName)) {
      notify('Метод не поддерживается');
      return;
    }

    const helper = getHelperForMethod(methodName);
    helper.showRequest();
    bridge.send(methodName, helper.fetchParams()).then(
      data => helper.showSuccessResponse(data)
    ).catch(
      error => helper.showErrorResponse(error)
    );
  }

  async tryCallApi(requestName) {
    const helper = getHelperForRequestApi(requestName);
    const scopeForApiRequest = helper.getScopeForApiRequest();
    const params = {"access_token": this.access_token};
    helper.showRequestApi(params);
    await this.requestApiHelper.trySendRequest(helper.currentMethod.name, scopeForApiRequest, params).then(
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
}

export default vkDirectGameApp;