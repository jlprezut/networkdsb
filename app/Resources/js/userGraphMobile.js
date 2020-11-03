import nodefony from 'nodefony-client' ;

class UserGraphMobile extends nodefony.Service {

  constructor(kernel) {
    super("userGraphMobile",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.memo = this.kernel.memo ;
    this.swal = this.kernel.swal;
    this.vis = this.kernel.vis ;
    this.divUtilisateurs = this.kernel.divUtilisateurs ;
    this.divParcourir = this.kernel.divParcourir ;
    this.divMainMenu = this.kernel.divMainMenu ;
    this.log("Start") ;
    this.listenEvents() ;
  }

  listenEvents() {
    let select = document.getElementById('utilisateursLink') ;
    select.addEventListener('click', (event) => {
      this.listeUtilisateurs() ;
    });

    let imgBack = document.getElementById("backfromUtilisateurs") ;
    imgBack.addEventListener('click', (event) => {
              this.backMenu() ;
    });
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divUtilisateurs.style.display=(false)?'block':'none';
  }

  listeUtilisateurs() {
    this.divMainMenu.style.display=(false)?'block':'none';
    this.divUtilisateurs.style.display=(true)?'block':'none';

    this.api.get('/api/user')
      .then((r) => {
        let content = '' ;
        for (let i=0; i< r.length; i++) {
          content = content + `<a href='#' onclick="mobile.eventUserAction( {'idUser': ${r[i].id_obj}, 'name': '${r[i].name}' },'userGraph','detailUtilisateur')">${r[i].name}</a><br>` ;
        }
        if (content === '') {
          content = 'Aucun utilisateur...' ;
        }
        let contenu = document.getElementById('idUtilisateursList') ;
        contenu.innerHTML = content ;
    });
  }

  detailUtilisateur(obj) {
    this.divMainMenu.style.display=(false)?'block':'none';
    this.divUtilisateurs.style.display=(true)?'block':'none';

    let idUser = obj.idUser ;
    let nameUser = obj.name ;
    this.api.get(`/api/user/${idUser}/inventory`)
      .then((text) => {
        let content = `<HR><a href='#' onclick="mobile.eventUserAction({ 'idUser': ${idUser} }, 'userGraph','affichageOne')">${nameUser}</a><HR>` ;
        let portLink = '' ;
        for (let i=0; i< text.length; i++) {
          if (text[i].niveau === 0) {
            content = content + "<BR>" ;
          } else {
            if (text[i].commentaire_link !==  null) {
              content = content + "--".repeat(text[i].niveau - 1) ;
              content = content + "  " ;
              content = content + text[i].commentaire_link + "<BR>" ;
            }
            content = content + "--".repeat(text[i].niveau - 1) ;
            content = content + "|-" ;
          }
          if (text[i].type === "PreQuadrupleur") {
            content = content + "Quadrupleur" ;
          } else {
            portLink = `<a href="#" onclick="mobile.eventUserAction({ 'idPort': ${text[i].id_port}},'userGraph','affichageDetailPort')">Port ${text[i].numero_port}</a>`
            if (text[i].type === "Quadrupleur") {
              content = content + portLink;
            } else {
              content = content + text[i].nom_baie + " / " + text[i].description ;
              content = content + " (" + text[i].type + ")" ;
              content = content + "  -->  " + portLink ;
              if (text[i].commentaire_port !== null ) {
                content = content + " (" + text[i].commentaire_port + ") " ;
              }
            }
          }
          content = content + "<BR>" ;
        }
        if (content === '') {
          content = 'Aucune arborescence...' ;
        }
        let contenu = document.getElementById('idUtilisateursList') ;
        contenu.innerHTML = content ;
    });
  }

  affichageDetailPort(obj) {
    let idPort = obj.idPort ;
    this.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.portGraph.affichageOne(idPort) ;
  }

  affichageAll(){
    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get('/api/user')
      .then((r) => {
        r.forEach((item, i) => {
          node.add({ id: item.id, shape: 'image', image: `/app/images/user.png`, size: 20,
                       label: item.name, id_obj: item.id_obj, type_obj: item.type_obj }) ;
        }) ;

        let data = { nodes: node, edges: edge } ;
        let options = {
          width: `document.body.clientWidth`,
          height: '400px',

        };
        if (this.kernel.network !== null) {
          this.kernel.network.destroy() ;
          this.kernel.network = null ;
        }
        let divNetwork = document.getElementById("DIV_vis") ;
        this.kernel.network = new this.vis.Network(divNetwork, data, options) ;
        this.kernel.network.kernel = this.kernel ;
        let actionZone = document.getElementById("actionPortOne") ;
        actionZone.innerHTML = '' ;

        this.kernel.network.on("doubleClick", this.doubleClicEventAll) ;
      });
  }

  doubleClicEventAll(params) {
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    this.kernel.userGraph.affichageOne({ 'idUser': nodeClic.id_obj }) ;
  }

  affichageOne(obj){
    this.divUtilisateurs.style.display=(false)?'block':'none';
    this.divParcourir.style.display=(true)?'block':'none';

    let idUser= obj.idUser ;
    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get(`/api/user/${idUser}`)
      .then((r) => {
        node.add({ id: r[0].id, shape: 'image', image: `/app/images/user.png`, size: 20,
                       label: r[0].name, title: 'User', id_obj: r[0].id_obj, type_obj: r[0].type_obj, id_site: r[0].id_site }) ;
        let idObjUser = r[0].id ;

        this.api.get(`/api/user/${idUser}/port`)
          .then((r) => {
            let imageValue ;
            let titleValue ;
            r.forEach((item, i) => {
              if (item.type_acces === 'RJ45') {
                imageValue = '/app/images/RJ45' ;
              } else {
                imageValue = '/app/images/Fibre' ;
              }
              if (item.nb_link > 0 ) {
                imageValue += `-connected`
              }
              if (item.up === 0) {
                imageValue += `-down` ;
              }
              if (item.is_error === 1) {
                imageValue += `-error` ;
              }

              imageValue += '.png' ;

              if (item.nom_user === null) {
                titleValue = '' ;
              } else {
                titleValue = 'Propriétaire : ' + item.nom_user + '<BR>' ;
              }

              if (item.next_link === null) {
                titleValue += 'Empty' ;
              } else {
                titleValue += 'Port connecté à :<BR>' + item.next_link ;
              }

              node.add({ id: item.id, shape: 'image', image: imageValue, size: 20,
                         label: `${item.name}`, title: titleValue, id_obj: item.id_obj, type_obj: item.type_obj }) ;
              edge.add({ from: idObjUser, to: item.id });
            }) ;

            let data = { nodes: node, edges: edge } ;
            let options = {
              width: `document.body.clientWidth`,
              height: '400px',
              layout: {
                hierarchical: {
                  sortMethod: 'directed',
                }
              }
            };
            if (this.kernel.network !== null) {
              this.kernel.network.destroy() ;
              this.kernel.network = null ;
            }
            let divNetwork = document.getElementById("DIV_vis") ;
            this.kernel.network = new this.vis.Network(divNetwork, data, options) ;
            this.kernel.network.kernel = this.kernel ;
            let actionZone = document.getElementById("actionPortOne") ;
            actionZone.innerHTML = '' ;

            this.kernel.network.on("doubleClick", this.doubleClicEventOne) ;
            this.kernel.network.on("click", this.clicEventOne) ;
        });
    });
  }

  doubleClicEventOne(params) {
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "user") {
      this.kernel.userGraph.affichageAll() ;
    }
    if (nodeClic.type_obj === "port") {
        this.kernel.portGraph.affichageOne(nodeClic.id_obj) ;
    }
  }

  clicEventOne(params) {
    let actionZone = document.getElementById("actionPortOne") ;
    let content = '' ;
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "user") {
      content += `<a href='#'
                          onclick="mobile.eventUserAction({
                            'idUser': ${nodeClic.id_obj}},
                            'userAction','linkUserPort')">
                            Lier le port</a>
                            </br>` ;
    }
    if (nodeClic.type_obj === "port") {
      content += `<a href='#'
                          onclick="mobile.eventUserAction({
                            'idPort': ${nodeClic.id_obj}},
                            'userAction','unlinkUserPort')">
                            Délier le port</a>
                            </br>` ;
    }
    actionZone.innerHTML = content ;
  }

  linkEventOne(event) {

  }

}

export default UserGraphMobile;
