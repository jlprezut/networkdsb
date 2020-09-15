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
        this.startSession();
        this.queryService = this.get("query");
        this.api = new nodefony.api.Json({
            'name': "networkUser",
            'version': this.bundle.version,
            'description': "API User"
        }, this.context) ;
    }


    /**
    *    @Route ("/user",
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
    *    @Route ("/user/{iduser}",
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
    *    @Route ("/user/{idUser}/port",
    *      name="userPort")
    */
    UserPortAction(idUser) {
      return this.queryService.callProcedure(`call port_list('user',${idUser})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/user/{idUser}/link/{idPort}",
    *      name="userl")
    */
    UserPortLinkAction(idUser,idPort) {
      return this.queryService.callQuery(`SELECT create_user_port(${idUser},${idPort}) as resultat`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/user/{idUser}/unlink/{idPort}",
    *      name="userul")
    */
    UserPortUnlinkAction(idUser,idPort) {
      return this.queryService.callQuery(`SELECT delete_user_port(${idUser},${idPort}) as resultat`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

    /**
    *    @Route ("/user/{idUser}/inventory",
    *      name="userInventory")
    */
    UserInventoryAction(idUser) {
      return this.queryService.callProcedure(`call user_arbo_port(${idUser})`)
            .then((reponse) => {
                return this.api.render(reponse) ;
            })
            .catch((error) => {
              throw error ;
            }) ;
    }

}

module.exports = userController;
