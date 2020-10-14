import nodefony from 'nodefony' ;

class PortGraphMobile extends nodefony.Service {

  constructor(kernel) {
    super("portGraphMobile",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.memo = this.kernel.memo ;
    this.swal = this.kernel.swal ;
    this.vis = this.kernel.vis ;
    this.divParcourir = this.kernel.divParcourir ;
    this.log("Start") ;
  }

  affichageOne(idPort){
    this.divParcourir.style.display=(true)?'block':'none';
    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    this.api.get(`/api/port/${idPort}/describe`)
      .then((r) => {
        let node = new this.vis.DataSet() ;
        let edge = new this.vis.DataSet() ;
        let titleValue ;
        let imageValue ;
        let labelValue ;
        let nbLinkNormal ;
        r.forEach((item, i) => {
          if (item.comment !== '' && item.comment !== null) {
            titleValue = `[${item.comment}]` ;
          } else {
            titleValue = '' ;
          }
          if (item.type_obj == 'port') {
            titleValue = `Port${titleValue===''?'':'<HR>'+titleValue}`;
            if (item.equipement_name.includes('Quadrupleur')) {
              imageValue = `/app/images/quadrupleur${item.name}` ;
              labelValue = item.name ;
              titleValue = 'Jack' ;

              if (item.name === '0') {
                nbLinkNormal = 5 ;
              } else {
                nbLinkNormal = 2 ;
              }

            } else {
              imageValue = '/app/images/RJ45'
              labelValue = `Baie : ${item.baie_name}\n${item.equipement_name}\nPort ${item.name}` ;
              nbLinkNormal = 1 ;
            }

            if (item.is_error === 1) {
              imageValue = imageValue + '-error' ;
            } else if (item.up === 0) {
              imageValue = imageValue + '-down' ;
            } else if (item.nb_link >= nbLinkNormal ) {
              imageValue = imageValue + '-connected' ;
            }

            imageValue = imageValue + '.png' ;
          }
          if (item.type_obj == 'user') {
            imageValue = '/app/images/user.png' ;
            labelValue = item.name ;
            titleValue = `User${titleValue===''?'':'<HR>'+titleValue}`;
          }
          if (item.type_obj.includes('link')) {
            let trouve = edge.get({
              filter: function (oneEdge) {
                return (oneEdge.from === item.id_port1 && oneEdge.to === item.id_port2 ) ||
                            (oneEdge.to === item.id_port1 && oneEdge.from === item.id_port2 )
              }
            }) ;
            if (trouve.length === 0) {
              edge.add({from: item.id_port1, to: item.id_port2, title: titleValue, item: item}) ;
            }
          } else {
            node.add({  id: item.id,
                        shape: 'image',
                        image: imageValue,
                        size: 20,
                        label: labelValue,
                        title: titleValue,
                        item: item  }) ;
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
        if (this.kernel.network !== null) {
          this.kernel.network.destroy() ;
          this.kernel.network = null ;
        }
        let divNetwork = document.getElementById("DIV_vis") ;
        this.kernel.network = new this.vis.Network(divNetwork, data, options) ;
        this.kernel.network.kernel = this.kernel ;

        this.kernel.network.on("doubleClick", this.doubleClickEvent) ;
        this.kernel.network.on("click", this.clickEvent) ;

      });
  }

  doubleClickEvent(params) {
    if (params.nodes.length === 0) {
      return ;
    }
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.item.type_obj === "port") {
      this.kernel.equipementGraph.affichageOne(nodeClic.item.id_obj_equipement) ;
    }
    if (nodeClic.item.type_obj === "user") {
      this.kernel.userGraph.affichageOne({ 'idUser': nodeClic.item.id_obj }) ;
    }
  }

  clickEvent(params) {
    let actionZone = document.getElementById("actionPortOne") ;
    if ((params.nodes.length === 0) && (params.edges.length ==  1)) {
      let myEdge = this.body.data.edges.get(params.edges[0]) ;
      this.kernel.portGraph.clickEventEdge(this.body.data,myEdge) ;
      return ;
    }
    if (params.edges.length >=  1 ||
        (params.edges.length === 0 && params.nodes.length === 1)) {
      let myNode = this.body.data.nodes.get(params.nodes[0]) ;
      this.kernel.portGraph.clickEventNode(this.body.data,myNode) ;
      return ;
    }
  }

  clickEventEdge(data, myEdge) {
    let actionZone = document.getElementById("actionPortOne") ;
    let content = '' ;
    let comment ;
    if (myEdge.item.comment !== '' && myEdge.item.comment !== null) {
      comment = myEdge.item.comment ;
    } else {
      comment = `<I>pas de commentaire</I>` ;
    }
    if (myEdge.item.type_obj == 'link') {
      let myNode1 = data.nodes.get(myEdge.item.id_port1) ;
      let myNode2 = data.nodes.get(myEdge.item.id_port2) ;
      content += 'Port ' + myNode1.item.name + ' <-> Port : ' + myNode2.item.name ;
      content += '<HR>' ;
      content += comment ;
      content += `<BR><a href='#'
                          onclick="mobile.eventUserAction({
                            'idPort': ${myEdge.item.id_obj_port1},
                            'idPortSource': ${myEdge.item.id_obj_port2},
                            'comment': '${myEdge.item.comment}' },
                            'portAction','modifyCommentLink')"
                      >Modifier le commentaire</a></br>` ;
      if (!(myNode1.item.equipement_name.includes('Quadrupleur') &&
          myNode2.item.equipement_name.includes('Quadrupleur'))) {
        content += '<HR>'
        content += `<a href='#'
                        onclick="mobile.eventUserAction({
                          'idPort1': ${myEdge.item.id_obj_port1},
                          'idPort2': ${myEdge.item.id_obj_port2} },
                          'portAction','unlinkPort')"
                    >Supprimer la liaison</a>`
      }
    }
    if (myEdge.item.type_obj == 'linkUser') {
      let myUserNode = data.nodes.get(myEdge.item.id_port1) ;
      let myUser = data.nodes.get(myEdge.item.id_port2) ;
      content += myUser.item.name + ' <-> Port : ' + myUserNode.item.name ;
      content += '<HR>' ;
      content += comment ;
      content += `<BR><a href='#'
                          onclick="mobile.eventUserAction({
                            'idPort': ${myEdge.item.id_obj_port1},
                            'idUser': ${myEdge.item.id_obj_port2},
                            'comment': '${myEdge.item.comment}' },
                            'userAction','modifyComment')"
                      >Modifier le commentaire</a></br>` ;
      content += '<HR>'
      content += `<a href='#'
                      onclick="mobile.eventUserAction({
                        'idPort': ${myEdge.item.id_obj_port1} },
                        'userAction','unlinkUserPort')"
                  >Supprimer la liaison</a>`
    }
    actionZone.innerHTML = content ;
  }

  clickEventNode(data, myNode) {
    let actionZone = document.getElementById("actionPortOne") ;
    let content = '' ;
    if (myNode.item.type_obj === 'user') {
      content = myNode.item.name + '<HR>' ;
      content += `<a href='#'
                          onclick="mobile.eventUserAction({
                            'idUser': ${myNode.item.id_obj},
                            'name': '${myNode.item.name}'},
                            'portGraph',
                            'goto_detailUtilisateur')"
                        >Liste des ports</a></br>` ;
    } else {
      content = "Port " + myNode.item.name ;
      content += `<BR><a href='#'
                      onclick="mobile.eventUserAction({
                        'idPort': ${myNode.item.id_obj} },
                        'memo',
                        'setMemoId')"
                      >Mémoriser le port</a>`;
      content += `<BR><a href='#'
                      onclick="mobile.eventUserAction({
                        'idPort': ${myNode.item.id_obj} },
                        'portAction',
                        'linkPort')"
                      >Lier le port</a>` ;
      content += '<HR>' ;
      if (!(myNode.item.equipement_name.includes('Quadrupleur'))) {
        content += `<a href='#'
                            onclick="mobile.eventUserAction({
                              'idPort': ${myNode.item.id_obj}},
                              'portAction',
                              'addQuadrupleur')"
                          >Ajouter un quadrupleur</a><HR>` ;
      }
      if (myNode.item.comment !== '' && myNode.item.comment !== null) {
        content += myNode.item.comment ;
      } else {
        content += `<I>pas de commentaire</I>` ;
      }
      content += `<BR><a href='#'
                          onclick="mobile.eventUserAction({
                            'idPort': ${myNode.item.id_obj},
                            'comment': '${myNode.item.comment}',
                            'refresh' : 'One' },
                            'portAction',
                            'modifyCommentPort')"
                        >Modifier le commentaire</a></br>` ;
      }
    actionZone.innerHTML = content ;
  }

  goto_detailUtilisateur(obj) {
    this.divParcourir.style.display=(false)?'block':'none';
    this.kernel.userGraph.detailUtilisateur(obj) ;
  }

}

export default PortGraphMobile ;
