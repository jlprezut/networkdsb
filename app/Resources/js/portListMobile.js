import nodefony from 'nodefony-client' ;

class PortListMobile extends nodefony.Service{

  constructor(kernel) {
    super('portListMobile',kernel.container);
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

  }

  showPort(obj) {
    let idPort = obj.idPort ;
    this.divErreurs.style.display=(false)?'block':'none';
    this.divParcourir.style.display=(true)?'block':'none';
    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    this.kernel.parcours.affichageOne({ 'typeObj' : 'Port', 'idObj' : idPort }) ;
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divErreurs.style.display=(false)?'block':'none';
  }

  listePort(obj){
    let idEquipement = obj.idEquipement ;
    this.divMainMenu.style.display=(false)?'block':'none';
    this.divParcourir.style.display=(false)?'block':'none';
    this.divErreurs.style.display=(true)?'block':'none';

    this.api.get(`/api/equipement/${idEquipement}/port`)
      .then((r) => {
        let content = ''
        if (r.length > 0) {
            content += `<a href='#' onclick="mobile.eventUserAction({ 'typeObj': 'Equipement', 'idObj': ${r[0].id_equipement} },'parcours','affichageOne')">${r[0].baie_name} / ${r[0].equipement_name}</a></BR></BR>`  ;
        }
        for (let i=0; i< r.length; i++) {
          content += `<a href='#' onclick="mobile.eventUserAction({ 'idPort': ${r[i].id_obj} },'portList','showPort')">Port ${r[i].name} (nb liens : ${r[i].nb_link} --> ${r[i].next_link} [${r[i].nom_user}])</a><br>` ;
        }
        if (content === '') {
          content = 'Aucun port...' ;
        }
        let contenu = document.getElementById('idErreurList') ;
        contenu.innerHTML = content ;
    });
  }

}

export default PortListMobile;
