import axios from 'axios';
import nodefony from 'nodefony' ;

class Api extends nodefony.Service {

  constructor(kernel) {
    super("api",kernel.container) ;
    try {
      axios.defaults.headers.common.Accept = 'application/json';
    } catch (e) {
      throw e;
    }
  }

  initialize() {
    this.log("Start") ;
  }

  http(url, method, options) {
    let opt = Object.assign({
      method: method || "get",
      url: url,
      data: null,
      headers: {}
    }, options);
    return axios(opt)
      .then(response => response.data.result)
      .catch((error) => {
          throw error;
      });
  }

  get(url, options) {
    return this.http(url, "get", options);
  }
  post(url, options) {
    return this.http(url, "post", options);
  }
  put(url, options) {
    return this.http(url, "put", options);
  }
  delete(url, options) {
    return this.http(url, "delete", options);
  }

}

export default Api;
