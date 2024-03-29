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

import api from "../js/api.js" ;
import memo from "../js/memo.js" ;
import errorGraphMobile from "../js/errorGraphMobile.js" ;
import searchGraphMobile from "../js/searchGraphMobile" ;
import portListMobile from "../js/portListMobile.js" ;
import parcours from "../js/parcours.js" ;
import metaDonnees from "../js/metaDonnees.js"
import ariane from "../js/ariane.js"
import baieListing from "../js/baieListing.js"

import userAction from "../js/userAction.js" ;
import portAction from "../js/portAction.js" ;

import vue2D from "../js/vue2D.js" ;

import nodefony from 'nodefony-client' ;


/*
 *	Class Bundle App
 */
class Mobile extends nodefony.Service{

  constructor() {
    super("kernel");
    this.set("kernel", this) ;

    console.log(process.env)

    this.initSyslog() ;
    this.loadServices() ;
    this.initializeServices() ;
    this.loadDataHTML() ;
    this.log("start Mobile");

    this.arianeTab = [];

    this.user = null ;
    this.api.get('/secure/getrole')
      .then((r) => {
        this.user = r ;
        this.errorGraph.initialize() ;
        this.vue2D.initialize() ;
        this.api.get(`/api/login/${this.user.username}`)
          .then((r) => {
            if (r.id_user != 'null') {
              this.user.id_user = r[0].id_user ;
              if (this.user.employeeType !== 'guest') {
                this.parcours.affichageOne({ 'typeObj' : 'User', 'idObj' : r[0].id_user } ) ;
              }
            }
          });
      })

  }

  loadDataHTML() {
    this.memo.hide() ;

    this.divMainMenu.style.display=(true)?'block':'none';
    this.divErreurs.style.display=(false)?'block':'none';
    this.divSearch.style.display=(false)?'block':'none';
    this.divParcourir.style.display=(false)?'block':'none';
    this.divUtilisateurs.style.display=(false)?'block':'none';
    this.divVue2D.style.display=(false)?'block':'none';
    document.getElementById('DIV_button_Erreur').style.display=(false)?'block':'none';
    document.getElementById('DIV_button_parcourir').style.display=(true)?'block':'none';
    document.getElementById('DIV_button_vue2D').style.display=(true)?'block':'none';
    document.getElementById('DIV_button_utilisateurs').style.display=(true)?'block':'none';
    document.getElementById('DIV_button_search').style.display=(true)?'block':'none';
    this.arianeID.innerHTML = '' ;

  }

  loadServices() {
    this.divMainMenu = document.getElementById("DIV_MainMenu") ;
    this.divErreurs = document.getElementById("DIV_erreurs") ;
    this.divSearch = document.getElementById("DIV_search") ;
    this.divParcourir = document.getElementById("DIV_Parcourir") ;
    this.divUtilisateurs = document.getElementById("DIV_utilisateurs") ;
    this.divVue2D = document.getElementById("DIV_Vue2D") ;

    this.arianeID = document.getElementById("arianeID") ;

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
    this.searchGraph = new searchGraphMobile(this) ;
    this.set("searchGraphMobile", this.searchGraph) ;
    this.portList = new portListMobile(this) ;
    this.set("portListMobile", this.portList) ;
    this.parcours = new parcours(this) ;
    this.set("parcours", this.parcours) ;
    this.metaDonnees = new metaDonnees(this) ;
    this.set("metaDonnees", this.metaDonnees) ;
    this.ariane = new ariane(this) ;
    this.set("ariane", this.ariane) ;
    this.baieListing = new baieListing(this) ;
    this.set("baieListing", this.baieListing) ;

    this.userAction = new userAction(this) ;
    this.set("userAction",this.userAction) ;
    this.portAction = new portAction(this) ;
    this.set("portAction",this.portAction) ;

    this.vue2D = new vue2D(this) ;
    this.set("vue2D",this.vue2D) ;
  }

  initializeServices() {
    this.api.initialize() ;
    this.memo.initialize() ;

    this.portList.initialize() ;
    this.parcours.initialize() ;
    this.metaDonnees.initialize() ;
    this.searchGraph.initialize() ;
    this.userAction.initialize() ;
    this.portAction.initialize() ;
    this.baieListing.initialize() ;

    this.network = null ;
  }

  eventUserAction(idObj, typeObj, action) {
    this[typeObj][action](idObj) ;
  }

  goBack() {
    this.ariane.goBackLink() ;
  }

  isAdmin() {
    return (this.user.employeeType === "admin" ) ;
  }

  ajoutDonneesAutoriser() {
    return (this.user.employeeType !== "guest" ) ;
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
