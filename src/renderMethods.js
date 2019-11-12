import templateMethodsList from './pages/components/methods-list.pug';
import UrlParser from "./UrlParser";
import methods from "./methods";
import connect from "@vkontakte/vk-connect";

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

const renderMethods = (methodsList) => {
  methods.forEach((item) => {
    item.is_supported = connect.supports(item.name);
    tryAddAccessToken(item);
  });

  document.querySelector('#methods-list').innerHTML = templateMethodsList({"methods": methodsList});
};

export default renderMethods