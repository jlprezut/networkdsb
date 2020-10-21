
/**
 *	@class mobileController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 */
class mobileController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
    this.dsbdb = this.getConnection("dsb") ;
  }

  /**
   *    @Route ("/secure/mobile",
   *      name="home")
   */
  mobileAction() {
    return this.render("app::mobile.html.twig", {
      name: this.kernel.projectName,
  		description: this.kernel.package.description});
  }
  
}

module.exports = mobileController;
