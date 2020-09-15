/**
 *	@class quadrupleurController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class quadrupleurController extends nodefony.controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkQuadrupleur",
            'version': this.bundle.version,
            'description': "API Quadrupleur"
        }, this.context) ;
    }

    /**
    *    @Route ("/quadrupleur/empty",
    *      name="quadrupleurEmpty")
    */
    quadrupleurEmptyAction() {
        return this.queryService.callProcedure("call get_port0_empty_quadrupleur()")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = quadrupleurController;
