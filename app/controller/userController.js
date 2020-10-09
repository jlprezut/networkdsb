/**
 *	@class userController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class userController extends nodefony.controller {

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
    *    @Route ("/api/user",
    *      name="users")
    */
    UsersAction() {
        return this.queryService.callQuery("SELECT * from vue_users")
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/user/{iduser}",
    *      name="user")
    */
    UserAction(idUser) {
        return this.queryService.callQuery(`SELECT * from vue_users where id_obj = ${idUser}`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/user/{idUser}/port",
    *      name="userPort")
    */
    UserPortAction(idUser) {
      return this.queryService.callProcedure(`CALL port_list('user',${idUser})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/user/{idUser}/port/{idPort}/comment",
    *      name="userPortComment")
    */
    UserPortCommentAction(idUser, idPort) {
      return this.queryService.callProcedure(`CALL linkuser_comment_RB(${idPort},'${this.context.request.url.query.comment}','${this.context.remoteAddress}')`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/user/{idUser}/link/{idPort}",
    *      name="userl")
    */
    UserPortLinkAction(idUser,idPort) {
      return this.queryService.callProcedure(`CALL create_user_port_RB(${idUser},${idPort},'${this.context.remoteAddress}')`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/user/{idUser}/unlink/{idPort}",
    *      name="userul")
    */
    UserPortUnlinkAction(idUser,idPort) {
      return this.queryService.callProcedure(`CALL delete_user_port_RB(${idUser},${idPort},'${this.context.remoteAddress}')`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/api/user/{idUser}/inventory",
    *      name="userInventory")
    */
    UserInventoryAction(idUser) {
      return this.queryService.callProcedure(`CALL user_arbo_port(${idUser})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = userController;
