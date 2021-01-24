import nodefony from 'nodefony-client' ;
import Table from './table.js' ;

class BaieListing extends nodefony.Service {

  constructor(kernel) {
    super("baieListing",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.log("Start") ;
    this.listenEvents() ;
  }

  listenEvents() {
  }

  listing(obj){
    let typeObj = obj.typeObj ;
    let idObj = obj.idObj ;
    let name = obj.name ;

    this.kernel.ariane.addLink({ 'class': 'baieListing', 'methode': 'listing', 'obj': { 'obj':obj, idObj:idObj, typeObj:'ListingBaie' }, 'libelle': 'Liste équipements', 'tooltip': name }) ;

    document.getElementById("TableJS").innerHTML = '' ;
    document.getElementById('idErreurList').innerHTML = '' ;

    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divParcourir.style.display=(false)?'block':'none';
    this.kernel.divSearch.style.display=(false)?'block':'none';
    this.kernel.divVue2D.style.display=(false)?'block':'none';

    this.kernel.divErreurs.style.display=(true)?'block':'none';

    var t = this ;

    let tableJS = document.getElementById("TableJS") ;
    let titre = document.createElement("span");
    titre.innerHTML = `${name} <span class='SpanLink' onclick="mobile.eventUserAction( {'idObj': ${idObj}, 'typeObj': '${typeObj}' },'parcours','affichageOne')">(Vue Graphique)</span><br>`
    tableJS.appendChild(titre) ;

    this.api.get(`/api/parcours/${typeObj}/${idObj}`)
      .then((listEquipement) => {

        var listFonctionsDefered=[];
        var nameEquipement=[] ;
        var nbportEquipement=[] ;
        var idEquipement=[] ;
        var pos = 0 ;

        listEquipement.forEach((item, i) => {
          if (item.type_obj === 'Equipement') {
            nameEquipement[pos] = item.extraDonnees[0].libelle  ;
            nbportEquipement[pos] = item.extraDonnees[0].nb_port_par_ligne  ;
            idEquipement[pos] = item.id_obj ;
            listFonctionsDefered[pos]=(t.api.get(`/api/equipement/${item.id_obj}/listing`)
                .then((reponse) => {
                    return reponse ;
                  })) ;
            pos += 1 ;
          }
        });

        //this.api.get(`/api/parcours/${typeObj}/${idObj}`)
        //  .then((r) => {
        return Promise.all(listFonctionsDefered)
          .then(function(listResultats){

            var entete ;
            var ligne ;
            var myoptions ;
            var table ;
            var titre ;
            var portParLigne ;

            listResultats.forEach((resultats, i) => {
              titre = document.createElement("span");
              titre.innerHTML = "<BR><BR>" + `${nameEquipement[i]} <span class='SpanLink' onclick="mobile.eventUserAction( {'idEquipement': ${idEquipement[i]}, 'name': '${nameEquipement[i]}' },'portList','listePort')">(Vue liste)</span> / <span class='SpanLink'  onclick="mobile.eventUserAction({ 'typeObj': 'Equipement', 'idObj': ${idEquipement[i]} }, 'parcours','affichageOne')">(Vue Graphique)</span><br>` + "<BR>" ;
              tableJS.appendChild(titre) ;
              entete = [] ;
              ligne = -1 ;
              portParLigne = nbportEquipement[i] ;

              resultats.forEach((item, i) => {

                if ( i%portParLigne === 0) {
                  entete.push({}) ;
                  entete.push({}) ;
                  ligne += 2 ;
                }
                entete[ligne-1][i%portParLigne] = { 'value': item.Port, 'informations': item.Informations } ;

                var valueItem = 'up'
                var valueLink = ''
                if (item.Up === 0) {
                  valueItem = 'd' ;
                  valueLink = null ;
                } else {
                  if ( item.Error === 1 ) {
                    valueItem = 'e' ;
                  }
                  if ( item.Link === null) {
                    valueLink = null ;
                  } else {
                    valueLink = item.Link.replaceAll(" || ","<HR>") ;
                  }
                }

                entete[ligne][i%portParLigne] = { 'value': valueItem, 'type': item.Type, 'link': valueLink, 'id_obj': item.id_obj } ;

              });

              myoptions = {
                  element: document.getElementById("TableJS"),
                  data: entete,
                  noHeaders: true,
                  empty: " "
              };

              table = new Table(myoptions);

              table.view();
            }) ;
        }) ;
    }) ;

  }

}

export default BaieListing;
