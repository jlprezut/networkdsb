/**
 *	@class equipementController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class equipementController extends nodefony.Controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkEquipement",
            'version': this.bundle.version,
            'description': "API Equipement"
        }, this.context) ;
    }

    /**
    *    @Route ("/api/equipement",
    *      name="equipement")
    */
    EquipementAction() {
      return this.queryService.callQuery("select * from equipement_list")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/equipement/{idEquipement}",
    *      name="equipementd")
    */
    EquipementDetailAction(idEquipement) {
      return this.queryService.callQuery(`select * from equipement_list where id_obj = ${idEquipement}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/equipement/{idequipement}/port",
    *      name="equipementp")
    */
    EquipementPortListeAction(idEquipement) {
      return this.queryService.callProcedure(`call port_list('equipement',${idEquipement})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = equipementController;
