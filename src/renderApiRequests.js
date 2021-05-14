import templateApiRequestsList from './pages/components/api-requests-list.pug';

const renderApiRequests = (requestsList) => {
  const methodListEl = document.querySelector('#api-requests-list');
  requestsList.forEach((request) => {
    request.is_api_request = true;
    request.params = [
      {
        "name": "method",
        "title": "название метода API",
        "default": request.name,
        "required": true
      },
      {
        "name": "params",
        "title": "параметры метода API (параметр `access_token` никому передавать нельзя)",
        "type": "json",
        "default": JSON.stringify(request.params)
      }
    ];
  });
  methodListEl.innerHTML = templateApiRequestsList({"apiRequests": requestsList});
};

export default renderApiRequests