import nodefony from 'nodefony-client' ;

class SiteGraphMobile extends nodefony.Service  {

  constructor(kernel) {
    super("siteGraphMobile",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.vis = this.kernel.vis ;
    this.divParcourir = this.kernel.divParcourir ;
    this.divMainMenu = this.kernel.divMainMenu ;
    //v this.salleGraph = this.kernel.salleGraph ;
    this.log("Start") ;
    this.listenEvents() ;
  }

  listenEvents() {
    let select = document.getElementById('parcourirLink') ;
    select.addEventListener('click', (event) => {
      this.divMainMenu.style.display=(false)?'block':'none';
      this.divParcourir.style.display=(true)?'block':'none';
      let actionZone = document.getElementById("actionPortOne") ;
      actionZone.innerHTML = '' ;
      this.affichageAll() ;
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

  affichageAll(){
    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get('/api/site')
      .then((r) => {
        r.forEach((item, i) => {
          node.add({ id: item.id, shape: 'image', image: `/app/images/site.png`, size: 20,
                       label: item.name, id_obj: item.id_obj, type_obj: item.type_obj, title: 'Site' }) ;
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

        this.kernel.network.on("doubleClick", this.clicEventAll) ;

      });
  }

  clicEventAll(params) {
    this.kernel.siteGraph.affichageOne(this.body.data.nodes.get(params.nodes[0]).id_obj) ;
  }

  affichageOne(idSite){
    let node = new this.vis.DataSet() ;
    let edge = new this.vis.DataSet() ;

    this.api.get(`/api/site/${idSite}`)
      .then((r) => {
        node.add({ id: r[0].id, shape: 'image', image: `/app/images/site.png`, size: 20,
                       label: r[0].name, id_obj: r[0].id_obj, type_obj: r[0].type_obj, title: 'Site' }) ;
        let idObjSite = r[0].id ;
        this.api.get(`/api/site/${idSite}/salle`)
          .then((r) => {

            r.forEach((item, i) => {
              node.add({ id: item.id, shape: 'image', image: `/app/images/salle.png`, size: 20,
                           label: item.name, id_obj: item.id_obj, type_obj: item.type_obj, title: 'Salle' }) ;
              edge.add({from: idObjSite, to: item.id}) ;
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

            this.kernel.network.on("doubleClick", this.clicEventOne) ;

          });
      });
  }

  clicEventOne(params) {
    let nodeClic = this.body.data.nodes.get(params.nodes[0]) ;
    if (nodeClic.type_obj === "site") {
      this.kernel.siteGraph.affichageAll() ;
    }
    if (nodeClic.type_obj === "salle") {
        this.kernel.salleGraph.affichageOne(nodeClic.id_obj) ;
    }
  }

}

export default SiteGraphMobile;
