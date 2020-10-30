import nodefony from 'nodefony-client' ;

class Tools extends nodefony.Service {

  constructor(kernel) {
    super("tools",kernel.container) ;
  }

  initialize() {
    this.chart = this.kernel.chart ;
    this.networkSeries = this.kernel.networkSeries ;
    this.listernerNode = [] ;
    this.listernerLink = [] ;
    this.popup = null ;
    this.log("Start") ;
  }

  closePopUp() {
    if (this.popup !== null) {
      this.popup.close() ;
      this.popup = null ;
    }
  }

  openPopup(content,title) {
    this.closePopUp() ;
    this.popup = this.chart.openPopup(content,title) ;
  }

  cleanNodeEvent() {
    while (this.listernerNode.length > 0) {
      let x = this.listernerNode.pop();
      x.dispose() ;
    } ;
  }

  cleanLinkEvent() {
    while (this.listernerLink.length > 0) {
      let x = this.listernerLink.pop();
      x.dispose() ;
    } ;
  }

  cleanEvent() {
    this.cleanLinkEvent() ;
    this.cleanNodeEvent() ;
  }

  addNodeEvent(y) {
    this.listernerNode.push(y) ;
  }

  addLinkEvent(y) {
    this.listernerLink.push(y) ;
  }

}

export default Tools ;
