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

    this.kernel.divParcourir.style.display=(true)?'block':'none';

    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    if (this.kernel.network !== null) {
      this.kernel.network.destroy() ;
      this.kernel.network = null ;
    }

    this.api.get(`/api/parcours/${typeObj}/${idObj}`)
      .then((r) => {
        let node = new this.vis.DataSet() ;
        let edge = new this.vis.DataSet() ;
        let titleValue ;
        let imageValue ;
        let labelValue ;
        let nbLinkNormal ;
        let tmpTitle ;

        this.kernel.nodeFocus = '' ;

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
              edge.add({id: (item.type_obj + "-" + item.id_obj), from: (item.extraDonnees[0].type_id_from + "-" + item.extraDonnees[0].id_from), to: (item.extraDonnees[0].type_id_to + "-" + item.extraDonnees[0].id_to), title: titleValue, item: item}) ;
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

              edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item}) ;
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

              edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item}) ;
            }

            if (item.type_obj.includes('Baie')) {
              imageValue = '/app/images/baie.png' ;
              labelValue = item.extraDonnees[0].libelle ;
              if (item.extraDonnees[0].visible === 1) {
                titleValue = `Baie Virtuelle : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;
              } else {
                titleValue = `Baie : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;
              }
              edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item}) ;
            }

            if (item.type_obj.includes('Equipement')) {
              imageValue = `/app/images/${item.extraDonnees[0].type}.png` ;
              labelValue = item.extraDonnees[0].libelle ;
              titleValue = `${item.extraDonnees[0].type} : ${item.extraDonnees[0].libelle}<HR>${titleValue}`;

              edge.add({id: (item.type_obj + "-" + item.id_obj + '/' + item.type_obj_parent + "-" + item.id_obj_parent), from: item.type_obj + "-" + item.id_obj, to: item.type_obj_parent + "-" + item.id_obj_parent, item: item}) ;
            }

            if (item.type_obj === obj.typeObj && parseFloat(item.id_obj) === parseFloat(obj.idObj) )  {
              this.kernel.ariane.addLink({ 'class': 'parcours', 'methode': 'affichageOne', 'obj': obj, 'libelle': labelValue, 'tooltip': titleValue }) ;
              this.kernel.nodeFocus = item.type_obj + "-" + item.id_obj ;
              item.mainNode = true ;
            } else{
              item.mainNode = false ;
            }

            node.add({  id: item.type_obj + "-" + item.id_obj,
                        shape: 'image',
                        image: imageValue,
                        size: 15,
                        label: labelValue,
                        title: titleValue,
                        item: item
                      }) ;

          }

        })

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
        this.kernel.network = new this.vis.Network(divNetwork, data, options) ;
        this.kernel.network.kernel = this.kernel ;

        this.kernel.network.on("doubleClick", this.doubleClickEvent) ;
        this.kernel.network.on("click", this.clickEvent) ;
        this.kernel.network.once("afterDrawing", this.afterDrawingEvent) ;

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

    let actionZone = document.getElementById("actionPortOne") ;
    let content = '' ;
    actionZone.innerHTML = content ;

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
        if (this.kernel.modifAutoriser()) {
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
      if (this.kernel.modifAutoriser()) {
        content += `<span class='SpanLink'
                        onclick="mobile.eventUserAction({
                          'idPort': ${myEdge.item.extraDonnees[0].id_from} },
                          'userAction','unlinkUserPort')"
                    >Supprimer la liaison</span>`
      }
    }

    if (myEdge.item.type_obj == 'Link' || myEdge.item.type_obj == 'LinkUser') {
      content += '<HR>' ;
      myEdge.item.metaDonnees.forEach((itemMeta,j) => {
        if (this.kernel.modifAutoriser()) {
          content += `<span class='SpanLink'
                            onclick="mobile.eventUserAction({
                              'type_obj': '${myEdge.item.type_obj}',
                              'id_obj': ${myEdge.item.id_obj},
                              'id_meta': ${itemMeta.id_meta},
                              'libelle_meta': '${itemMeta.libelle_meta}' ,
                              'valeur': '${itemMeta.valeur}'},
                              'metaDonnees','modifyDonnees')">
                              ${itemMeta.libelle_meta}</span> : ${itemMeta.valeur}
                              </BR>` ;
        } else {
          content += `${itemMeta.libelle_meta} : ${itemMeta.valeur}</BR>` ;
        }
      }) ;
      if (this.kernel.modifAutoriser()) {
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

    this.kernel.network.focus(myNode.id,{'locked': true, 'animation': true}) ;

    if (myNode.item.type_obj === 'User') {
      content = 'User : ' + myNode.item.extraDonnees[0].libelle + '<HR>' ;
      content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idUser': ${myNode.item.id_obj},
                            'name': '${myNode.item.extraDonnees[0].libelle}'},
                            'userAction',
                            'detailUtilisateur')"
                        >Liste des ports</span></BR>` ;
      if (this.kernel.modifAutoriser()) {
        content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idUser': ${myNode.item.id_obj}},
                            'userAction','linkUserPort')">
                            Lier le port</span>
                            </BR>` ;
      }
    }
    if (myNode.item.type_obj === 'Site') {
      content = "Site : " + myNode.item.extraDonnees[0].libelle ;
    }
    if (myNode.item.type_obj === 'Salle') {
      content = "Salle : " + myNode.item.extraDonnees[0].libelle ;
    }
    if (myNode.item.type_obj === 'Baie') {
      content = "Baie : " + myNode.item.extraDonnees[0].libelle ;
    }
    if (myNode.item.type_obj === 'Equipement') {
      content = "Equipement : " + myNode.item.extraDonnees[0].libelle ;
      content += '<HR>' ;
      content += `<span class='SpanLink'
                          onclick="mobile.eventUserAction({
                            'idEquipement': '${myNode.item.id_obj}',
                            'name': '${myNode.item.extraDonnees[0].libelle}' },
                            'portList','listePort')"
                      >Liste des ports</span></BR>` ;
    }
    if (myNode.item.type_obj === 'Port') {
      content = "Port : " + myNode.item.extraDonnees[0].libelle ;
      content += '<HR>' ;
      if (this.kernel.modifAutoriser()) {
        content += `<span class='SpanLink'
                        onclick="mobile.eventUserAction({
                          'idPort': ${myNode.item.id_obj} },
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
        if (this.kernel.modifAutoriser()) {
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
      if (this.kernel.modifAutoriser()) {
        content += `<span class='SpanLink'
                            onclick="mobile.eventUserAction({
                              'type_obj': '${myNode.item.type_obj}',
                              'id_obj': ${myNode.item.id_obj},
                              'id_meta': ${itemMeta.id_meta},
                              'libelle_meta': '${itemMeta.libelle_meta}' ,
                              'valeur': '${itemMeta.valeur}'},
                              'metaDonnees','modifyDonnees')">
                              ${itemMeta.libelle_meta}</span> : ${itemMeta.valeur}
                              </BR>` ;
      } else {
        content += `${itemMeta.libelle_meta} : ${itemMeta.valeur}</BR>` ;
      }
    }) ;
    if (this.kernel.modifAutoriser()) {
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
