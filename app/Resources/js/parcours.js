import nodefony from 'nodefony-client' ;

class Parcours extends nodefony.Service {

  constructor(kernel) {
    super("parcours",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.memo = this.kernel.memo ;
    this.swal = this.kernel.swal ;
    this.vis = this.kernel.vis ;
    this.divParcourir = this.kernel.divParcourir ;
    this.divMainMenu = this.kernel.divMainMenu ;
    this.divUtilisateurs = this.kernel.divUtilisateurs ;
    this.log("Start") ;
    this.listenEvents() ;
  }

  listenEvents() {
    let select = document.getElementById('parcourirLink') ;
    select.addEventListener('click', (event) => {
      this.kernel.parcours.affichageOne({ 'typeObj' : 'null', 'idObj' : 'null' } ) ;
    });

    let imgBack = document.getElementById("DIV_Parcourir_Back") ;
    imgBack.addEventListener('click', (event) => {
              this.backMenu() ;
    });
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divParcourir.style.display=(false)?'block':'none';
  }

  affichageOne(obj){
    let typeObj = obj.typeObj ;
    let idObj = obj.idObj ;

    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divErreurs.style.display=(false)?'block':'none';
    this.kernel.divSearch.style.display=(false)?'block':'none';
    this.kernel.divVue2D.style.display=(false)?'block':'none';

    this.kernel.divParcourir.style.display=(true)?'block':'none';

    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    if (this.kernel.network !== null) {
      this.kernel.network.destroy() ;
      this.kernel.network = null ;
    }

    var listFonctionsDefered=[];
    var t = this ;
    listFonctionsDefered[0]=(this.api.get(`/api/parcours/${typeObj}/${idObj}`)
          .then((reponse) => {
              return reponse ;
            })) ;
    this.memo.memoTab.forEach((item, i) => {
      listFonctionsDefered[i+1]=(this.api.get(`/api/parcours/${item.type_obj}/${item.id_obj}`)
            .then((reponse) => {
                return reponse ;
              })) ;
    });

    //this.api.get(`/api/parcours/${typeObj}/${idObj}`)
    //  .then((r) => {
    return Promise.all(listFonctionsDefered)
      .then(function(listResultats){
        let node = new t.vis.DataSet() ;
        let edge = new t.vis.DataSet() ;
        let titleValue ;
        let imageValue ;
        let labelValue ;
        let nbLinkNormal ;
        let tmpTitle ;

        t.kernel.nodeFocus = '' ;
        listResultats.forEach((r, j) => {

        r.forEach((item, i) => {
          titleValue = '' ;
          item.metaDonnees.forEach((itemMeta,j) => {
            titleValue += itemMeta.libelle_meta + " : " + itemMeta.valeur + "</BR>";
          }) ;

          if (item.type_obj.includes('Link')) {
            let trouve = edge.get({
              filter: function (oneEdge) {
                return (oneEdge.from === item.extraDonnees[0].id_from && oneEdge.to === item.extraDonnees[0].id_to ) ||
                            (oneEdge.from === item.extraDonnees[0].id_to && oneEdge.to === item.extraDonnees[0].id_from )
              }
            }) ;
            if (trouve.length === 0) {
              if (edge.get(item.type_obj + "-" + item.id_obj) === null) {
                let dashes = false ;
                let color = "blue"
                if (item.type_obj.includes('User')) {
                  dashes = [2, 10, 2, 10] ;
                  color = "red"
                }
                edge.add({id: (item.type_obj + "-" + item.id_obj), from: (item.extraDonnees[0].type_id_from + "-" + item.extraDonnees[0].id_from), to: (item.extraDonnees[0].type_id_to + "-" + item.extraDonnees[0].id_to), title: titleValue, item: item, dashes: dashes, color: { color: color }}) ;
              }
            }
          } else {
            if (item.type_obj == 'Port') {
              tmpTitle = `Port : ${item.extraDonnees[0].libelle}` ;
              if (item.extraDonnees[0].id_user !== null) {
                tmpTitle += ` (Attribué à ${item.extraDonnees[0].nom_user})` ;
              }
              tmpTitle += `</BR>Baie : ${item.extraDonnees[0].baie_libelle}</BR>${item.extraDonnees[0].equipement_type} : ${item.extraDonnees[0].equipement_libelle}` ;
              titleValue = `${tmpTitle}<HR>${titleValue}`;
              if (item.extraDonnees[0].equipement_type.includes('Quadrupleur')) {
                imageValue = `/app/images/quadrupleur${item.extraDonnees[0].libelle}` ;
                labelValue = item.extraDonnees[0].libelle ;
                titleValue = 'Jack' ;

                if (item.extraDonnees[0].libelle === '0') {
                  nbLinkNormal = 5 ;
                } else {
                  nbLinkNormal = 2 ;
                }

              } else {
                if (item.extraDonnees[0].type_acces === 'RJ45') {
                  imageValue = '/app/images/RJ45' ;
                } else {
                  imageValue = '/app/images/Fibre' ;
                }
                labelValue = `Port ${item.extraDonnees[0].libelle}` ;
                nbLinkNormal = 1 ;
              }

              if (item.extraDonnees[0].is_error === 1) {
                imageValue = imageValue + '-error' ;
              } else if (item.extraDonnees[0].up === 0) {
                imageValue = imageValue + '-down' ;
              } else if (item.extraDonnees[0].nb_link >= nbLinkNormal ) {
                imageValue = imageValue + '-connected' ;
              }

              imageValue = imageValue + '.png' ;

              if (edge.get(item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent) === null) {
                edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item, dashes : [5, 5], color: { color: "black" }}) ;
              }
            }


            if (item.type_obj == 'User') {
              imageValue = '/app/images/user.png' ;
              labelValue = item.extraDonnees[0].libelle ;
              titleValue = `User : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;
            }

            if (item.type_obj.includes('Site')) {
              imageValue = '/app/images/site.png' ;
              labelValue = item.extraDonnees[0].libelle ;
              titleValue = `Site : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;
            }

            if (item.type_obj.includes('Salle')) {
              imageValue = '/app/images/salle.png' ;
              labelValue = item.extraDonnees[0].libelle ;
              titleValue = `Salle : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;

              if (edge.get(item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent) === null) {
                edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item, dashes: [15, 15], color: { color: "black" }}) ;
              }
            }

            if (item.type_obj.includes('Baie')) {
              imageValue = '/app/images/baie.png' ;
              labelValue = item.extraDonnees[0].libelle ;
              if (item.extraDonnees[0].visible === 1) {
                titleValue = `Baie Virtuelle : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;
              } else {
                titleValue = `Baie : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;
              }

              if (edge.get(item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent) === null) {
                edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item, dashes: [15, 15], color: { color: "black" }}) ;
              }
            }

            if (item.type_obj.includes('Equipement')) {
              imageValue = `/app/images/${item.extraDonnees[0].type}.png` ;
              labelValue = item.extraDonnees[0].libelle ;
              titleValue = `${item.extraDonnees[0].type} : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;

              if (edge.get(item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent) === null) {
                edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item, dashes: [15, 15], color: { color: "black" }}) ;
              }
            }

            if (item.type_obj === obj.typeObj && parseFloat(item.id_obj) === parseFloat(obj.idObj) )  {
              t.kernel.ariane.addLink({ 'class': 'parcours', 'methode': 'affichageOne', 'obj': { 'obj': obj, 'idObj': obj.idObj, 'typeObj': obj.typeObj }, 'libelle': labelValue, 'tooltip': titleValue }) ;
              t.kernel.nodeFocus = item.type_obj + "-" + item.id_obj ;
              item.mainNode = true ;
            } else{
              item.mainNode = false ;
            }

            if (node.get(item.type_obj + "-" + item.id_obj) === null)
            {
              node.add({  id: item.type_obj + "-" + item.id_obj,
                        shape: 'image',
                        image: imageValue,
                        size: 15,
                        label: labelValue,
                        title: titleValue,
                        item: item
                      }) ;
            }
          }

        })
    });
        let data = { nodes: node, edges: edge } ;
        let options = {
          width: `document.body.clientWidth`,
          height: '400px',
          interaction : {
            hover: true,
            tooltipDelay: 100,
          },
        };

