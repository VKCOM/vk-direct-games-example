import methods from './methods';
import notify from './notify';

/**
 * Вернет объект, для работы с формой метода
 *
 * @param methodName
 * @constructor
 */
class MethodRequestHelper {
  constructor(methodName) {
    this.formMethod = window.document.querySelector('.' + methodName + '-request-edit');
    this.currentMethod = methods.find((item) => {
      return item.name === methodName;
    });

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
  }

  fetchParams() {
    const params = {};

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

  showRequest() {
    this.formMethod.querySelector('.request-params-area').value = JSON.stringify({
      "method": this.currentMethod.name,
      "params": this.fetchParams()
    });
  }

  showErrorResponse(data) {
    this._showResponse('control-text--errorResponse', data)
  }

  showSuccessResponse(data) {
    this._showResponse('control-text--successResponse', data)
  }
}

export default MethodRequestHelper;
