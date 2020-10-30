import nodefony from 'nodefony-client' ;

class ErrorGraph extends nodefony.Service{

  constructor(kernel) {
    super('errorGraph',kernel.container);
  }

  initialize() {
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.portGraph = this.kernel.portGraph ;
    this.networkSeries = this.kernel.networkSeries ;
    this.listenEvents() ;
    this.log("Start") ;
  }

  listenEvents() {
    let select = document.getElementById('errorList') ;
    select.addEventListener('click', (event) => {
              this.listeErreur() ;
    });
  }

  showErreurPort(obj) {
    let idPort = obj.idPort ;
    this.tools.closePopUp()
    this.portGraph.affichageOne(idPort) ;
  }

  listeErreur(){
    this.api.get('/api/error/port')
      .then((r) => {
        let content = '' ;
        for (let i=0; i< r.length; i++) {
          content = content + `<a href='#' onclick="app.eventUserAction({ 'idPort': ${r[i].id_port} },'${this.name}','showErreurPort')">Baie / ${r[i].nom_baie} / ${r[i].description} (${r[i].type}) / Port num : ${r[i].numero_port} (nb liens : ${r[i].nb_link})</a><br>` ;
        }
        if (content === '') {
          content = 'Aucune erreur...' ;
        }
        this.tools.openPopup(content,"Liste des erreurs");
    });
  }

}

export default ErrorGraph;
