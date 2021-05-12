import MethodRequestHelper from './methodRequestHelper';
import notify from './notify';
import apiRequests from "./api_requests";

const cacheHelpers = [];

/**
 * @param requestApiName
 */
const getHelperForRequestApi = (requestApiName) => {
  if (cacheHelpers[requestApiName]) {
    return cacheHelpers[requestApiName];
  }

  try {
    const currentRequestApi = apiRequests.find((item) => {
      return item.name_form === requestApiName;
    });

    const formClass = '.' + requestApiName + '-request-edit';
    cacheHelpers[requestApiName] = new MethodRequestHelper(currentRequestApi, formClass);
    return cacheHelpers[requestApiName];
  } catch (e) {
    notify(e.message);
  }

  return null;
};

export default getHelperForRequestApi