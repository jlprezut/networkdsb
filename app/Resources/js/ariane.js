import nodefony from 'nodefony-client' ;

class Ariane extends nodefony.Service {

  constructor(kernel) {
    super("ariane",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.backTime = false ;
    this.log("Start") ;
    this.listenEvents() ;
  }

  listenEvents() {
  }

  goLink(id) {
    let currentObj = this.kernel.arianeTab[id] ;
    if (currentObj === undefined) {
      return ;
    }
    this.kernel.arianeTab.splice(id,100) ;
    this.refreshAriane() ;
    this.kernel.eventUserAction(currentObj.obj, currentObj.class, currentObj.methode) ;
  }

  refreshAriane() {
    this.kernel.arianeID.innerHTML = '' ;
    this.kernel.arianeTab.forEach((item,j) => {
      this.kernel.arianeID.innerHTML = this.kernel.arianeID.innerHTML + ` / <span
                        onclick="mobile.eventUserAction(${j},
                          'ariane','goLink')" class='A_tooltip SpanLink'>${item.libelle}<span>${item.tooltip}</span></span>` ;
    }) ;
  }

  addLink(newObj) {
    let lastId = this.kernel.arianeTab.length - 1;
    if (lastId >= 0) {
      let lastObj = this.kernel.arianeTab[lastId] ;
      if (lastObj.obj.typeObj === newObj.obj.typeObj &&
          parseFloat(lastObj.obj.idObj) === parseFloat(newObj.obj.idObj) ) {
        return ;
      }
    }

    const count = this.kernel.arianeTab.push(newObj) ;
    if (count > 10) {
      this.kernel.arianeTab.shift() ;
    }
    this.refreshAriane() ;
  }

  goBackLink() {
    if (this.backTime) {
      if (this.kernel.arianeTab.length - 2 >= 0) {
        this.goLink(this.kernel.arianeTab.length - 2) ;
      } else {
        this.kernel.arianeTab.shift() ;
        this.kernel.parcours.affichageOne({ 'typeObj' : 'User', 'idObj' : this.kernel.user.id_user } ) ;
      }
      this.backTime = false ;
    } else {
      this.backTime = true ;
    }
  }

}

export default Ariane;
