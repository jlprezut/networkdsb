/**
 *	@class salleController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class salleController extends nodefony.Controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkSalle",
            'version': this.bundle.version,
            'description': "API Salle"
        }, this.context) ;
    }

    /**
    *    @Route ("/salle",
    *      name="salle")
    */
    SalleListAction() {
      return this.queryService.callQuery("select * from salle_list")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/salle/{idSalle}",
    *      name="salled")
    */
    SalleDetailAction(idSalle) {
      return this.queryService.callQuery(`select * from salle_list where id_obj = ${idSalle}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/salle/{idSalle}/baie",
    *      name="salleb")
    */
    SalleBaieListAction(idSalle) {
      return this.queryService.callProcedure(`call baie_list(${idSalle})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = salleController;
