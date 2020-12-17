import nodefony from 'nodefony-client' ;
import Konva from 'konva' ;

class Vue2D extends nodefony.Service {

  constructor (kernel) {
    super("vue2D",kernel.container) ;
  }

  initialize(){
    this.memo = this.kernel.memo ;
    this.api = this.kernel.api ;
    this.swal = this.kernel.swal ;
    this.divUtilisateurs = this.kernel.divUtilisateurs ;
    this.divParcourir = this.kernel.divParcourir ;
    this.divMainMenu = this.kernel.divMainMenu ;
    this.log("Start") ;
    this.listenEvents() ;
    this.width = 3000 ; // window.innerWidth;
    this.height = 2000 ; // window.innerHeight;
    this.padding = 500 ;

    this.users = [] ;
    this.rj45 = [] ;
    this.fibre = [] ;
    this.stage = new Konva.Stage({
          container: 'containerVue2D',
          width: window.innerWidth + (this.padding) * 2 + 100,
          height: window.innerHeight + (this.padding) * 2 + 100,
          kernel: this.kernel,
    });
    this.shapesLayer = new Konva.Layer();
    this.tooltipLayer = new Konva.Layer();
    this.userLayer = new Konva.Layer() ;

    this.tooltip = new Konva.Label({
          opacity: 0.75,
          visible: false,
          listening: false,
    });

    this.tooltip.add(
          new Konva.Tag({
            fill: 'black',
            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.5,
            visible: false,
          })
    );

    this.tooltip.add(
          new Konva.Text({
            text: '',
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: 'white',
          })
    );

    this.tooltipLayer.add(this.tooltip);

    this.imageObj = new Image();
    this.imageObj.onload = function () {
      this.kernel.vue2D.yodaImg.image(this.kernel.vue2D.imageObj);
      this.kernel.vue2D.planetsLayer.draw();
    };
    this.imageObj.kernel = this.kernel ;

    this.userTexture = new Image();
    this.userTexture.onload = function () {
      this.kernel.vue2D._handleTextureLoadedUser();
    };
    this.userTexture.kernel = this.kernel ;

    this.rj45Texture = new Image();
    this.rj45Texture.onload = function () {
      this.kernel.vue2D._handleTextureLoadedRJ45();
    };
    this.rj45Texture.kernel = this.kernel ;

    this.RJ45ConnectedTexture = new Image();
    this.RJ45ConnectedTexture.onload = function () {
      this.kernel.vue2D.rj45Texture.src = '/app/images/RJ45.png';
    };
    this.RJ45ConnectedTexture.kernel = this.kernel ;

    this.fibreTexture = new Image();
    this.fibreTexture.onload = function () {
      this.kernel.vue2D._handleTextureLoadedFibre();
    };
    this.fibreTexture.kernel = this.kernel ;

    this.fibreConnectedTexture = new Image();
    this.fibreConnectedTexture.onload = function () {
      this.kernel.vue2D.fibreTexture.src = '/app/images/Fibre.png';
    };
    this.fibreConnectedTexture.kernel = this.kernel ;

    this.planetsLayer = new Konva.Layer();
    this.stage.add(this.planetsLayer);

    this.yodaImg = new Konva.Image({
      x: 0,
      y: 0,
      width: 2944,
      height: 1622,
      draggable: false,
      listening : false,
    });
    this.planetsLayer.add(this.yodaImg);

    this.stage.add(this.tooltipLayer);
    this.stage.add(this.userLayer);

    this.stage.on('mouseover', function (evt) {
      var shape = evt.target;
      if (shape && shape.attrs.key) {
        //shape.opacity(0.5);
          var t = this.attrs.kernel.vue2D.tooltip.getTag() ;
          t.show() ;
          this.attrs.kernel.vue2D.tooltipLayer.draw() ;
       // shapesLayer.draw();
      }
    });

    this.stage.on('mouseout', function (evt) {
      var shape = evt.target;
      if (shape) {
        //shape.opacity(0);
        //shapesLayer.draw();
        this.attrs.kernel.vue2D.tooltip.hide();
          var t = this.attrs.kernel.vue2D.tooltip.getTag() ;
          t.hide() ;
        this.attrs.kernel.vue2D.tooltipLayer.draw();
      }
    });
    this.stage.on('mousemove', function (evt) {
      var shape = evt.target;
      if (shape && shape.attrs.key) {
        var mousePos = this.attrs.kernel.vue2D.stage.getPointerPosition();
        var x = mousePos.x;
        var y = mousePos.y - 5;
        this.attrs.kernel.vue2D.updateTooltip(this.attrs.kernel.vue2D.tooltip, shape.attrs.x + (shape.attrs.width/2), shape.attrs.y, shape.attrs.toolTip);
        this.attrs.kernel.vue2D.tooltipLayer.batchDraw();
      }
    });

    this.stage.on('click', function (evt) {
        var shape = evt.target;
        if (shape && shape.attrs.typeObj) {
            this.attrs.kernel.parcours.affichageOne({ 'typeObj': shape.attrs.typeObj, 'idObj': shape.attrs.idObj }) ;

            }
        //}
      });

    let idZone = 1 ;

    this.api.get(`/api/zone/objet/${idZone}`)
        .then((listObjet) => {
            listObjet.forEach((area, i) => {
              var node = new Konva.Rect({
                x: area.pos_x,
                y: area.pos_y,
                width: area.largeur,
                height: area.hauteur,
                fill: 'white',
                stroke: 'red',
                key: "objet-" + area.id_objet,
                toolTip: area.nom_objet,
                opacity: 1,
              });
              this.shapesLayer.add(node);

              if (area.id_user !== null) {
                this.users.push({data: area}) ;
              }
            }) ;

            this.api.get(`/api/zone/port/${idZone}`)
                .then((listPort) => {
                    listPort.forEach((port, i) => {
                      if (port.type_acces === 'RJ45') {
                        this.rj45.push({data: port}) ;
                      } else {
                        this.fibre.push({data: port}) ;
                      }
                    }) ;

                    this.userTexture.src = '/app/images/user.png';
                    this.RJ45ConnectedTexture.src = '/app/images/RJ45-connected.png';
                    this.fibreConnectedTexture.src = '/app/images/Fibre-connected.png';
                    this.imageObj.src = '/app/images/PlanEtg1.png';

                    this.stage.add(this.shapesLayer);

                    this.planetsLayer.moveToBottom();
                    this.userLayer.moveToTop();
                    this.tooltipLayer.moveToTop() ;

                    var scrollContainer = document.getElementById('scroll-container');
                    scrollContainer.addEventListener('scroll', this.repositionStage);
                    this.repositionStage();
            }) ;
    }) ;
  }

