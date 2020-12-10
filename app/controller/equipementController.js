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
    *    @Route ("/api/equipement/{idequipement}/port",
    *      name="equipementp")
    */
    EquipementPortListeAction(idEquipement) {
      return this.queryService.callProcedure(`call port_list('equipement',${idEquipement})`)
          .then((reponse) => {
              var listFonctionsDefered=[];
              var r = reponse ;
              var t = this ;
              for(var i=0; i<r.length; i++){
                listFonctionsDefered[i]=(t.queryService.callProcedure(`call getMetaDonnees('${r[i].type_obj}',${r[i].id_obj})`)
                    .then((reponse) => {
                        return reponse ;
                      })) ;
              }
              return Promise.all(listFonctionsDefered).then(function(listResultats){
                for(var i=0; i<r.length; i++){
                  r[i].metaDonnees = listResultats[i] ;
                }
                return t.api.render(r) ;
              })

          })
          .catch((error) => {
            throw error ;
      }) ;
    }

    /**
    *    @Route ("/api/equipement/{idequipement}/listing",
    *      name="equipementlisting")
    */
    EquipementListingAction(idEquipement) {
      return this.queryService.callProcedure(`call listing_equipement(${idEquipement})`)
          .then((reponse) => {
            return this.api.render(reponse) ;
          })
          .catch((error) => {
            throw error ;
      }) ;
    }

}

module.exports = equipementController;
