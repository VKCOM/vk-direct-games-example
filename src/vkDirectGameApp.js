import methods from './methods';
import notify from './notify';
import renderMethods from './renderMethods';
import getHelperForMethod from './getHelperForMethod';
import connect from '@vkontakte/vk-connect';

class vkDirectGameApp {
  //Выводим список доступных методов на экран и запускаем vk-connect
  init() {
    renderMethods(methods);
    connect.send('VKWebAppInit', {});
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

  filterMethods(el) {
    const query = el.value;
    const filterMethods = methods.filter((item) => {
      return ~item.name.toUpperCase().indexOf(query.toUpperCase());
    });

    renderMethods(filterMethods);
  }

  send(methodName) {
    if (!connect.supports(methodName)) {
      notify('Метод не поддерживается');
      return;
    }

    const helper = getHelperForMethod(methodName);
    helper.showRequest();
    connect.sendPromise(methodName, helper.fetchParams()).then(
      data => helper.showSuccessResponse(data)
    ).catch(
      error => helper.showErrorResponse(error)
    );
  }
}

export default vkDirectGameApp;