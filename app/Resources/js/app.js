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
import userAction from "../js/userAction.js" ;
import portAction from "../js/portAction.js" ;

import nodefony from 'nodefony-client' ;

/*
 *	Class Bundle App
 */
class App extends nodefony.Service{

  constructor() {
    super("kernel");
    this.set("kernel", this) ;
    this.initSyslog() ;
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
  }

  loadServices() {
    this.api = new api(this) ;
    this.set("api",this.api);
    this.memo = new memo(this) ;
    this.set("memo",this.memo) ;
    this.swal = swal ;
    this.set("swal",this.swal) ;
    this.userAction = new userAction(this) ;
    this.set("userAction",this.userAction) ;
    this.portAction = new portAction(this) ;
    this.set("portAction",this.portAction) ;
  }
  initializeServices() {
    this.api.initialize() ;
    this.memo.initialize() ;
    this.userAction.initialize() ;
    this.portAction.initialize() ;
  }

  eventUserAction(idObj, typeObj, action) {
    this[typeObj][action](idObj) ;
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
    networkSeries.fontSize = 16;
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