  listenEvents() {
    let select = document.getElementById('vue2DLink') ;
    select.addEventListener('click', (event) => {
      this.kernel.vue2D.affichage() ;
    });

    let imgBack = document.getElementById("DIV_Vue2D_Back") ;
    imgBack.addEventListener('click', (event) => {
              this.backMenu() ;
    });
  }

  backMenu() {
    this.kernel.divMainMenu.style.display=(true)?'block':'none';
    this.kernel.divVue2D.style.display=(false)?'block':'none';
  }

  affichage() {
    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divErreurs.style.display=(false)?'block':'none';
    this.kernel.divSearch.style.display=(false)?'block':'none';
    this.kernel.divParcourir.style.display=(false)?'block':'none';

    this.kernel.divVue2D.style.display=(true)?'block':'none';

    this.kernel.ariane.addLink({ 'class': 'vue2D', 'methode': 'affichage', 'obj': { }, 'libelle': 'Vue 2D', 'tooltip': 'Vue 2D' }) ;

  }

  repositionStage(e) {
    var scrollContainer = document.getElementById('scroll-container');
    var dx = scrollContainer.scrollLeft - mobile.vue2D.padding;
    var dy = scrollContainer.scrollTop - mobile.vue2D.padding;
    mobile.vue2D.stage.container().style.transform =
      'translate(' + dx + 'px, ' + dy + 'px)';
    mobile.vue2D.stage.x(-dx);
    mobile.vue2D.stage.y(-dy);
    mobile.vue2D.stage.batchDraw();
  }

