import nodefony from 'nodefony' ;

class UserGraph extends nodefony.Service {

  constructor(kernel) {
    super("userGraph",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.memo = this.kernel.memo ;
    this.swal = this.kernel.swal;
    this.portGraph = this.kernel.portGraph ;
    this.tools = this.kernel.tools ;
    this.userAction = this.kernel.userAction ;
    this.portAction = this.kernel.portAction ;
    this.networkSeries = this.kernel.networkSeries ;
    this.log("Start") ;
  }

  affichageAll(){
    this.api.get('/user')
      .then((r) => {
        if (this.memo.memoId !== "") {
          r.forEach((item, i) => {
            item.tooltipText = `<a href="#" onclick="app.eventUserAction(${item.id_obj},'${this.userAction.name}','linkUserPort')">Lier le port</a>` ;
          }) ;
        }
        this.networkSeries.data = r ;
        this.tools.cleanEvent() ;
        let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventAll, this) ;
        this.tools.addNodeEvent(y) ;
      });
  }

  clicEventAll(event) {
    this.affichageOne(event.target.dataItem._dataContext.id_obj) ;
  }

  affichageOne(idUser){
    this.api.get(`/user/${idUser}`)
      .then((r) => {
        r.forEach((item, i) => {
          item.tooltipText += '<hr>'
          item.tooltipText += `<a href="#" onclick="app.eventUserAction(${item.id_obj},'${this.userAction.name}','linkUserPort')">Lier le port</a></br>
                              <a href="#" onclick="app.eventUserAction(${item.id_obj},'${this.userAction.name}','inventoryUser')">Arborescence</a>`
        });
        let firstLevel = r ;
        this.api.get(`/user/${idUser}/port`)
          .then((r) => {
            r.forEach((item, i) => {
              item.tooltipText = `Baie : ${item.baie_name}<br>${item.equipement_name}<br>Port ${item.name}<hr>` + item.tooltipText
              item.tooltipText += '<hr>'
              item.tooltipText += `<a href="#" onclick="app.eventUserAction({ 'idPort': ${item.id_obj}, 'idUser' : ${idUser} },'${this.userAction.name}','modifyCommentPort')">Commentaire</a></br>` ;
              if (item.comment !== '' && item.comment !== null) {
                item.tooltipText += `${item.comment}</br>`
              } else {
                item.tooltipText += `<I>pas de commentaire</I></br>` ;
              }
              item.tooltipText += '<hr>' ;
              item.tooltipText += `<a href="#" onclick="app.eventUserAction(${item.id_obj},'${this.userAction.name}','unlinkUserPort')">Délier de ${firstLevel[0].name}</a>` ;
            });
            firstLevel[0].children = r;
            this.networkSeries.data = firstLevel ;

            this.tools.cleanEvent() ;
            let y = this.networkSeries.nodes.template.events.on("hit", this.clicEventOne,this) ;
            this.tools.addNodeEvent(y) ;
            let z = this.networkSeries.links.template.events.on("hit", this.linkEventOne,this) ;
            this.tools.addLinkEvent(z) ;
        });
    });
  }

  clicEventOne(event) {
    if (event.target.dataItem._dataContext.type_obj === "user") {
      this.affichageAll() ;
    }
    if (event.target.dataItem._dataContext.type_obj === "port") {
      this.portGraph.affichageOne(event.target.dataItem._dataContext.id_obj) ;
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
  }

}

export default UserGraph;
