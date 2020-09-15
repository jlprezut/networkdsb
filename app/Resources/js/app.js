/*
 *
 *	ENTRY POINT
 *  WEBPACK bundle app
 *  client side
 */
import "../css/app.css";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

import * as swal from "sweetalert2" ;

import api from "../js/api.js" ;
import memo from "../js/memo.js" ;
import tools from "../js/tools.js" ;
import filtreListe from "../js/filtreListe.js" ;
import errorGraph from "../js/errorGraph.js" ;
import userAction from "../js/userAction.js" ;
import userGraph from "../js/userGraph.js" ;
import siteGraph from "../js/siteGraph.js" ;
import baieGraph from "../js/baieGraph.js" ;
import equipementGraph from "../js/equipementGraph.js" ;
import portAction from "../js/portAction.js" ;
import portGraph from "../js/portGraph.js" ;
import salleGraph from "../js/salleGraph.js" ;

import nodefony from 'nodefony' ;

/*
 *	Class Bundle App
 */
class App extends nodefony.Service{

  constructor() {
    super("kernel");
    this.set("kernel", this) ;
    this.initSyslog() ;
    const { promisify } = require('util');
    // if (document.URL.endsWith('mobile')) {
    //   this.versionMobile = true ;
    // } else {
    //   this.versionMobile = false ;
    // }
    this.chart = this.createGraph();
    this.chart.zoomable = true;
    this.networkSeries = this.defineSerie() ;
    this.loadServices() ;
    this.initializeServices() ;
    this.loadDataHTML() ;
    this.log("start");
  }

  loadDataHTML() {
    this.memo.hide() ;
    this.filtreListe.populateOption('/filter/user','listeUser') ;
    this.filtreListe.populateOption('/filter/site','listeSite') ;
    this.siteGraph.affichageAll() ;
  }

  loadServices() {
    this.api = new api(this) ;
    this.set("api",this.api);
    this.tools = new tools(this) ;
    this.set("tools",this.tools) ;
    this.memo = new memo(this) ;
    this.set("memo",this.memo) ;
    this.swal = swal ;
    this.set("swal",this.swal) ;
    this.userGraph = new userGraph(this) ;
    this.set("userGraph",this.userGraph);
    this.errorGraph = new errorGraph(this) ;
    this.set("errorGraph",this.errorGraph);
    this.siteGraph = new siteGraph(this) ;
    this.set("siteGraph",this.siteGraph);
    this.salleGraph = new salleGraph(this) ;
    this.set("salleGraph",this.salleGraph);
    this.baieGraph = new baieGraph(this) ;
    this.set("baieGraph",this.baieGraph);
    this.portGraph = new portGraph(this) ;
    this.set("portGraph",this.portGraph);
    this.equipementGraph = new equipementGraph(this) ;
    this.set("equipementGraph",this.equipementGraph) ;
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
    this.tools.initialize() ;
    this.userGraph.initialize() ;
    this.errorGraph.initialize() ;
    this.siteGraph.initialize() ;
    this.salleGraph.initialize() ;
    this.baieGraph.initialize() ;
    this.equipementGraph.initialize() ;
    this.portGraph.initialize() ;
    this.filtreListe.initialize() ;
    this.userAction.initialize() ;
    this.portAction.initialize() ;
  }

  eventUserAction(idObj, typeObj, action) {
    let idObjTEXT = JSON.stringify(idObj) ;
    //this.log("this."+typeObj+"."+action+"(JSON.parse('"+idObjTEXT+"'))");
    eval("this."+typeObj+"."+action+"(JSON.parse('"+idObjTEXT+"'))") ;
  }

  createGraph() {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);

    return chart ;
  }

  defineSerie() {
    let networkSeries = this.chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries()) ;

    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "id";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";

    networkSeries.tooltip.label.interactionsEnabled = true ;
    networkSeries.tooltip.keepTargetHover = true ;

    networkSeries.links.template.strength = 1;
    networkSeries.manyBodyStrength = -5;
    networkSeries.centerStrength = 0.5;

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 8;
    networkSeries.minRadius = 15;
    networkSeries.maxRadius = 50;

    let nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = '{name}';
    nodeTemplate.tooltipHTML = '{tooltipText}';
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;

    let linkTemplate = networkSeries.links.template;
    linkTemplate.strokeWidth = 6;
    linkTemplate.interactionsEnabled = true;

    let linkHoverState = linkTemplate.states.create("hover");
    linkHoverState.properties.strokeOpacity = 1;
    linkHoverState.properties.strokeWidth = 2;

    return networkSeries;
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
export default new App();