  updateTooltip(tooltip, x, y, text) {
        this.tooltip.getText().text(text);
        this.tooltip.position({
          x: x,
          y: y,
        });
        this.tooltip.show();
  }

  _handleTextureLoadedUser(event) {
      for (var i in this.users) {
        var item = this.users[i].data ;
        var pos_x, pos_y ;
        switch(item.orientation) {
          case 'Sud':
            pos_x = item.pos_x + (item.largeur / 2) - 32 ;
            pos_y = item.pos_y + item.hauteur ;
            break;
          case 'Nord':
            pos_x = item.pos_x + (item.largeur / 2) - 32 ;
            pos_y = item.pos_y - 64 ;
            break;
          case 'Ouest':
            pos_x = item.pos_x - 64 ;
            pos_y = item.pos_y + (item.hauteur / 2) - 32 ;
            break;
          case 'Est':
            pos_x = item.pos_x + item.largeur ;
            pos_y = item.pos_y + (item.hauteur / 2) - 32 ;
            break;
        }

        var bunny = new Konva.Image({
            image: this.userTexture,
            x: pos_x,
            y: pos_y,
            width: 64,
            height: 64,
            key: 'user-'+item.id_user,
            toolTip: item.nom_user,
            idObj: item.id_user,
            typeObj: 'User',
        });
        this.userLayer.add(bunny);
      }
    this.userLayer.batchDraw();
  }

  _handleTextureLoadedRJ45(event) {
      var id_objet = -1 ;
      for (var i in this.rj45) {
          var item = this.rj45[i].data ;
          var j ;
          var decalage_x = 0 ;
          var decalage_y = 1;
          if (item.orientation === 'Nord' || item.orientation === 'Sud') {
              decalage_x = 1 ;
              decalage_y = 0 ;
        }
        if (item.id_objet !== id_objet) {
          id_objet = item.id_objet ;
          j = 0 ;
        } else {
          j++ ;
        }
        var texture = this.rj45Texture ;
        if (item.nb_link>0) {
          texture = this.RJ45ConnectedTexture ;
        }
        var bunny = new Konva.Image({
            image: texture,
            x: item.pos_x+(j*16)*decalage_x,
            y: item.pos_y+(j*16)*decalage_y,
            width: 16,
            height: 16,
            key: 'port-'+item.id_port ,
            toolTip: item.libelle,
            idObj: item.id_port,
            typeObj: 'Port',
        });
        this.userLayer.add(bunny);
      }
      this.userLayer.batchDraw();
  }

  _handleTextureLoadedFibre(event) {
      var id_objet = -1 ;
      for (var i in this.fibre) {
          var item = this.fibre[i].data ;
          var j ;
          var decalage_x = 0 ;
          var decalage_y = 1;
          if (item.orientation === 'Nord' || item.orientation === 'Sud') {
              decalage_x = 1 ;
              decalage_y = 0 ;
      }
      if (item.id_objet !== id_objet) {
        id_objet = item.id_objet ;
        j = 0 ;
      } else {
        j++ ;
      }
      var texture = this.fibreTexture ;
      if (item.nb_link>0) {
        texture = this.fibreConnectedTexture ;
      }
        var bunny = new Konva.Image({
            image: texture,
            x: item.pos_x+(j*16)*decalage_x + 16*decalage_y,
            y: item.pos_y+(j*16)*decalage_y + 16*decalage_x,
            width: 16,
            height: 16,
            key: 'port-'+item.id_port ,
            toolTip: item.libelle,
            idObj: item.id_port,
            typeObj: 'Port',
        });
        this.userLayer.add(bunny);
      }
      this.userLayer.batchDraw();
  }

}

export default Vue2D ;
