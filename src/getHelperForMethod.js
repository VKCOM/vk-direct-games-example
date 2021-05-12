import MethodRequestHelper from './methodRequestHelper';
import notify from './notify';
import methods from "./methods";

const cacheHelpers = [];

/**
 * @param methodName
 */
const getHelperForMethod = (methodName) => {
  if (cacheHelpers[methodName]) {
    return cacheHelpers[methodName];
  }

  try {
    const currentMethod = methods.find((item) => {
      return item.name === methodName;
    });

    const formClass = '.' + methodName + '-request-edit';
    cacheHelpers[methodName] = new MethodRequestHelper(currentMethod, formClass);
    return cacheHelpers[methodName];
  } catch (e) {
    notify(e.message);
  }

  return null;
};

export default getHelperForMethod