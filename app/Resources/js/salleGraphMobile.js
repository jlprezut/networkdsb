import nodefony from 'nodefony' ;

class SalleGraphMobile extends nodefony.Service {

  constructor(kernel) {
    super("salleGraphMobile",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.siteGraph = this.kernel.siteGraph ;
    this.vis = this.kernel.vis ;
    this.divParcourir = this.kernel.divParcourir ;
    this.divMainMenu = this.kernel.divMainMenu ;
    this.baieGraph = this.kernel.baieGraph ;
    this.log("Start") ;
  }

  affichageOne(idSalle){
    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get(`/api/salle/${idSalle}`)
      .then((r) => {
        node.add({ id: r[0].id, shape: 'image', image: `/app/images/salle.png`, size: 20,
                       label: r[0].name, id_obj: r[0].id_obj, type_obj: r[0].type_obj, id_site: r[0].id_site, title: 'Salle' }) ;
        let idObjSalle = r[0].id ;

        this.api.get(`/api/salle/${idSalle}/baie`)
          .then((r) => {
            r.forEach((item, i) => {
              node.add({ id: item.id, shape: 'image', image: `/app/images/baie.png`, size: 20,
                           label: item.name, id_obj: item.id_obj, type_obj: item.type_obj, title: 'Baie' }) ;
              edge.add({from: idObjSalle, to: item.id}) ;
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

            this.kernel.network.on("doubleClick", this.clicEventOne) ;
        });
    });
  }

  clicEventOne(params) {
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "salle") {
      this.kernel.siteGraph.affichageOne(nodeClic.id_site) ;
    }
    if (nodeClic.type_obj === "baie") {
        this.kernel.baieGraph.affichageOne(nodeClic.id_obj) ;
    }
  }

}

export default SalleGraphMobile;
