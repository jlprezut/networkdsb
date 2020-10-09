import nodefony from 'nodefony' ;

class BaieGraph extends nodefony.Service {

  constructor(kernel) {
    super("baieGraph",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.equipementGraph = this.kernel.equipementGraph ;
    this.salleGraph = this.kernel.salleGraph ;
    this.networkSeries = this.kernel.networkSeries ;
    this.log("Start") ;
  }

  affichageAll(){
    this.api.get('/api/baie')
    .then((r) => {
      this.networkSeries.data = r ;

      this.tools.cleanNodeEvent() ;
      let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventAll, this) ;
      this.tools.addNodeEvent(y) ;
    });
  }

  clicEventAll(event) {
    this.affichageOne(event.target.dataItem._dataContext.id_obj) ;
  }

  affichageOne(idBaie){
    this.api.get(`/api/baie/${idBaie}`)
      .then((r) => {

        let firstLevel = r ;
        this.api.get(`/api/baie/${idBaie}/equipement`)
        .then((r) => {

          firstLevel[0].children = r;
          this.networkSeries.data = firstLevel ;

          this.tools.cleanNodeEvent() ;
          let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventOne,this) ;
          this.tools.addNodeEvent(y) ;
        });
    });
  }

  clicEventOne(event) {
    if (event.target.dataItem._dataContext.type_obj === "baie") {
      this.salleGraph.affichageOne(event.target.dataItem._dataContext.id_salle) ;
    }
    if (event.target.dataItem._dataContext.type_obj === "equipement") {
      this.equipementGraph.affichageOne(event.target.dataItem._dataContext.id_obj) ;
    }
  }

}

export default BaieGraph;
