class UrlParser {
  constructor() {
    this.params = {};
  }

  parseUri() {
    const uri = window.location.search.substr(1);
    const partParams = uri.split('&');

    if (!partParams.length) {
      return;
    }

    partParams.forEach((item) => {
      const [key, value] = item.split('=');
      this.params[key] = value;
    });
  }

  getParam(name) {
    if (typeof(this.params[name]) !== 'undefined') {
      return this.params[name];
    }

    return null;
  }
}

export default UrlParser