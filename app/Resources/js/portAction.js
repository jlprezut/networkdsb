import nodefony from 'nodefony-client' ;

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

  linkPort(obj){
    let idPort = obj.idPort ;
    if (this.memo.memoId == "") {
      //alert("Pas d'origine définie") ;
      this.swal.fire({title: "Pas d'origine définie", showConfirmButton: true, icon: 'error'}) ;
    } else {
      if (this.memo.memoId == idPort) {
          this.swal.fire({title: "Référence circulaire", showConfirmButton: true, icon: 'error'}) ;
      } else {
        this.api.get(`/api/port/${idPort}/link/${this.memo.memoId}`)
        .then((r) => {
          if (r[0].resultat == 1) {
            this.swal.fire({title: 'Liaison réussie', showConfirmButton: true, icon: 'success'}) ;
            this.kernel.parcours.affichageOne('Port',idPort) ;
          } else {
            this.swal.fire({title: "Pas possible de réaliser la liaison", showConfirmButton: true, icon: 'error'}) ;
          }
        });
      }
    }
  }

 unlinkPort(obj) {
   let idPort1 = obj.idPort1 ;
   let idPort2 = obj.idPort2 ;
   this.api.get(`/api/port/${idPort1}/unlink/${idPort2}`)
     .then((r) => {
       if (r[0].resultat == 1) {
         this.kernel.network.deleteSelected() ;
         let actionZone = document.getElementById("actionPortOne") ;
         actionZone.innerHTML = '' ;
         this.swal.fire({title: 'Suppression réussie', showConfirmButton: true, icon: 'success'}) ;
       } else {
         this.swal.fire({title: "Pas possible de supprimer la liaison", showConfirmButton: true, icon: 'error'}) ;
       }
     })
  }

  addQuadrupleur(obj) {
    let idPort = obj.idPort ;
    this.swal.fire({title:"Confirmez-vous", text:"l'ajout d'un quadrupleur ?", showCancelButton: true, icon:'question'})
      .then((response) => {
        if (response.isConfirmed) {
          this.api.get('/api/quadrupleur/empty')
            .then((r) => {
              this.api.get(`/api/port/${idPort}/link/${r[0].id_port}`)
                .then((p) => {
                  this.kernel.parcours.affichageOne({ 'typeObj': 'Port', 'idObj': idPort }) ;
                })
            });
          }
      })
  }

}

export default PortAction ;
