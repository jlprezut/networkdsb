/**
 *	@class filterController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class filterController extends nodefony.controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkFilter",
            'version': this.bundle.version,
            'description': "API Filter"
        }, this.context) ;
    }

    /**
    *    @Route ("/api/filter/site",
    *      name="filters")
    */
    SiteFilterAction() {
      return this.queryService.callProcedure("call filter_site(NULL,NULL)")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/filter/site/{idSite}/salle",
    *      name="filtersa")
    */
    SiteSalleFilterAction(idSite) {
      return this.queryService.callProcedure(`call filter_site(${idSite},NULL)`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/filter/site/{idSite}/salle/{idSalle}/baie",
    *      name="filtersab")
    */
    SiteSalleBaieFilterAction(idSite,idSalle) {
      return this.queryService.callProcedure(`call filter_site(${idSite},${idSalle})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/filter/baie",
    *      name="filterb")
    */
    BaieFilterAction() {
      return this.queryService.callProcedure("call filter_baie(NULL,NULL)")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/filter/user",
    *      name="filteru")
    */
    UserFilterAction() {
      return this.queryService.callProcedure("call filter_user()")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/filter/baie/{idBaie}/equipement",
    *      name="filterbe")
    */
    BaieEquipementFilterAction(idBaie) {
      return this.queryService.callProcedure(`call filter_baie(${idBaie},NULL)`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/filter/baie/{idBaie}/equipement/{idEquipement}/port",
    *      name="filterbep")
    */
    BaieEquipementPortFilterAction(idBaie,idEquipement) {
      return this.queryService.callProcedure(`call filter_baie(${idBaie},${idEquipement})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = filterController;
