import notify from './notify';

/**
 * Вернет объект, для работы с формой метода
 *
 * @param methodName
 * @constructor
 */
class MethodRequestHelper {
  constructor(currentMethod, formClass) {
    this.formMethod = window.document.querySelector(formClass);
    this.currentMethod = currentMethod;

    if (!this.formMethod) {
      throw new Error('Форма для отправки запроса не найдена');
    }

    this.resultArea = this.formMethod.querySelector('.result-content-area');

    if (!this.currentMethod) {
      throw new Error('Метод не найден');
    }
  }

  _castValue(paramName, value) {
    if (!this.currentMethod || !this.currentMethod.params) {
      return value;
    }

    const currentParam = this.currentMethod.params.find((item) => {
      return item.name === paramName;
    });

    if (!currentParam) {
      return value;
    }

    if (currentParam.type === 'number') {
      return parseFloat(value);
    }

    if (currentParam.type === 'boolean') {
      return !!+value;
    }

    if (currentParam.type === 'json') {
      try {
        return JSON.parse(value);
      } catch (e) {
        notify('Ошибка в формате данных');
        return {};
      }
    }

    return value;
  }

  _showResponse(className, data) {
    this.resultArea.classList.add(className);
    setTimeout(() => this.resultArea.classList.remove(className), 3000);
    this.resultArea.value = JSON.stringify(data);
    this.resultArea.setAttribute('data-test', JSON.stringify(data));
    console.log(data);
  }

  fetchParams(defaultParams) {
    const params = defaultParams || {};

    if (!this.formMethod) {
      return params;
    }

    const inputs = this.formMethod.querySelectorAll('input');

    if (!inputs.length) {
      return params;
    }

    inputs.forEach((el) => {
      if (el.value === '') {
        return params;
      }

      params[el.name] = this._castValue(el.name, el.value);
    });

    return params;
  }

  getRequestParams() {
    const value = this.formMethod.querySelector('.request-params-area').value;
    let data = {};

    try {
      data = JSON.parse(value);
    } catch (e) {
      notify('Ошибка в формате данных');
      return {};
    }

    return data['params'];
  }

  updateRequestInfo() {
    this.formMethod.querySelector('.request-params-area').value = JSON.stringify({
      "method": this.currentMethod.name,
      "params": this.fetchParams()
    });
  }

  showRequestApi(params) {
    this.formMethod.querySelector('.request-params-area').value = JSON.stringify({
      "method": 'VKWebAppCallAPIMethod',
      "params": this.fetchParams(params)
    });
  }

  getScopeForApiRequest() {
    return this.currentMethod.scope;
  }

  showErrorResponse(data) {
    this._showResponse('control-text--errorResponse', data)
  }

  showSuccessResponse(data) {
    this._showResponse('control-text--successResponse', data)
  }
}

export default MethodRequestHelper;
