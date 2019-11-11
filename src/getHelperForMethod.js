import MethodRequestHelper from './methodRequestHelper';
import notify from './notify';

const cacheHelpers = [];

/**
 * @param methodName
 */
const getHelperForMethod = (methodName) => {
  if (cacheHelpers[methodName]) {
    return cacheHelpers[methodName];
  }

  try {
    cacheHelpers[methodName] = new MethodRequestHelper(methodName);
    return cacheHelpers[methodName];
  } catch (e) {
    notify(e.message);
  }

  return null;
};

export default getHelperForMethod