import nodefony from 'nodefony-client' ;

class UserAction extends nodefony.Service {

  constructor (kernel) {
    super("userAction",kernel.container) ;
  }

  initialize(){
    this.memo = this.kernel.memo ;
    this.api = this.kernel.api ;
    this.tools = this.kernel.tools ;
    this.swal = this.kernel.swal ;
    this.userGraph = this.kernel.userGraph ;
    this.portGraph = this.kernel.portGraph ;
    this.portAction = this.kernel.portAction ;
    this.log("Start") ;
  }

  linkUserPort(obj){
    let idUser = obj.idUser ;
      if (this.memo.memoId == "") {
          this.swal.fire({title: "Pas d'origine définie", showConfirmButton: true, icon: 'error'}) ;
      } else {
        this.api.get(`/api/user/${idUser}/link/${this.memo.memoId}`)
        .then((r) => {
          if (r[0].resultat == 1) {
            this.swal.fire({title: 'Liaison réussie', showConfirmButton: true, icon: 'success'}) ;
            this.userGraph.affichageOne({ 'idUser': idUser }) ;
          } else {
            this.swal.fire({title: "Pas possible de réaliser la liaison", showConfirmButton: true, icon: 'error'}) ;
          }
        });
      }
  }

  unlinkUserPort(obj) {
    let idPort = obj.idPort ;
    this.api.get(`/api/port/${idPort}`)
    .then((p) => {
      if (p[0].id_user == "null") {
        this.swal.fire({title: "Pas d'utilisateur lié", showConfirmButton: true, icon: 'error'}) ;
      } else {
        let memo_p = p[0] ;
        this.swal.fire({title:"Confirmez-vous", text:"la suppression de la Liaison ?", showCancelButton: true, icon:'question'})
          .then((response) => {
            if (response.isConfirmed) {
              this.api.get(`/api/user/${memo_p.id_user}/unlink/${idPort}`)
              .then((r) => {
                if (r[0].resultat == 1) {
                  this.swal.fire({title: 'Suppression réussie', showConfirmButton: true, icon: 'success'}) ;
                  this.portGraph.affichageOne(idPort) ;
                } else {
                  this.swal.fire({title: "Pas possible de supprimer la liaison", showConfirmButton: true, icon: 'error'}) ;
                }
              });
            }
          });
      }
    });
  }

  inventoryUser(obj){
    let idUser = obj.idUser ;
    this.api.get(`/api/user/${idUser}/inventory`)
      .then((text) => {
        let content = '' ;
        for (let i=0; i< text.length; i++) {
          if (text[i].niveau === 0) {
            content = content + "<BR>" ;
          } else {
            if (text[i].commentaire_link !==  null) {
              content = content + "--".repeat(text[i].niveau - 1) ;
              content = content + "  " ;
              content = content + text[i].commentaire_link + "<BR>" ;
            }
            content = content + "--".repeat(text[i].niveau - 1) ;
            content = content + "|-" ;
          }
          if (text[i].type === "PreQuadrupleur") {
            content = content + "Quadrupleur" ;
          } else {
            if (text[i].type === "Quadrupleur") {
              content = content + "Port " + text[i].numero_port ;
            } else {
              content = content + text[i].nom_baie + " / " + text[i].description ;
              content = content + " (" + text[i].type + ")" ;
              content = content + "  -->  Port " + text[i].numero_port ;
              if (text[i].commentaire_port !== null ) {
                content = content + " (" + text[i].commentaire_port + ") " ;
              }
            }
          }
          content = content + "<BR>" ;
        }
        if (content === '') {
          content = 'Aucune arborescence...' ;
        }
        //this.kernel.swal.fire({title: "arborescence des ports de l'utilisateur",html: content, showCloseButton: true, showConfirmButton: false}) ;
        this.tools.openPopup(content,"arborescence des ports de l'utilisateur");

    });
  }

  modifyCommentPort(obj) {
    let idPort = obj.idPort ;
    let idUser = obj.idUser ;
    this.portAction.modifyComment(idPort)
      .then((r) => {
        if (r == 'OK') {
          this.userGraph.affichageOne({ 'idUser': idUser }) ;
        }
      })
  }

  modifyComment(obj) {
    let idUser = obj.idUser ;
    let idPort = obj.idPort ;
    let defaultComment = obj.comment ;
    if (defaultComment === 'null') {
      defaultComment = ''
    }
    this.swal.fire({title: 'Modifier le commentaire', input: 'text', inputValue: defaultComment,
        showCancelButton: true, confirmButtonText: 'Enregistrer' })
      .then((commentaire) => {
          if (commentaire.isConfirmed) {
            return this.api.get(`/api/user/${idUser}/port/${idPort}/comment`,{ params: {comment: commentaire.value}})
              .then((r) => {
                this.kernel.portGraph.affichageOne(idPort) ;
              })
            }
      })
  }

}

export default UserAction ;
