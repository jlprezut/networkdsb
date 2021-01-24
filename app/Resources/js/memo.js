import nodefony from 'nodefony-client' ;

class Memo extends nodefony.Service {

  constructor(kernel) {
    super("memo",kernel.container) ;
  }

  initialize() {
    this.memoId = "" ;
    this.memoTab = [] ;
    this.api = this.kernel.api ;
    this.listenEvents() ;
  }

  listenEvents() {
    let select = document.getElementById('cleanMemo') ;
    select.addEventListener('click', (event) => {
              this.hide() ;
    });

  }

  hide() {
    this.memoId = "" ;
    document.getElementById("memoId").innerHTML="";
    document.getElementById("memorisation").style.visibility=(false)?'visible':'hidden';
  }

  setMemoId(obj) {
    this.memoId = obj.id_obj ;
    this.api.get(`/api/port/${this.memoId}/text`)
    .then((r) => {
      document.getElementById("memoId").innerHTML=r[0].description ;
      document.getElementById("memorisation").style.visibility=(true)?'visible':'hidden';
    });
  }

  addMemoTab(obj) {
    if (this.findMemoTab(obj) === -1) {
      this.memoTab.push(obj) ;
      this.highlightNode() ;
      this.kernel.parcours.clickEventNode(this.kernel.network.body.data, this.kernel.network.body.data.nodes.get(obj.type_obj + "-" + obj.id_obj) ) ;
    }
  }

  countMemoTab() {
    return this.memoTab.length ;
  }

  freeMemoTab() {
    this.memoTab.forEach((item,j) => {
      this.kernel.network.canvas.body.nodes[item.type_obj + "-" + item.id_obj].options.borderWidth = 1 ;
      this.kernel.network.canvas.body.nodes[item.type_obj + "-" + item.id_obj].options.shapeProperties.useBorderWithImage = false  ;
    }) ;
    this.memoTab.splice(0,100) ;
    this.kernel.parcours.unlockAllLink() ;
  }

  delMemoTab(obj) {
    let indice = this.findMemoTab(obj) ;
    if ( indice !== -1) {
      this.kernel.network.canvas.body.nodes[obj.type_obj + "-" + obj.id_obj].options.borderWidth = 1 ;
      this.kernel.network.canvas.body.nodes[obj.type_obj + "-" + obj.id_obj].options.shapeProperties.useBorderWithImage = false  ;
      this.memoTab.splice(indice,1) ;
    }
    this.kernel.parcours.clickEventNode(this.kernel.network.body.data, this.kernel.network.body.data.nodes.get(obj.type_obj + "-" + obj.id_obj) ) ;
  }

  findMemoTab(obj) {
    let trouve = -1 ;
    this.memoTab.forEach((item,j) => {
      if (item.type_obj === obj.type_obj && parseFloat(item.id_obj) === parseFloat(obj.id_obj)) {
        trouve = j ;
      }
    }) ;
    return trouve ;
  }

  getMemoTab() {
    return this.memoTab ;
  }

  highlightNode() {
    this.memoTab.forEach((item,j) => {
      this.kernel.network.canvas.body.nodes[item.type_obj + "-" + item.id_obj].options.borderWidth = 4 ;
      this.kernel.network.canvas.body.nodes[item.type_obj + "-" + item.id_obj].options.shapeProperties.useBorderWithImage = true  ;
    }) ;
  }

}

export default Memo ;
