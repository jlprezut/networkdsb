import nodefony from 'nodefony-client' ;

class EquipementGraphMobile extends nodefony.Service {

  constructor(kernel) {
    super("equipementGraphMobile",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.vis = this.kernel.vis ;
    this.baieGraph = this.kernel.baieGraph ;
    this.portGraph = this.kernel.portGraph ;
    this.log("Start") ;
  }

  affichageOne(idEquipement){
    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get(`/api/equipement/${idEquipement}`)
      .then((r) => {
        node.add({ id: r[0].id, shape: 'image', image: `/app/images/${r[0].type}.png`, size: 20,
                       label: r[0].name, title: r[0].type, id_obj: r[0].id_obj, type_obj: r[0].type_obj, id_baie: r[0].id_baie }) ;
        let idObjEquipement = r[0].id ;

        this.api.get(`/api/equipement/${idEquipement}/port`)
        .then((r) => {
          let imageValue ;
          let titleValue ;
          r.forEach((item, i) => {
            if (item.nb_link === 0 ) {
              imageValue = `/app/images/RJ45.png` ;
            } else {
              imageValue = `/app/images/RJ45-connected.png` ;
            }
            if (item.up === 0) {
              imageValue = `/app/images/RJ45-down.png` ;
            }
            if (item.is_error === 1) {
              imageValue = `/app/images/RJ45-error.png` ;
            }

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
            edge.add({from: idObjEquipement, to: item.id}) ;
          }) ;

          let data = { nodes: node, edges: edge } ;
          let options = {
            width: `document.body.clientWidth`,
            height: '400px'
          };
          if (this.kernel.network !== null) {
            this.kernel.network.destroy() ;
            this.kernel.network = null ;
          }
          let divNetwork = document.getElementById("DIV_vis") ;
          this.kernel.network = new this.vis.Network(divNetwork, data, options) ;
          this.kernel.network.kernel = this.kernel ;

          this.kernel.network.on("doubleClick", this.doubleClicEventOne) ;
          this.kernel.network.on("click", this.clickEvent) ;
        });
    });
  }

  doubleClicEventOne(params) {
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "equipement") {
      this.kernel.baieGraph.affichageOne(nodeClic.id_baie) ;
    }
    if (nodeClic.type_obj === "port") {
        this.kernel.portGraph.affichageOne(nodeClic.id_obj) ;
    }
  }

  clickEvent(params) {
    let content = '' ;
    let actionZone = document.getElementById("actionPortOne") ;
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "equipement") {
      content += `<a href='#'
                          onclick="mobile.eventUserAction({
                            'idEquipement': '${nodeClic.id_obj}' },
                            'portList','listePort')"
                      >Liste des ports</a></br>` ;
    }
    actionZone.innerHTML = content ;
  }

}

export default EquipementGraphMobile;
