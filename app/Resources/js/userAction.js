import nodefony from 'nodefony-client' ;

class UserAction extends nodefony.Service {

  constructor (kernel) {
    super("userAction",kernel.container) ;
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
  }

  listenEvents() {
    let select = document.getElementById('utilisateursLink') ;
    select.addEventListener('click', (event) => {
      this.listeUtilisateurs() ;
    });

    let imgBack = document.getElementById("backfromUtilisateurs") ;
    imgBack.addEventListener('click', (event) => {
              this.backMenu() ;
    });
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divUtilisateurs.style.display=(false)?'block':'none';
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
            this.kernel.parcours.affichageOne({ 'typeObj': 'User', 'idObj': idUser }) ;
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
                  // this.kernel.network.deleteSelected() ;
                  let actionZone = document.getElementById("actionPortOne") ;
                  actionZone.innerHTML = '' ;
                  this.swal.fire({title: 'Suppression réussie', showConfirmButton: true, icon: 'success'}) ;
                } else {
                  this.swal.fire({title: "Pas possible de supprimer la liaison", showConfirmButton: true, icon: 'error'}) ;
                }
              });
            }
          });
      }
    });
  }

  listeUtilisateurs() {
      this.divMainMenu.style.display=(false)?'block':'none';
      this.divUtilisateurs.style.display=(true)?'block':'none';

      this.api.get('/api/user')
        .then((r) => {
          let content = '' ;
          for (let i=0; i< r.length; i++) {
            content = content + `<a href='#' onclick="mobile.eventUserAction( {'idUser': ${r[i].id_obj}, 'name': '${r[i].name}' },'userAction','detailUtilisateur')">${r[i].name}</a><br>` ;
          }
          if (content === '') {
            content = 'Aucun utilisateur...' ;
          }
          let contenu = document.getElementById('idUtilisateursList') ;
          contenu.innerHTML = content ;
      });
    }

    detailUtilisateur(obj) {
      this.divMainMenu.style.display=(false)?'block':'none';
      this.divUtilisateurs.style.display=(true)?'block':'none';
      this.divParcourir.style.display=(false)?'block':'none';

      let idUser = obj.idUser ;
      let nameUser = obj.name ;
      this.api.get(`/api/user/${idUser}/inventory`)
        .then((text) => {
          let content = `<HR><a href='#' onclick="mobile.eventUserAction({ 'typeObj': 'User', 'idObj': ${idUser} }, 'parcours','affichageOne')">${nameUser}</a><HR>` ;
          let portLink = '' ;
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
              portLink = `<a href="#" onclick="mobile.eventUserAction({ 'idPort': ${text[i].id_port}},'userAction','affichageDetailPort')">Port ${text[i].numero_port}</a>`
              if (text[i].type === "Quadrupleur") {
                content = content + portLink;
              } else {
                content = content + text[i].nom_baie + " / " + text[i].description ;
                content = content + " (" + text[i].type + ")" ;
                content = content + "  -->  " + portLink ;
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
          let contenu = document.getElementById('idUtilisateursList') ;
          contenu.innerHTML = content ;
      });
    }

    affichageDetailPort(obj) {
      let idPort = obj.idPort ;
      this.divUtilisateurs.style.display=(false)?'block':'none';
      this.kernel.parcours.affichageOne({ 'typeObj': 'Port', 'idObj': idPort }) ;
    }


}

export default UserAction ;
