import nodefony from 'nodefony-client' ;

class Memo extends nodefony.Service {

  constructor(kernel) {
    super("memo",kernel.container) ;
  }

  initialize() {
    this.memoId = "" ;
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
    this.memoId = obj.idPort ;
    this.api.get(`/api/port/${this.memoId}/text`)
    .then((r) => {
      document.getElementById("memoId").innerHTML=r[0].description ;
      document.getElementById("memorisation").style.visibility=(true)?'visible':'hidden';
    });
  }

}

export default Memo ;
