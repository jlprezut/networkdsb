/**
 *	@class portController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class portController extends nodefony.controller {

    constructor(container, context) {
        super(container, context);
        // start session
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkPort",
            'version': this.bundle.version,
            'description': "API port"
        }, this.context) ;
    }

    /**
    *    @Route ("/api/port/{idPort}/text",
    *      name="porttxt")
    */
    PortTextAction(idPort) {
      return this.queryService.callQuery(`SELECT * from port_describe where id_port = ${idPort}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/port/{idPort}/link/{idDest}",
    *      name="portl")
    */
    PortLinkAction(idPort,idDest) {
      return this.queryService.callProcedure(`CALL create_link_RB(${idPort},${idDest},'${this.context.remoteAddress}')`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/port/{idPort}/unlink/{idDest}",
    *      name="portu")
    */
    PortUnlinkAction(idPort,idDest) {
      return this.queryService.callProcedure(`CALL delete_link_RB(${idPort},${idDest},'${this.context.remoteAddress}')`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/meta/{typeObj}/{idObj}",
    *      name="portmeta")
    */
    metaFreeAction(typeObj,idObj) {
      return this.queryService.callProcedure(`CALL freeMetaObj('${typeObj}',${idObj},${this.context.request.url.query.id_user})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/meta/{typeObj}/{idObj}/{idMeta}",
    *      name="portAddDonnees")
    */
    addDonneesAction(typeObj,idObj,idMeta) {
      return this.queryService.callProcedure(`CALL addDonneesObj('${typeObj}',${idObj},${idMeta},'${this.context.request.url.query.valeur}',${this.context.request.url.query.id_user})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/parcours/{typeObj}/{idObj}",
    *      name="porttest")
    */
    ParcoursAction(typeObj,idObj) {

      return this.queryService.callProcedure(`CALL parcours('${typeObj}',${idObj})`)
            .then((reponse) => {
                var listFonctionsDefered=[];
                var r = reponse ;
                var t = this ;
                for(var i=0; i<r.length; i++){
                  listFonctionsDefered[i]=(t.queryService.callProcedure(`call getMetaDonnees('${reponse[i].type_obj}',${reponse[i].id_obj})`)
                      .then((reponse) => {
                          return reponse ;
                        })) ;
      					}
                for(var i=0; i<r.length; i++){
                  listFonctionsDefered[i+r.length]=(t.queryService.callProcedure(`call getExtraDonnees('${reponse[i].type_obj}',${reponse[i].id_obj})`)
                      .then((reponse) => {
                          return reponse ;
                        })) ;
      					}
                return Promise.all(listFonctionsDefered).then(function(listResultats){
                  for(var i=0; i<r.length; i++){
                    r[i].metaDonnees = listResultats[i] ;
                    r[i].extraDonnees = listResultats[i+r.length] ;
                  }
                  return t.api.render(r) ;
                })
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/search",
    *      name="portsearch")
    */
    searchAction() {
      return this.queryService.callProcedure(`CALL search_text('${this.context.request.url.query.texte}')`)
            .then((reponse) => {
                var listFonctionsDefered=[];
                var r = reponse ;
                var t = this ;
                for(var i=0; i<r.length; i++){
                  listFonctionsDefered[i]=(t.queryService.callProcedure(`call getExtraDonnees('${reponse[i].type_obj}',${reponse[i].id_obj})`)
                      .then((reponse) => {
                          return reponse ;
                        })) ;
                }
                return Promise.all(listFonctionsDefered).then(function(listResultats){
                  for(var i=0; i<r.length; i++){
                    r[i].extraDonnees = listResultats[i] ;
                  }
                  return t.api.render(r) ;
                })
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = portController;
