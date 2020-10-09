import nodefony from 'nodefony' ;

class ErrorGraphMobile extends nodefony.Service{

  constructor(kernel) {
    super('errorGraphMobile',kernel.container);
  }

  initialize() {
    this.api = this.kernel.api ;
    this.divMainMenu = this.kernel.divMainMenu ;
    this.divErreurs = this.kernel.divErreurs ;
    this.portGraph = this.kernel.portGraph ;
    this.divParcourir = this.kernel.divParcourir ;
    this.listenEvents() ;
    this.log("Start") ;
  }

  listenEvents() {
    let select = document.getElementById('errorLink') ;
    select.addEventListener('click', (event) => {
              this.listeErreur() ;
    });

    let imgBack = document.getElementById("backfromErreur") ;
    imgBack.addEventListener('click', (event) => {
              this.backMenu() ;
    });
  }

  showErreurPort(obj) {
    let idPort = obj.idPort ;
    this.divErreurs.style.display=(false)?'block':'none';
    this.divParcourir.style.display=(true)?'block':'none';
    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    this.portGraph.affichageOne(idPort) ;
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divErreurs.style.display=(false)?'block':'none';
  }

  listeErreur(){
    this.divMainMenu.style.display=(false)?'block':'none';
    this.divErreurs.style.display=(true)?'block':'none';

    this.api.get('/api/error/port')
      .then((r) => {
        let content = '' ;
        for (let i=0; i< r.length; i++) {
          content = content + `<a href='#' onclick="mobile.eventUserAction({ 'idPort': ${r[i].id_port} },'errorGraph','showErreurPort')">Baie / ${r[i].nom_baie} / ${r[i].description} (${r[i].type}) / Port num : ${r[i].numero_port} (nb liens : ${r[i].nb_link})</a><br>` ;
        }
        if (content === '') {
          content = 'Aucune erreur...' ;
        }
        let contenu = document.getElementById('idErreurList') ;
        contenu.innerHTML = content ;
    });
  }

}

export default ErrorGraphMobile;
