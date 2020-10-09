/**
 *	@class siteController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class siteController extends nodefony.Controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkSite",
            'version': this.bundle.version,
            'description': "API Site"
        }, this.context) ;
    }

    /**
    *    @Route ("/api/site",
    *      name="site")
    */
    SiteListAction() {
      return this.queryService.callQuery("select * from site_list")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/site/{idSite}",
    *      name="sited")
    */
    SiteDetailAction(idSite) {
      return this.queryService.callQuery(`select * from site_list where id_obj = ${idSite}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/site/{idSite}/salle",
    *      name="sitesa")
    */
    SiteSalleListAction(idSite) {
      return this.queryService.callQuery(`select * from salle_list where id_site = ${idSite}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = siteController;
