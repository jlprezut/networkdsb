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

    this.listType = [ 'Switch','Bandeau','Quadrupleur','PreQuadrupleur','DSLAM','Routeur','Serveur','InterBaie','Divers','OLT','Splitter','Console']
    this.typeTexture = []
    this.listType.forEach((item, i) => {
      this.typeTexture[item] = new Image();
      this.typeTexture[item].src = '/app/images/' + item + '.png';
    });

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
    this.shapesLayer.addName("LayerShape") ;
    this.tooltipLayer = new Konva.Layer();
    this.tooltipLayer.addName("LayerTooltip") ;
    this.userLayer = new Konva.Layer() ;
    this.userLayer.addName("LayerUser") ;
    this.focusLayer = new Konva.Layer() ;
    this.focusLayer.addName("LayerFocus") ;

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
    this.RJ45ConnectedTexture.kernel = this.kernel ;

    this.RJ45ErrorTexture = new Image();
    this.RJ45ErrorTexture.kernel = this.kernel ;

    this.RJ45DownTexture = new Image();
    this.RJ45DownTexture.kernel = this.kernel ;

    this.fibreTexture = new Image();
    this.fibreTexture.onload = function () {
      this.kernel.vue2D._handleTextureLoadedFibre();
    };
    this.fibreTexture.kernel = this.kernel ;

    this.fibreConnectedTexture = new Image();
    this.fibreConnectedTexture.kernel = this.kernel ;

    this.fibreErrorTexture = new Image();
    this.fibreErrorTexture.kernel = this.kernel ;

    this.fibreDownTexture = new Image();
    this.fibreDownTexture.kernel = this.kernel ;

    this.pointeurTexture = new Image();

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
    this.stage.add(this.focusLayer);

    this.stage.on('mouseover', function (evt) {
      var shape = evt.target;
      if (shape && shape.attrs.key) {
          var t = this.attrs.kernel.vue2D.tooltip.getTag() ;
          t.show() ;
          this.attrs.kernel.vue2D.tooltipLayer.draw() ;
      }
    });

    this.stage.on('mouseout', function (evt) {
      var shape = evt.target;
      if (shape) {
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
                name: "objet-" + area.id_objet,
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

                    this.api.get(`/api/zone/baie/${idZone}`)
                        .then((listBaie) => {
                            listBaie.forEach((baie, i) => {
                              var pointeur = new Konva.Rect({
                                  x: baie.pos_x,
                                  y: baie.pos_y,
                                  width: baie.largeur,
                                  height: baie.hauteur,
                                  stroke: 'green',
                                  strokeWidth: 1,
                                  name: 'Baie-' + baie.id_baie,
                                  toolTip: baie.nom_baie,
                                  opacity: 1,
                                  fill: 'white',
                                  key: "Baie-" + baie.id_baie,
                                  idObj: baie.id_baie,
                                  typeObj: 'Baie',

                              });
                              this.userLayer.add(pointeur)
                            }) ;

                            this.api.get(`/api/zone/equipement/${idZone}`)
                                .then((listEquipement) => {
                                    var offsetX = 0 ;
                                    var offsetY = 0 ;
                                    var id_baie = 0 ;
                                    listEquipement.forEach((equipement, i) => {
                                      if (equipement.id_baie !== id_baie) {
                                        offsetX = 0 ;
                                        offsetY = 0 ;
                                        id_baie = equipement.id_baie ;
                                      } else {
                                        offsetX += 22 ;
                                        if (offsetX +22 > equipement.largeur) {
                                          offsetX = 0 ;
                                          offsetY += 22 ;
                                        }
                                      }
                                      var pointeur = new Konva.Image({
                                          image: mobile.vue2D.typeTexture[equipement.type],
                                          x: equipement.pos_x + offsetX,
                                          y: equipement.pos_y + offsetY,
                                          width: 22,
                                          height: 22,
                                          name: 'Equipement-' + equipement.id_equipement,
                                          key: 'Equipement-' + equipement.id_equipement,
                                          toolTip: equipement.description,
                                          idObj: equipement.id_equipement,
                                          typeObj: 'Equipement',
                                      });
                                      this.userLayer.add(pointeur)
                                    }) ;

                                    this.userTexture.src = '/app/images/user.png';

                                    this.RJ45ConnectedTexture.src = '/app/images/RJ45-connected.png';
                                    this.RJ45ErrorTexture.src = '/app/images/RJ45-error.png';
                                    this.RJ45DownTexture.src = '/app/images/RJ45-down.png';

                                    this.fibreConnectedTexture.src = '/app/images/Fibre-connected.png';
                                    this.fibreErrorTexture.src = '/app/images/Fibre-error.png';
                                    this.fibreDownTexture.src = '/app/images/Fibre-down.png';

                                    this.rj45Texture.src = '/app/images/RJ45.png';
                                    this.fibreTexture.src = '/app/images/Fibre.png';
                                    this.imageObj.src = '/app/images/PlanEtg1.png';

                                    this.pointeurTexture.src = '/app/images/fleche.png';

                                    this.stage.add(this.shapesLayer);

                                    this.planetsLayer.moveToBottom();
                                    this.userLayer.moveToTop();
                                    this.focusLayer.moveToTop() ;
                                    this.tooltipLayer.moveToTop() ;

                                    var scrollContainer = document.getElementById('scroll-container');
                                    scrollContainer.addEventListener('scroll', this.repositionStage);
                                    this.repositionStage();

                                    // one revolution per 4 seconds
                                    var angularSpeed = 90;
                                    var anim = new Konva.Animation(function (frame) {
                                      var angleDiff = (frame.timeDiff * angularSpeed) / 1000;
                                      var nodeList = mobile.vue2D.stage.find(".Fleche")
                                      nodeList.forEach((fleche, i) => {
                                        fleche.rotate(angleDiff);
                                      });
                                      var memoList = mobile.vue2D.stage.find(".Memo")
                                      memoList.forEach((memoNode, i) => {
                                        var newAngle = (memoNode.angle() + 5) ;
                                        if (newAngle > 360) {
                                          newAngle = 0 ;
                                        }
                                        memoNode.angle(newAngle) ;
                                        memoNode.rotate(angleDiff) ;
                                      });

                                    }, this.focusLayer);

                                    anim.start();
                            }) ;
                    }) ;
            }) ;
    }) ;
  }

  listenEvents() {
    let select = document.getElementById('vue2DLink') ;
    select.addEventListener('click', (event) => {
      this.kernel.vue2D.affichage(null) ;
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

  affichage(obj) {

    let idObj = null ;
    let typeObj = null ;
    let name = null ;

    if (obj !== null) {
      idObj = obj.idObj ;
      typeObj = obj.typeObj ;
      name = obj.name ;
    }

    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divErreurs.style.display=(false)?'block':'none';
    this.kernel.divSearch.style.display=(false)?'block':'none';
    this.kernel.divParcourir.style.display=(false)?'block':'none';

    this.kernel.divVue2D.style.display=(true)?'block':'none';

    this.kernel.ariane.addLink({ 'class': 'vue2D', 'methode': 'affichage', 'obj': { 'obj':obj, idObj:idObj, typeObj:'UserVue2D' }, 'libelle': 'Vue 2D', 'tooltip': name }) ;

    var redRect = mobile.vue2D.stage.find('.Fleche')
    redRect.forEach((obj, i) => {
        obj.destroy() ;
    });

    var redRect = mobile.vue2D.stage.find('.Memo')
    redRect.forEach((obj, i) => {
        obj.destroy() ;
    });

    var focusLayer = mobile.vue2D.stage.find('.LayerFocus')

    var dx = -500 ;
    var dy = -500 ;

    if (idObj === null) {
      dx = dx + 500  ;
      dy = dy + 500 ;
    } else {
      var mys = mobile.vue2D.stage.find('.' + typeObj + '-' + idObj) ;

      mys.each(function (shape) {
          dx = dx + shape.attrs.x - 200  ;
          dy = dy + shape.attrs.y - 200 ;

          var pointeur = new Konva.Image({
              image: mobile.vue2D.pointeurTexture,
              x: shape.attrs.x + (shape.attrs.width/2),
              y: shape.attrs.y + (shape.attrs.height/2),
              width: 16,
              height: 16,
              name: 'Fleche',
              offset: {
                x: -Math.max(shape.attrs.width/2,shape.attrs.height/2),
                y: 0,
              },
          });
          focusLayer.add(pointeur)
      })
    }

    let listMemo = this.kernel.memo.getMemoTab() ;
    listMemo.forEach((item, i) => {
      var mys = mobile.vue2D.stage.find('.' + item.type_obj + '-' + item.id_obj) ;

      mys.each(function (shape) {
        var pointeur = new Konva.Arc({
            x: shape.attrs.x + (shape.attrs.width/2),
            y: shape.attrs.y + (shape.attrs.height/2),
            radius: Math.max(shape.attrs.width/2,shape.attrs.height/2),
            innerRadius: Math.max(shape.attrs.width/2,shape.attrs.height/2),
            outerRadius: Math.max(shape.attrs.width/2,shape.attrs.height/2),
            angle: 60,
            stroke: 'red',
            strokeWidth: 4,
            name: 'Memo',
        });
        focusLayer.add(pointeur)
      });
    }) ;

    var scrollContainer = document.getElementById('scroll-container');
    scrollContainer.scrollLeft = dx + this.padding;
    scrollContainer.scrollTop = dy + this.padding;

    this.repositionStage() ;

  }

  repositionStage() {
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
            key: 'User-'+item.id_user,
            name: 'User-'+item.id_user,
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
        if (item.up === 0) {
          texture = this.RJ45DownTexture ;
        } else {
          if (item.error === 1) {
            texture = this.RJ45ErrorTexture ;
          } else {
            if (item.nb_link>0) {
              texture = this.RJ45ConnectedTexture ;
            }
          }
        }
        var bunny = new Konva.Image({
            image: texture,
            x: item.pos_x+(j*16)*decalage_x,
            y: item.pos_y+(j*16)*decalage_y,
            width: 16,
            height: 16,
            key: 'Port-'+item.id_port ,
            name: 'Port-'+item.id_port ,
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
        if (item.up === 0) {
          texture = this.fibreDownTexture ;
        } else {
          if (item.error === 1) {
            texture = this.fibreErrorTexture ;
          } else {
            if (item.nb_link>0) {
              texture = this.fibreConnectedTexture ;
            }
          }
        }

        var bunny = new Konva.Image({
            image: texture,
            x: item.pos_x+(j*16)*decalage_x + 16*decalage_y,
            y: item.pos_y+(j*16)*decalage_y + 16*decalage_x,
            width: 16,
            height: 16,
            key: 'Port-'+item.id_port ,
            name: 'Port-'+item.id_port ,
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
