/**
 *	@class userController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class roleController extends nodefony.controller {

    constructor(container, context) {
        super(container, context);
        // start session
        // this.context.remoteAddress
        this.startSession();
        this.api = new nodefony.api.Json({
            'name': "networkUser",
            'version': this.bundle.version,
            'description': "API User"
        }, this.context) ;
    }

    /**
     *    @Route ("/secure/getrole",
     *      name="role")
     */
    getRoleAction() {
      return this.api.render(this.getUser()) ;
    }

}

module.exports = roleController;
