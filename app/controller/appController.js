
/**
 *	@class appController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class appController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
//    this.dsbdb = this.getConnection("dsb") ;
  }

/**
 *    @Route ("/",
 *      name="homeApp")
 */
  indexAction() {
    return this.redirect('/secure/mobile') ;
    return this.render("app::index.html.twig", {
      name: this.kernel.projectName,
			description: this.kernel.package.description});
  }

}

module.exports = appController;
