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
    *    @Route ("/port",
    *      name="port")
    */
    PortAction() {
      return this.queryService.callProcedure("CALL port_list(NULL, NULL)")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}",
    *      name="portd")
    */
    PortDetailAction(idPort) {
      return this.queryService.callProcedure(`CALL port_list('port',${idPort})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}/comment",
    *      name="portcomment")
    */
    PortCommentAction(idPort) {
      return this.queryService.callProcedure(`CALL port_comment_RB(${idPort},'${this.context.request.url.query.comment}','${this.context.remoteAddress}')`)
            .then((reponse) => {
                return 'OK' ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}/links",
    *      name="portls")
    */
    PortLinksAction(idPort) {
      return this.queryService.callProcedure(`CALL port_links(${idPort})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}/describe",
    *      name="portde")
    */
    PortDescribeAction(idPort) {
      return this.queryService.callQuery(`SELECT * from port_describe where id_port = ${idPort}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}/link",
    *      name="portll")
    */
    PortLinkListAction(idPort) {
      return this.queryService.callQuery(`SELECT * from port_link where id_obj = ${idPort} `)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}/link/{idDest}",
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
    *    @Route ("/port/{idPort}/link/{idDest}/comment",
    *      name="portlcomment")
    */
    PortLinkCommentAction(idPort,idDest) {
      return this.queryService.callProcedure(`CALL link_comment_RB(${idPort},${idDest},'${this.context.request.url.query.comment}','${this.context.remoteAddress}')`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/port/{idPort}/unlink/{idDest}",
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

}

module.exports = portController;
