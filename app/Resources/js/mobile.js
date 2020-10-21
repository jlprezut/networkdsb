/*
 *
 *	ENTRY POINT
 *  WEBPACK bundle app
 *  client side
 */
 // javascript bootstrap library
 import 'bootstrap';
 // bootstrap scss framework
 import '../css/custom.scss';
 import '../css/bouton.scss';

import "../css/mobile.css";
import "vis/dist/vis.css" ;

import * as swal from "sweetalert2" ;
import * as vis from "vis" ;
//import * as vis from "vis-data" ;

import api from "../js/api.js" ;
import memo from "../js/memo.js" ;
import tools from "../js/tools.js" ;
import filtreListe from "../js/filtreListe.js" ;
import errorGraphMobile from "../js/errorGraphMobile.js" ;
import portGraphMobile from "../js/portGraphMobile.js" ;
import portListMobile from "../js/portListMobile.js" ;
import siteGraphMobile from "../js/siteGraphMobile.js" ;
import salleGraphMobile from "../js/salleGraphMobile.js" ;
import baieGraphMobile from "../js/baieGraphMobile.js" ;
import equipementGraphMobile from "../js/equipementGraphMobile.js" ;
import userGraphMobile from "../js/userGraphMobile.js" ;

import userAction from "../js/userAction.js" ;
import portAction from "../js/portAction.js" ;

import nodefony from 'nodefony' ;

/*
 *	Class Bundle App
 */
class Mobile extends nodefony.Service{

  constructor() {
    super("kernel");
    this.set("kernel", this) ;
    this.initSyslog() ;
    const { promisify } = require('util');
    this.loadServices() ;
    this.initializeServices() ;
    this.loadDataHTML() ;
    this.log("start Mobile");
  }

  loadDataHTML() {
    this.memo.hide() ;

    // this.divMainMenu.style.visibility=(true)?'visible':'hidden';
    // this.divNaviguer.style.visibility=(false)?'visible':'hidden';
    // this.divErreurs.style.visibility=(false)?'visible':'hidden';

    this.divMainMenu.style.display=(true)?'block':'none';
    this.divNaviguer.style.display=(false)?'block':'none';
    this.divErreurs.style.display=(false)?'block':'none';
    this.divParcourir.style.display=(false)?'block':'none';
    this.divUtilisateurs.style.display=(false)?'block':'none';

    //this.filtreListe.populateOption('/filter/user','listeUser') ;
    //this.filtreListe.populateOption('/filter/site','listeSite') ;
  }

  loadServices() {
    this.divMainMenu = document.getElementById("DIV_MainMenu") ;
    this.divNaviguer = document.getElementById("DIV_Naviguer") ;
    this.divErreurs = document.getElementById("DIV_erreurs") ;
    this.divParcourir = document.getElementById("DIV_Parcourir") ;
    this.divUtilisateurs = document.getElementById("DIV_utilisateurs") ;

    this.api = new api(this) ;
    this.set("api",this.api);
    this.memo = new memo(this) ;
    this.set("memo",this.memo) ;
    this.swal = swal ;
    this.set("swal",this.swal) ;
    this.vis = vis ;
    this.set("vis", this.vis) ;
    this.errorGraph = new errorGraphMobile(this) ;
    this.set("errorGraphMobile", this.errorGraph) ;
    this.portGraph = new portGraphMobile(this) ;
    this.set("portGraphMobile", this.portGraph) ;
    this.portList = new portListMobile(this) ;
    this.set("portListMobile", this.portList) ;
    this.siteGraph = new siteGraphMobile(this) ;
    this.set("siteGraphMobile", this.siteGraph) ;
    this.salleGraph = new salleGraphMobile(this) ;
    this.set("salleGraphMobile", this.salleGraph) ;
    this.baieGraph = new baieGraphMobile(this) ;
    this.set("baieGraphMobile", this.baieGraph) ;
    this.equipementGraph = new equipementGraphMobile(this) ;
    this.set("equipementGraphMobile", this.equipementGraph) ;
    this.userGraph = new userGraphMobile(this) ;
    this.set("userGraphMobile", this.userGraph) ;

    this.filtreListe = new filtreListe(this) ;
    this.set("filtreListe",this.filtreListe);
    this.userAction = new userAction(this) ;
    this.set("userAction",this.userAction) ;
    this.portAction = new portAction(this) ;
    this.set("portAction",this.portAction) ;
  }

  initializeServices() {
    this.api.initialize() ;
    this.memo.initialize() ;
    this.errorGraph.initialize() ;
    this.portGraph.initialize() ;
    this.portList.initialize() ;
    this.siteGraph.initialize() ;
    this.salleGraph.initialize() ;
    this.baieGraph.initialize() ;
    this.equipementGraph.initialize() ;
    this.userGraph.initialize() ;

    this.filtreListe.initialize() ;
    this.userAction.initialize() ;
    this.portAction.initialize() ;

    this.user = null ;
    this.api.get('/secure/getrole')
      .then((r) => {
        this.user = r ;
      })

    this.network = null ;
  }

  eventUserAction(idObj, typeObj, action) {
    this[typeObj][action](idObj) ;
  }

  modifAutoriser() {
    return (this.user.username === "jlprezut" || this.user.username === "stliba" ) ;
  }

}

/*
 * HMR
 */
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('Cannot apply HMR update.', err);
    }
  });
}
export default new Mobile();
