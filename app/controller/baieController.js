/**
 *	@class baieController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class baieController extends nodefony.Controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkBaie",
            'version': this.bundle.version,
            'description': "API Baie"
        }, this.context) ;
    }

    /**
    *    @Route ("/baie",
    *      name="baie")
    */
    BaieListAction() {
      return this.queryService.callQuery("select * from baie_list")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/baie/{idBaie}",
    *      name="baiel")
    */
    BaieDetailAction(idBaie) {
      return this.queryService.callQuery(`select * from baie_list where id_obj = ${idBaie}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }
    
    /**
    *    @Route ("/baie/{idBaie}/equipement",
    *      name="baieeq")
    */
    BaieEquipementListAction(idBaie) {
      return this.queryService.callProcedure(`call equipement_list(${idBaie})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = baieController;
