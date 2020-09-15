/**
 *	@class errorController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class errorController extends nodefony.controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkError",
            'version': this.bundle.version,
            'description': "API error"
        }, this.context) ;
    }
    
    /**
    *    @Route ("/error/port",
    *      name="porterror")
    */
    ErrorPortAction() {
      return this.queryService.callQuery("select * from liste_erreurs")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }
    
}

module.exports = errorController;