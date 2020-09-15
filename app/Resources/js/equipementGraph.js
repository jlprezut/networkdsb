import nodefony from 'nodefony' ;

class EquipementGraph extends nodefony.Service {

  constructor(kernel) {
    super("equipementGraph",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.baieGraph = this.kernel.baieGraph ;
    this.portGraph = this.kernel.portGraph ;
    this.networkSeries = this.kernel.networkSeries ;
    this.log("Start") ;
  }

  affichageAll(){
    this.api.get('/equipement')
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

  affichageOne(idEquipement){
    this.api.get(`/equipement/${idEquipement}`)
      .then((r) => {
        // r.forEach((item, i) => {
        //   item.tooltipText = `<a href="#" onclick="app.eventUserAction(${item.id_obj},'${item.type_obj}','LinkUserPort')">Lier le port mémoriser</a>` ;
        // });
        let firstLevel = r ;
        this.api.get(`/equipement/${idEquipement}/port`)
        .then((r) => {
          // r.forEach((item, i) => {
          //   item.tooltipText = `<a href="#" onclick="app.eventUserAction(${item.id_obj},'${item.type_obj}','unLinkUserPort')">Délier de ${firstLevel[0].name}</a>` ;
          // });
          firstLevel[0].children = r;
          this.networkSeries.data = firstLevel ;

          this.tools.cleanEvent() ;
          let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventOne,this) ;
          this.tools.addNodeEvent(y) ;
        });
    });
  }

  clicEventOne(event) {
    if (event.target.dataItem._dataContext.type_obj === "equipement") {
      this.baieGraph.affichageOne(event.target.dataItem._dataContext.id_baie) ;
    }
    if (event.target.dataItem._dataContext.type_obj === "port") {
      this.portGraph.affichageOne(event.target.dataItem._dataContext.id_obj) ;
    }
  }

}

export default EquipementGraph;
