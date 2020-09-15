import nodefony from 'nodefony' ;

class PortAction extends nodefony.Service {

  constructor (kernel) {
    super("portAction",kernel.container) ;
  }

  initialize(){
    this.memo = this.kernel.memo ;
    this.api = this.kernel.api ;
    this.portGraph = this.kernel.portGraph ;
    this.swal = this.kernel.swal ;
    this.log("Start") ;
  }

  linkPort(idPort){
    if (this.memo.memoId == "") {
      //alert("Pas d'origine définie") ;
      this.swal.fire({title: "Pas d'origine définie", showConfirmButton: true, icon: 'error'}) ;
    } else {
      if (this.memo.memoId == idPort) {
          this.swal.fire({title: "Référence circulaire", showConfirmButton: true, icon: 'error'}) ;
      } else {
        this.api.get(`/port/${idPort}/link/${this.memo.memoId}`)
        .then((r) => {
          if (r[0].resultat == 1) {
            this.swal.fire({title: 'Liaison réussie', showConfirmButton: true, icon: 'success'}) ;
            this.portGraph.affichageOne(idPort) ;
          } else {
            this.swal.fire({title: "Pas possible de réaliser la liaison", showConfirmButton: true, icon: 'error'}) ;
          }
        });
      }
    }
  }

 unlinkPort(idPortA,idPortB) {
   this.api.get(`/port/${idPortA}/unlink/${idPortB}`)
     .then((r) => {
       if (r[0].resultat == 1) {
         this.swal.fire({title: 'Suppression réussie', showConfirmButton: true, icon: 'success'}) ;
         this.portGraph.affichageOne(idPortA) ;
       } else {
         this.swal.fire({title: "Pas possible de supprimer la liaison", showConfirmButton: true, icon: 'error'}) ;
       }
     })
  }

  addQuadrupleur(idPort) {
    this.swal.fire({title:"Confirmez-vous", text:"l'ajout d'un quadrupleur ?", showCancelButton: true, icon:'question'})
      .then((response) => {
        if (response.isConfirmed) {
          this.api.get('/quadrupleur/empty')
            .then((r) => {
              this.api.get(`/port/${idPort}/link/${r[0].id_port}`)
                .then((p) => {
                  this.portGraph.affichageOne(idPort) ;
                })
            });
          }
      })
  }

  modifyComment(idPort) {
    return this.swal.fire({title:'Modifier le commentaire', input: 'text',
        showCancelButton: true, confirmButtonText: 'Enregistrer' })
      .then((commentaire) => {
          if (commentaire.isConfirmed) {
            return this.api.get(`/port/${idPort}/comment`,{ params: {comment: commentaire.value}})
              .then((r) => {
                return 'OK' ;
              })
            } else {
              return 'NOK' ;
            }
      })
  }

  modifyCommentPort(obj) {
    let idPort = obj.idPort ;
    let refresh = obj.refresh ;
    this.modifyComment(idPort)
      .then((r) => {
        if ( r == 'OK' ) {
          if (refresh == 'All') {
            this.portGraph.affichageAll(idPort) ;
          } else {
            this.portGraph.affichageOne(idPort) ;
          }
        }
      })
  }

  modifyCommentLink(obj) {
    let idPort = obj.idPort ;
    let idPortSource = obj.idPortSource ;
    this.swal.fire({title:'Modifier le commentaire', input: 'text',
        showCancelButton: true, confirmButtonText: 'Enregistrer' })
      .then((commentaire) => {
          if (commentaire.isConfirmed) {
            this.api.get(`/port/${idPort}/link/${idPortSource}/comment`,{ params: {comment: commentaire.value}})
              .then((r) => {
                this.portGraph.affichageOne(idPort) ;
              })
          }
      })
  }

}

export default PortAction ;