        let divNetwork = document.getElementById("DIV_vis") ;
        t.kernel.network = new t.vis.Network(divNetwork, data, options) ;
        t.kernel.network.kernel = t.kernel ;

        t.memo.highlightNode() ;

        t.kernel.network.on("doubleClick", t.doubleClickEvent) ;
        t.kernel.network.on("click", t.clickEvent) ;
        t.kernel.network.once("afterDrawing", t.afterDrawingEvent) ;

    });
  }

  afterDrawingEvent(params) {
    if (this.kernel.nodeFocus !== '') {
      let tab = []
      tab.push(this.kernel.nodeFocus)
      this.selectNodes(tab,true);
      this.kernel.parcours.clickEventNode(this.body.data,this.body.data.nodes.get(this.kernel.nodeFocus));
    }
  }

  doubleClickEvent(params) {
    if (params.nodes.length === 0) {
      return ;
    }
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;

    if (nodeClic.item.mainNode) {
      this.kernel.parcours.affichageOne({ 'typeObj' : nodeClic.item.type_obj_parent, 'idObj' : nodeClic.item.id_obj_parent }) ;
    } else {
      this.kernel.parcours.affichageOne({ 'typeObj' : nodeClic.item.type_obj,'idObj' : nodeClic.item.id_obj }) ;
    }
  }

  clickEvent(params) {

    if ((params.nodes.length === 0) && (params.edges.length ==  1)) {
      let myEdge = this.body.data.edges.get(params.edges[0]) ;
      this.kernel.parcours.clickEventEdge(this.body.data,myEdge) ;
      return ;
    }
    if (params.edges.length >=  1 ||
        (params.edges.length === 0 && params.nodes.length === 1)) {
      let myNode = this.body.data.nodes.get(params.nodes[0]) ;
      this.kernel.parcours.clickEventNode(this.body.data,myNode) ;
      return ;
    }
    this.kernel.parcours.unlockAllLink() ;
  }

  unlockAllLink() {
    let content = '' ;
    if (this.kernel.memo.countMemoTab() > 0 ) {
      content = `<span class='SpanLink'
                    onclick="mobile.eventUserAction({ },
                      'memo',
                      'freeMemoTab')"
                    >Unlock ALL</span>`;
    }
    document.getElementById("actionPortOne").innerHTML = content ;
  }

  clickEventEdge(data, myEdge) {
    let actionZone = document.getElementById("actionPortOne") ;
    let content = '' ;

    if (myEdge.item.type_obj == 'Link') {
      let myNode1 = data.nodes.get(myEdge.item.extraDonnees[0].type_id_from + "-" + myEdge.item.extraDonnees[0].id_from) ;
      let myNode2 = data.nodes.get(myEdge.item.extraDonnees[0].type_id_to + "-" + myEdge.item.extraDonnees[0].id_to) ;
      content += 'Port ' + myNode1.item.extraDonnees[0].libelle + ' <-> ' + 'Port ' + myNode2.item.extraDonnees[0].libelle ;
      content += '<HR>' ;

      if (!(myNode1.item.extraDonnees[0].equipement_libelle.includes('Quadrupleur') &&
          myNode2.item.extraDonnees[0].equipement_libelle.includes('Quadrupleur'))) {
        if (this.kernel.isAdmin()) {
          content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idPort1': ${myEdge.item.extraDonnees[0].id_from},
                            'idPort2': ${myEdge.item.extraDonnees[0].id_to} },
                            'portAction','unlinkPort')"
                      >Supprimer la liaison</span>`
        }
      }
    }
    if (myEdge.item.type_obj == 'LinkUser') {
      let myNode = data.nodes.get(myEdge.item.extraDonnees[0].type_id_from + "-" + myEdge.item.extraDonnees[0].id_from) ;
      let myUser = data.nodes.get(myEdge.item.extraDonnees[0].type_id_to + "-" + myEdge.item.extraDonnees[0].id_to) ;
      content += 'User : ' + myUser.item.extraDonnees[0].libelle + ' <-> Port : ' + myNode.item.extraDonnees[0].libelle ;
      content += '<HR>' ;
      if (this.kernel.isAdmin()) {
        content += `<span class='SpanLink'
                        onclick="mobile.eventUserAction({
                          'idPort': ${myEdge.item.extraDonnees[0].id_from} },
                          'userAction','unlinkUserPort')"
                    >Supprimer la liaison</span>`
      }
    }

    if (myEdge.item.type_obj === 'Link' || myEdge.item.type_obj === 'LinkUser') {
      content += '<HR>' ;
      myEdge.item.metaDonnees.forEach((itemMeta,j) => {
        if (this.kernel.isAdmin() || itemMeta.id_user === this.kernel.user.id_user) {
          content += `<span class='SpanLink'
                            onclick="mobile.eventUserAction({
                              'type_obj': '${myEdge.item.type_obj}',
                              'id_obj': ${myEdge.item.id_obj},
                              'id_user': ${itemMeta.id_user},
                              'id_meta': ${itemMeta.id_meta},
                              'libelle_meta': '${itemMeta.libelle_meta}' ,
                              'valeur': '${itemMeta.valeur}'},
                              'metaDonnees','modifyDonnees')">
                              ${itemMeta.libelle_meta}</span>` ;
          content += `<span class='A_tooltip'>&nbsp;<img class='infoImg'><span>${itemMeta.nom_user}</span></span>` ;
          content += ` : ${itemMeta.valeur}
                              </BR>` ;
        } else {
          content += `${itemMeta.libelle_meta}` ;
          content += `<span class='A_tooltip'>&nbsp;<img class='infoImg'><span>${itemMeta.nom_user}</span></span>` ;
          content += ` : ${itemMeta.valeur}</BR>` ;
        }
      }) ;
      if (this.kernel.ajoutDonneesAutoriser()) {
        content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'type_obj': '${myEdge.item.type_obj}',
                            'id_obj': ${myEdge.item.id_obj}},
                            'metaDonnees','addDonnees')">
                            Ajouter une donnée</span>
                            </BR>` ;
      }
    }

    actionZone.innerHTML = content ;
  }

  clickEventNode(data, myNode) {
    let actionZone = document.getElementById("actionPortOne") ;
    let content = '' ;
    let lockUnlock = '' ;

    this.kernel.network.focus(myNode.id,{'locked': true, 'animation': true}) ;

    if (this.kernel.memo.findMemoTab({ 'type_obj': myNode.item.type_obj, 'id_obj': myNode.item.id_obj }) === -1) {
      lockUnlock += `&nbsp;(<span class='SpanLink'
                      onclick="mobile.eventUserAction({
                        'type_obj': '${myNode.item.type_obj}',
                        'id_obj': ${myNode.item.id_obj} },
                        'memo',
                        'addMemoTab')"
                      >Lock</span>)`;
    } else {
      lockUnlock += `&nbsp;(<span class='SpanLink'
                    onclick="mobile.eventUserAction({
                      'type_obj': '${myNode.item.type_obj}',
                      'id_obj': ${myNode.item.id_obj} },
                      'memo',
                      'delMemoTab')"
                    >Unlock</span>)`;
    }

    if (myNode.item.type_obj === 'User') {
      content += 'User ' ;
      content += `(<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idUser': ${myNode.item.id_obj},
                            'name': '${myNode.item.extraDonnees[0].libelle}'},
                            'userAction',
                            'detailUtilisateur')"
                        >Vue Liste</span>` ;
      if (myNode.item.extraDonnees[0].vue2D === 1) {
        content += ` / <span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idObj': ${myNode.item.id_obj},
                            'typeObj' : '${myNode.item.type_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}'},
                            'vue2D',
                            'affichage')"
                        >Vue 2D</span>` ;
      }
      content += ')' ;
      content += ' : ' + myNode.item.extraDonnees[0].libelle + lockUnlock + '<HR>' ;
      if (this.kernel.isAdmin()) {
        content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idUser': ${myNode.item.id_obj}},
                            'userAction','linkUserPort')">
                            Lier le port</span>
                            </BR>` ;
      }
    }
    if (myNode.item.type_obj === 'Site') {
      content += "Site : " + myNode.item.extraDonnees[0].libelle + lockUnlock ;
    }
    if (myNode.item.type_obj === 'Salle') {
      content += "Salle : " + myNode.item.extraDonnees[0].libelle + lockUnlock ;
    }
    if (myNode.item.type_obj === 'Baie') {
      content += "Baie : " ;
      content += `(<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idObj': '${myNode.item.id_obj}',
                            'typeObj': '${myNode.item.type_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}' },
                            'baieListing','listing')"
                      >Vue Liste</span>` ;
      if (myNode.item.extraDonnees[0].vue2D === 1) {
        content += ` / <span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idObj': ${myNode.item.id_obj},
                            'typeObj' : '${myNode.item.type_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}'},
                            'vue2D',
                            'affichage')"
                        >Vue 2D</span>` ;
      }
      content += ')' ;
      content += " : " +  myNode.item.extraDonnees[0].libelle + lockUnlock ;
      content += "<HR>";
    }
    if (myNode.item.type_obj === 'Equipement') {
      content += "Equipement " ;
      content += `(<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idEquipement': '${myNode.item.id_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}' },
                            'portList','listePort')"
                      >Vue Liste</span>` ;
      if (myNode.item.extraDonnees[0].vue2D === 1) {
        content += ` / <span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idObj': ${myNode.item.id_obj},
                            'typeObj' : '${myNode.item.type_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}'},
                            'vue2D',
                            'affichage')"
                        >Vue 2D</span>` ;
      }
      content += ')' ;
      content += " : " + myNode.item.extraDonnees[0].libelle + lockUnlock + "<HR>" ;
    }
    if (myNode.item.type_obj === 'Port') {
      content += "Port " ;
      if (myNode.item.extraDonnees[0].vue2D === 1) {
        content += `(<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idObj': ${myNode.item.id_obj},
                            'typeObj' : '${myNode.item.type_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}'},
                            'vue2D',
                            'affichage')"
                        >Vue 2D</span>)` ;
      }
      content += " : " + myNode.item.extraDonnees[0].libelle + lockUnlock ;
      content += '<HR>' ;
      if (this.kernel.isAdmin()) {
        content += `<span class='SpanLink'
                        onclick="mobile.eventUserAction({
                          'type_obj': '${myNode.item.type_obj}',
                          'id_obj': ${myNode.item.id_obj} },
                          'memo',
                          'setMemoId')"
                        >Mémoriser le port</span></BR>`;
        content += `<span class='SpanLink'
                        onclick="mobile.eventUserAction({
                          'idPort': ${myNode.item.id_obj} },
                          'portAction',
                          'linkPort')"
                        >Lier le port</span></BR>` ;
      }
      if (!(myNode.item.extraDonnees[0].equipement_libelle.includes('Quadrupleur'))) {
        if (this.kernel.isAdmin()) {
          content += `<span class='SpanLink'
                              onclick="mobile.eventUserAction({
                                'idPort': ${myNode.item.id_obj}},
                                'portAction',
                                'addQuadrupleur')"
                            >Ajouter un quadrupleur</span>` ;
        }
      }
    }

    content += '<HR>' ;
    myNode.item.metaDonnees.forEach((itemMeta,j) => {
      if (this.kernel.isAdmin() || itemMeta.id_user === this.kernel.user.id_user) {
        content += `<span class='SpanLink'
                            onclick="mobile.eventUserAction({
                              'type_obj': '${myNode.item.type_obj}',
                              'id_obj': ${myNode.item.id_obj},
                              'id_user': ${itemMeta.id_user},
                              'id_meta': ${itemMeta.id_meta},
                              'libelle_meta': '${itemMeta.libelle_meta}' ,
                              'valeur': '${itemMeta.valeur}'},
                              'metaDonnees','modifyDonnees')">
                              ${itemMeta.libelle_meta}</span>` ;
        content += `<span class='A_tooltip'>&nbsp;<img class='infoImg'><span>${itemMeta.nom_user}</span></span>` ;
        content += ` : ${itemMeta.valeur}
                              </BR>` ;
      } else {
        content += `${itemMeta.libelle_meta}`
        content += `<span class='A_tooltip'>&nbsp;<img class='infoImg'><span>${itemMeta.nom_user}</span></span>` ;
        content += ` : ${itemMeta.valeur}</BR>` ;
      }
    }) ;
    if (this.kernel.ajoutDonneesAutoriser()) {
      content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'type_obj': '${myNode.item.type_obj}',
                            'id_obj': ${myNode.item.id_obj}},
                            'metaDonnees','addDonnees')">
                            Ajouter une donnée</span>
                            </BR>` ;
    }

    actionZone.innerHTML = content ;
  }

}

export default Parcours ;
