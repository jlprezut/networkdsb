import nodefony from 'nodefony-client' ;

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

    if (this.kernel.modifAutoriser()) {
      let select = document.getElementById('errorLink') ;
      select.addEventListener('click', (event) => {
                this.listeErreur({'typeObj': 'ListeErreur', 'idObj': '0'}) ;
      });

      let imgBack = document.getElementById("backfromErreur") ;
      imgBack.addEventListener('click', (event) => {
                this.backMenu() ;
      });
    } else {
      let DIV_button_Erreur = document.getElementById('DIV_button_Erreur') ;
      DIV_button_Erreur.style.display=(false)?'block':'none';
    }
  }

  showErreurPort(obj) {
    let idPort = obj.idPort ;
    this.kernel.parcours.affichageOne({ 'typeObj': 'Port', 'idObj': idPort }) ;
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divErreurs.style.display=(false)?'block':'none';
  }

  listeErreur(obj){
    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divParcourir.style.display=(false)?'block':'none';
    this.kernel.divSearch.style.display=(false)?'block':'none';

    this.kernel.divErreurs.style.display=(true)?'block':'none';


    this.kernel.ariane.addLink({ 'class': 'errorGraph', 'methode': 'listeErreur', 'obj': { 'typeObj': 'ListeErreur', 'idObj': '0' }, 'libelle': 'Liste erreurs', 'tooltip': '' }) ;

    this.api.get('/api/error/port')
      .then((r) => {
        let content = '' ;
        for (let i=0; i< r.length; i++) {
          content = content + `<span class='SpanLink' onclick="mobile.eventUserAction({ 'idPort': ${r[i].id_port} },'errorGraph','showErreurPort')">Baie / ${r[i].nom_baie} / ${r[i].description} (${r[i].type}) / Port num : ${r[i].numero_port} (nb liens : ${r[i].nb_link})</span><br>` ;
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
