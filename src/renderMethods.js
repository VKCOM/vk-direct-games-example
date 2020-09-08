import templateMethodsList from './pages/components/methods-list.pug';
import UrlParser from "./UrlParser";
import methods from "./methods";
import bridge from '@vkontakte/vk-bridge';

function tryAddAccessToken(methodConfig) {
  if (methodConfig.name === 'VKWebAppCallAPIMethod') {
    const parser = new UrlParser();
    parser.parseUri();

    try {
      const current = JSON.parse(methodConfig.params[2]['default']);
      current["access_token"] = parser.getParam('access_token');
      methodConfig.params[2]['default'] = JSON.stringify(current);
    } catch (e) {}
  }
}

const renderMethods = (methodsList, modifier = '') => {
  methods.forEach((item) => {
    item.is_supported = bridge.supports(item.name);
    tryAddAccessToken(item);
  });

  const methodListEl = document.querySelector('#methods-list');
  if (modifier) {
    methodListEl.classList.add(`method-list--${modifier}`);
  }

  methodListEl.innerHTML = templateMethodsList({"methods": methodsList});
};

export default renderMethods