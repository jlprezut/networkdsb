/**
 *	@class zoneController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class zoneController extends nodefony.controller {

    constructor(container, context) {
        super(container, context);
        // start session
        // this.context.remoteAddress
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkUser",
            'version': this.bundle.version,
            'description': "API User"
        }, this.context) ;
    }

    /**
    *    @Route ("/api/zone/objet/{idZone}",
    *      name="zoneObjet")
    */
    ZoneObjetAction(idZone) {
        return this.queryService.callProcedure(`CALL get_objets_zone(${idZone})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/zone/port/{idZone}",
    *      name="zonePort")
    */
    ZonePortAction(idZone) {
      return this.queryService.callProcedure(`CALL get_ports_zone(${idZone})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/zone/baie/{idZone}",
    *      name="zoneBaie")
    */
    ZoneBaieAction(idZone) {
      return this.queryService.callProcedure(`CALL get_baies_zone(${idZone})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/zone/equipement/{idZone}",
    *      name="zoneEquipement")
    */
    ZoneEquipementAction(idZone) {
      return this.queryService.callProcedure(`CALL get_equipements_zone(${idZone})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }
}

module.exports = zoneController;
