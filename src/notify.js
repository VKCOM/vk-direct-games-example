const notify = (text) => {
  const block = window.document.querySelector('.notify-block');
  block.textContent = text;
  block.classList.remove('hide');

  setTimeout(() => {
    block.classList.add('hide');
  }, 5000)
};

export default notify