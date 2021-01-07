/*
 *
 *	ENTRY POINT
 *  WEBPACK bundle app
 *  client side
 */
import "../css/app.css";

import nodefony from 'nodefony-client' ;
/*
 *	Class Bundle App
 */
class App extends nodefony.Service{

  constructor() {
    super("kernel");
    this.set("kernel", this) ;
    this.initSyslog() ;
    this.log("start");
  }

}

/*
 * HMR
 */
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('Cannot apply HMR update.', err);
    }
  });
}
export default new App();
