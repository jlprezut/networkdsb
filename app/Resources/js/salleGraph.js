import nodefony from 'nodefony' ;

class SalleGraph extends nodefony.Service {

  constructor(kernel) {
    super("salleGraph",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.siteGraph = this.kernel.siteGraph ;
    this.baieGraph = this.kernel.baieGraph ;
    this.networkSeries = this.kernel.networkSeries ;
    this.log("Start") ;
  }

  affichageAll(){
    this.api.get('/api/salle')
      .then((r) => {

        this.networkSeries.data = r ;

        this.tools.cleanEvent() ;
        let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventAll, this) ;
        this.tools.addNodeEvent(y) ;
      });
  }

  clicEventAll(event) {
    this.affichageOne(event.target.dataItem._dataContext.id_obj) ;
  }

  affichageOne(idSalle){
    this.api.get(`/api/salle/${idSalle}`)
      .then((r) => {
        let firstLevel = r ;
        this.api.get(`/api/salle/${idSalle}/baie`)
          .then((r) => {
            firstLevel[0].children = r;
            this.networkSeries.data = firstLevel ;

            this.tools.cleanEvent() ;
            let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventOne,this) ;
            this.tools.addNodeEvent(y) ;
        });
    });
  }

  clicEventOne(event) {
    if (event.target.dataItem._dataContext.type_obj === "salle") {
      this.siteGraph.affichageOne(event.target.dataItem._dataContext.id_site) ;
    }
    if (event.target.dataItem._dataContext.type_obj === "baie") {
      this.baieGraph.affichageOne(event.target.dataItem._dataContext.id_obj) ;
    }
  }

}

export default SalleGraph;
