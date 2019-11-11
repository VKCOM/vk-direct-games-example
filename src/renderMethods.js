import templateMethodsList from './pages/components/methods-list.pug';

const renderMethods = (methodsList) => {
  methodsList.sort((a, b) => {
    const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  document.querySelector('#methods-list').innerHTML = templateMethodsList({"methods": methodsList});
};

export default renderMethods