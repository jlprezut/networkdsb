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
    this.kernel.parcours.affichageOne({ 'typeObj' : 'Port', 'idObj' : idPort }) ;
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divErreurs.style.display=(false)?'block':'none';
  }

  listePort(obj){
    let idEquipement = obj.idEquipement ;
    let nameEquipement = obj.name ;

    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divParcourir.style.display=(false)?'block':'none';
    this.kernel.divSearch.style.display=(false)?'block':'none';

    this.kernel.divErreurs.style.display=(true)?'block':'none';

    this.kernel.ariane.addLink({ 'class': 'portList', 'methode': 'listePort', 'obj': { 'typeObj': 'ListePortEquipement', 'idObj': idEquipement, 'idEquipement': idEquipement, 'name': nameEquipement }, 'libelle': 'Liste ports', 'tooltip': nameEquipement }) ;

    this.api.get(`/api/equipement/${idEquipement}/port`)
      .then((r) => {
        let content = '' ;
        let tooltip = '' ;
        if (r.length > 0) {
            content += `<a href='#' onclick="mobile.eventUserAction({ 'typeObj': 'Equipement', 'idObj': ${r[0].id_equipement} },'parcours','affichageOne')">${r[0].baie_name} / ${r[0].equipement_name}</a></BR></BR>`  ;
        }
        for (let i=0; i< r.length; i++) {
          content += `<a href='#' onclick="mobile.eventUserAction({ 'idPort': ${r[i].id_obj} },'portList','showPort')">Port ${r[i].name}`;
          if (r[i].nom_user !== null) {
            content += ` [${r[i].nom_user}]` ;
          }
          if (r[i].nb_link > 0) {
            content += ` (nb liens : ${r[i].nb_link} --> ${r[i].next_link})` ;
          }
          content += `</a>` ;
          tooltip = '' ;
          r[i].metaDonnees.forEach((itemMeta,j) => {
            tooltip += itemMeta.libelle_meta + " : " + itemMeta.valeur + "</BR>";
          }) ;
          if (tooltip !== '') {
            content += `<span href='#' class='A_tooltip'>&nbsp;<img class='infoImg'><span>${tooltip}</span></span>` ;
          }

          content += `<br>` ;
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
