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
                  this.kernel.network.deleteSelected() ;
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
      this.kernel.divMainMenu.style.display=(false)?'block':'none';
      this.kernel.divSearch.style.display=(false)?'block':'none';
      this.kernel.divParcourir.style.display=(false)?'block':'none';
      this.kernel.divErreurs.style.display=(false)?'block':'none';

      this.kernel.divUtilisateurs.style.display=(true)?'block':'none';

      let idUser = obj.idUser ;
      let nameUser = obj.name ;

      this.kernel.ariane.addLink({ 'class': 'userAction', 'methode': 'detailUtilisateur', 'obj': { 'typeObj': 'ListePortUser', 'idObj': idUser, 'idUser': idUser, 'name': nameUser }, 'libelle': 'Liste ports', 'tooltip': nameUser }) ;

      this.api.get(`/api/user/${idUser}/inventory`)
        .then((text) => {
          let content = `<HR><a href='#' onclick="mobile.eventUserAction({ 'typeObj': 'User', 'idObj': ${idUser} }, 'parcours','affichageOne')">${nameUser}</a><HR>` ;
          let portClic = '' ;
          let tooltip = '' ;

          for (let i=0; i< text.length; i++) {
            tooltip = '' ;
            text[i].metaDonnees.forEach((itemMeta,j) => {
              tooltip += itemMeta.libelle_meta + " : " + itemMeta.valeur + "</BR>";
            }) ;

            if (text[i].type_obj === 'Link') {
              if (tooltip !== '') {
                content += "&emsp;".repeat(text[i].niveau) ;
                content += "|" ;
                content += `<span href='#' class='A_tooltip'>&nbsp;<img class='infoImg'><span>${tooltip}</span></span>` ;
                content += "<BR>" ;
              }
            } else {
              if (text[i].niveau === 0 && text[i].type_obj === 'LinkUser') {
                if (tooltip !== '') {
                  content += "<BR>" ;
                  content += `<span href='#' class='A_tooltip'>&nbsp;<img class='infoImg'><span>${tooltip}</span></span>` ;
                }
                content += "<BR>" ;
              } else {
                if (text[i].niveau !== 0) {
                    content += "&emsp;".repeat(text[i].niveau) ;
                    content += "|--> " ;
                }

                if (text[i].extraDonnees[0].equipement_type === "PreQuadrupleur") {
                  content += "Quadrupleur" ;
                } else {
                  portClic = `<a href="#" onclick="mobile.eventUserAction({ 'idPort': ${text[i].id_obj}},'userAction','affichageDetailPort')">Port ${text[i].extraDonnees[0].libelle}</a>`
                  if (tooltip !== '') {
                    portClic += `<span href='#' class='A_tooltip'>&nbsp;<img class='infoImg'><span>${tooltip}</span></span>` ;
                  }
                  if (text[i].extraDonnees[0].equipement_type === "Quadrupleur") {
                    content += portClic;
                  } else {
                    content += text[i].extraDonnees[0].baie_libelle + " / " + text[i].extraDonnees[0].equipement_libelle ;
                    content += " (" + text[i].extraDonnees[0].equipement_type + ")" ;
                    content += " " + portClic ;
                  }
                }
                content += "<BR>" ;
              }
            }
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
      this.kernel.parcours.affichageOne({ 'typeObj': 'Port', 'idObj': idPort }) ;
    }


}

export default UserAction ;
