import nodefony from 'nodefony-client' ;

class MetaDonnees extends nodefony.Service {

  constructor(kernel) {
    super("metaDonnees",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.swal = this.kernel.swal ;
    this.log("Start") ;
  }

  addDonnees(obj) {
    let typeObj = obj.type_obj ;
    let idObj = obj.id_obj ;

    this.api.get(`/api/meta/${typeObj}/${idObj}`)
      .then((r) => {
        if (r.length === 0) {
          this.swal.fire({title: 'Plus de catégorie disponible', showConfirmButton: true, icon: 'info'}) ;
        } else {

          let listMeta = {} ;
          r.forEach((itemMeta,j) => {
            listMeta[itemMeta.id_meta] = itemMeta.libelle_meta;
          }) ;

          this.kernel.swal.mixin({
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2']
          }).queue([
            {
              input: 'select',
              title: 'Choisir une catégorie',
              text: '',
              inputOptions: listMeta
            },
            {
              input: 'text',
              title: 'Tapez la valeur',
              text: '',
              confirmButtonText: 'Valider',
            }
          ]).then((result) => {
            if (result.value) {
              if (result.value[0] && result.value[1]) {
                return this.api.get(`/api/meta/${typeObj}/${idObj}/${result.value[0]}`,{ params: {valeur: result.value[1]}})
                  .then((r) => {
                    let node ;
                    let myObj ;
                    if (typeObj.includes('Link')) {
                      node = false ;
                      myObj = this.kernel.network.body.data.edges.get(typeObj + "-" + idObj) ;
                    } else {
                      node = true ;
                      myObj = this.kernel.network.body.data.nodes.get(typeObj + "-" + idObj) ;
                    }
                    myObj.item.metaDonnees.push(r[0]) ;
                    if (node) {
                      this.kernel.network.canvas.body.nodes[myObj.id].options.title = `${this.kernel.network.canvas.body.nodes[myObj.id].options.title}${r[0].libelle_meta} : ${r[0].valeur}</BR>` ;
                      this.kernel.parcours.clickEventNode(this.kernel.network.body.data, myObj) ;
                    } else {
                      this.kernel.network.canvas.body.edges[myObj.id].title = `${this.kernel.network.canvas.body.edges[myObj.id].title}${r[0].libelle_meta} : ${r[0].valeur}</BR>` ;
                      this.kernel.parcours.clickEventEdge(this.kernel.network.body.data, myObj) ;
                    }
                })

              } else {
                return 'NOK' ;
              }
            } else {
              return 'NOK' ;
            }
          })

        }
    })
  }

  modifyDonnees(obj) {
    let typeObj = obj.type_obj ;
    let idObj = obj.id_obj ;
    let idMeta = obj.id_meta ;
    let libelleMeta = obj.libelle_meta ;
    let valeur = obj.valeur ;

    return this.swal.fire({title:'Modifier la catégorie : ' + libelleMeta, text: 'Laisser vide pour supprimer la catégorie', input: 'text', inputValue: valeur,
        showCancelButton: true, confirmButtonText: 'Enregistrer' })
      .then((newValeur) => {
          if (newValeur.isConfirmed) {
            return this.api.get(`/api/meta/${typeObj}/${idObj}/${idMeta}`,{ params: {valeur: newValeur.value}})
              .then((r) => {
                let node ;
                let myObj ;
                if (typeObj.includes('Link')) {
                  node = false ;
                  myObj = this.kernel.network.body.data.edges.get(typeObj + "-" + idObj) ;
                } else {
                  node = true ;
                  myObj = this.kernel.network.body.data.nodes.get(typeObj + "-" + idObj) ;
                }
                if (r.length === 0) {
                  myObj.item.metaDonnees.forEach((itemMeta,j) => {
                    if (itemMeta.id_meta === idMeta) {
                      myObj.item.metaDonnees.splice(j,1) ;
                    }
                  })
                  if (node) {
                    this.kernel.network.canvas.body.nodes[myObj.id].options.title = this.kernel.network.canvas.body.nodes[myObj.id].options.title.replace(libelleMeta + " : " + valeur + "</BR>","") ;
                    this.kernel.parcours.clickEventNode(this.kernel.network.body.data, myObj) ;
                  } else {
                    this.kernel.network.canvas.body.edges[myObj.id].title = this.kernel.network.canvas.body.edges[myObj.id].title.replace(libelleMeta + " : " + valeur + "</BR>","") ;
                    this.kernel.parcours.clickEventEdge(this.kernel.network.body.data, myObj) ;
                  }
                } else {
                  myObj.item.metaDonnees.forEach((itemMeta,j) => {
                    if (itemMeta.id_meta === idMeta) {
                      myObj.item.metaDonnees.splice(j,1) ;
                    }
                  })
                  myObj.item.metaDonnees.push(r[0]) ;
                  if (node) {
                    this.kernel.network.canvas.body.nodes[myObj.id].options.title = this.kernel.network.canvas.body.nodes[myObj.id].options.title.replace(libelleMeta + " : " + valeur + "</BR>",libelleMeta + " : " + newValeur.value + "</BR>") ;
                    this.kernel.parcours.clickEventNode(this.kernel.network.body.data, myObj) ;
                  } else {
                    this.kernel.network.canvas.body.edges[myObj.id].title = this.kernel.network.canvas.body.edges[myObj.id].title.replace(libelleMeta + " : " + valeur + "</BR>",libelleMeta + " : " + newValeur.value + "</BR>") ;
                    this.kernel.parcours.clickEventEdge(this.kernel.network.body.data, myObj) ;
                  }
                }
                return 'OK' ;
              })
            } else {
              return 'NOK' ;
            }
      })
  }

}

export default MetaDonnees ;
