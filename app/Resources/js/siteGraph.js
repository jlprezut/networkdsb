import nodefony from 'nodefony' ;

class SiteGraph extends nodefony.Service  {

  constructor(kernel) {
    super("siteGraph",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.salleGraph = this.kernel.salleGraph ;
    this.networkSeries = this.kernel.networkSeries ;
    this.log("Start") ;
  }

  affichageAll(){
    this.api.get('/api/site')
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

  affichageOne(idSite){
    this.api.get(`/api/site/${idSite}`)
      .then((r) => {
        let firstLevel = r ;
        this.api.get(`/api/site/${idSite}/salle`)
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
    if (event.target.dataItem._dataContext.type_obj === "site") {
      this.affichageAll() ;
    }
    if (event.target.dataItem._dataContext.type_obj === "salle") {
      this.salleGraph.affichageOne(event.target.dataItem._dataContext.id_obj) ;
    }
  }

}

export default SiteGraph;
