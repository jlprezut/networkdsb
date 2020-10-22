import nodefony from 'nodefony-client' ;

class BaieGraphMobile extends nodefony.Service {

  constructor(kernel) {
    super("baieGraphMobile",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.vis = this.kernel.vis ;
    this.salleGraph = this.kernel.salleGraph ;
    this.equipementGraph = this.kernel.equipementGraph ;
    this.log("Start") ;
  }

  affichageOne(idBaie){
    let actionZone = document.getElementById("actionPortOne") ;
    actionZone.innerHTML = '' ;

    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get(`/api/baie/${idBaie}`)
      .then((r) => {
        node.add({ id: r[0].id, shape: 'image', image: `/app/images/baie.png`, size: 20,
                       label: r[0].name, id_obj: r[0].id_obj, type_obj: r[0].type_obj, id_salle: r[0].id_salle, title: 'Baie' }) ;
        let idObjBaie = r[0].id ;

        this.api.get(`/api/baie/${idBaie}/equipement`)
        .then((r) => {
          r.forEach((item, i) => {
            node.add({ id: item.id, shape: 'image', image: `/app/images/${item.type}.png`, size: 20,
                         label: item.name, id_obj: item.id_obj, type_obj: item.type_obj, title:item.title }) ;
            edge.add({from: idObjBaie, to: item.id}) ;
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

          this.kernel.network.on("doubleClick", this.doubleClicEventOne) ;
          this.kernel.network.on("click", this.clickEvent) ;

        });
    });
  }

  doubleClicEventOne(params) {
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "baie") {
      this.kernel.salleGraph.affichageOne(nodeClic.id_salle) ;
    }
    if (nodeClic.type_obj === "equipement") {
        this.kernel.equipementGraph.affichageOne(nodeClic.id_obj) ;
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

export default BaieGraphMobile;
