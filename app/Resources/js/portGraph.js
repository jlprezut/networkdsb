import nodefony from 'nodefony' ;

class PortGraph extends nodefony.Service {

  constructor(kernel) {
    super("portGraph",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.memo = this.kernel.memo ;
    this.swal = this.kernel.swal ;
    this.equipementGraph = this.kernel.equipementGraph ;
    this.userGraph = this.kernel.userGraph ;
    this.portAction = this.kernel.portAction ;
    this.userAction = this.kernel.userAction ;
    this.networkSeries = this.kernel.networkSeries ;
    this.log("Start") ;
  }

  affichageAll(){
    this.api.get('/port')
    .then((r) => {
      r.forEach((item, i) => {
        item.tooltipText = `<a href="#" onclick="app.eventUserAction({ 'idPort': ${item.id_obj}, 'refresh' : 'All' },'${this.portAction.name}','${this.portAction.modifyCommentPort.name}')">Commentaire</a></br>` ;
        if (item.comment !== '' && item.comment !== null) {
          item.tooltipText += `${item.comment}</br>`
        } else {
          item.tooltipText += `<I>pas de commentaire</I></br>` ;
        }
        item.tooltipText += '<hr>' ;
        item.tooltipText += `<a href="#" onclick="app.eventUserAction(${item.id_obj},'${this.memo.name}','${this.memo.setMemoId.name}')">Mémoriser le port</a>` ;
      });

      this.networkSeries.data = r ;

      this.tools.cleanEvent() ;
      var y = this.networkSeries.nodes.template.events.on("hit", this.nodeEventAll, this) ;
      this.tools.addNodeEvent(y) ;
    });
  }

  nodeEventAll(event) {
    this.affichageOne(event.target.dataItem._dataContext.id_obj) ;
  }

  affichageOne(idPort){
    this.api.get(`/port/${idPort}/links`)
      .then((r) => {
        r.forEach((item, i) => {
          if (item.type_obj == 'port') {
            item.tooltipText = `<a href="#" onclick="app.eventUserAction({ 'idPort': ${item.id_obj}, 'refresh': 'One' },'${this.portAction.name}','${this.portAction.modifyCommentPort.name}')">Commentaire</a></br>` ;
            if (item.comment !== '' && item.comment !== null) {
              item.tooltipText += `${item.comment}</br>`
            } else {
              item.tooltipText += `<I>pas de commentaire</I></br>` ;
            }
            item.tooltipText += '<hr>' ;
            item.tooltipText += `<a href='#' onclick='app.eventUserAction(${item.id_obj},"${this.memo.name}","${this.memo.setMemoId.name}")'>Mémoriser le port</a></br>
                                <a href='#' onclick='app.eventUserAction(${item.id_obj},"${this.portAction.name}","${this.portAction.linkPort.name}")'>Lier le port</a></br>
                                </br>
                                <a href='#' onclick='app.eventUserAction(${item.id_obj},"${this.portAction.name}","${this.portAction.addQuadrupleur.name}")'>Ajouter un quadrupleur</a>` ;
            item.tooltipTextLink = `<a href="#" onclick="app.eventUserAction({ 'idPort': ${item.id_obj}, 'idPortSource': ${item.idPortSource} },'${this.portAction.name}','${this.portAction.modifyCommentLink.name}')">Commentaire</a></br>` ;
            if (item.commentLink !== '' && item.commentLink !== null) {
              item.tooltipTextLink += `${item.commentLink}</br>`
            } else {
              item.tooltipTextLink += `<I>pas de commentaire</I></br>` ;
            }
          }
        })
        this.networkSeries.data = r ;
        this.tools.cleanEvent() ;
        let y = this.networkSeries.nodes.template.events.on("hit", this.nodeEventOne,this) ;
        this.tools.addNodeEvent(y) ;
        let z = this.networkSeries.links.template.events.on("hit", this.linkEventOne,this) ;
        this.tools.addLinkEvent(z) ;

        this.networkSeries.links.template.tooltipHTML = "{tooltipTextLink}" ;
      });
  }

  nodeEventOne(event) {
    if (event.target.dataItem._dataContext.type_obj === "port") {
      this.equipementGraph.affichageOne(event.target.dataItem._dataContext.id_equipement) ;
    }
    if (event.target.dataItem._dataContext.type_obj === "user") {
      this.userGraph.affichageOne(event.target.dataItem._dataContext.id_user) ;
    }
  }

  linkEventOne(event) {
    if ((event.target.source.dataItem._dataContext.type_obj == "user" ||
            event.target.dataItem._dataContext.type_obj == "user") &&
        (event.target.source.dataItem._dataContext.type_obj == "port" ||
            event.target.dataItem._dataContext.type_obj == "port")) {
      let objUser ;
      let objPort ;
      if (event.target.source.dataItem._dataContext.type_obj == "user") {
        objUser = event.target.source.dataItem._dataContext ;
        objPort = event.target.dataItem._dataContext ;
      } else {
        objUser = event.target.dataItem._dataContext ;
        objPort = event.target.source.dataItem._dataContext ;
      }
      this.swal.fire({title:"Confirmez-vous", text:`la suppression de la liaison avec ${objUser.name} ?`,
          showCancelButton: true, icon:'question'})
        .then((response) => {
          if (response.isConfirmed) {
            this.userAction.unlinkUserPort(objPort.id_obj) ;
          }
      })
    }
    if (event.target.source.dataItem._dataContext.type_obj == "port" &&
          event.target.dataItem._dataContext.type_obj == "port" ) {
      this.swal.fire({title:"Confirmez-vous", text:`la suppression du lien ?`,
          showCancelButton: true, icon:'question'})
        .then((response) => {
          if (response.isConfirmed) {
            this.portAction.unlinkPort(event.target.dataItem._dataContext.id_obj,
                                       event.target.source.dataItem._dataContext.id_obj) ;
          }
        })
    }
  }
}

export default PortGraph;
