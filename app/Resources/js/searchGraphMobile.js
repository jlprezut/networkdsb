import nodefony from 'nodefony-client' ;

class SearchGraphMobile extends nodefony.Service{

  constructor(kernel) {
    super('searchGraphMobile',kernel.container);
  }

  initialize() {
    this.api = this.kernel.api ;
    this.divMainMenu = this.kernel.divMainMenu ;
    this.divSearch = this.kernel.divSearch ;
    this.portGraph = this.kernel.portGraph ;
    this.divParcourir = this.kernel.divParcourir ;
    this.swal = this.kernel.swal ;
    this.listenEvents() ;
    this.log("Start") ;
  }

  listenEvents() {
    let select = document.getElementById('searchLink') ;
    select.addEventListener('click', (event) => {
              this.prepareSearch() ;
    });

    let imgBack = document.getElementById("backfromSearch") ;
    imgBack.addEventListener('click', (event) => {
              this.backMenu() ;
    });

    let goSearch = document.getElementById("goSearch") ;
    goSearch.addEventListener('click', (event) => {
              this.goSearch() ;
    });

    let texteSearch = document.getElementById("texteSearch") ;
    texteSearch.addEventListener('keydown', (event) => {
              if (event.key === 'Enter') {
                this.goSearch() ;
              }
    })
  }

  showSearchObj(obj) {
    let idObj = obj.idObj ;
    let typeObj = obj.typeObj ;

    this.kernel.ariane.addLink({ 'class': 'searchGraph', 'methode': 'linkSearch', 'obj': { 'typeObj': 'Search', 'idObj': document.getElementById("texteSearch").value }, 'libelle': 'Search', 'tooltip': document.getElementById("texteSearch").value }) ;
    this.kernel.parcours.affichageOne({ 'typeObj': typeObj, 'idObj': idObj }) ;
  }

  backMenu() {
    this.divMainMenu.style.display=(true)?'block':'none';
    this.divSearch.style.display=(false)?'block':'none';
  }

  goSearch() {
    let texteSearch = document.getElementById("texteSearch") ;
    if (texteSearch.value === "") {
      this.swal.fire({title: "Rien à chercher", showConfirmButton: true, icon: 'error'}) ;
      return ;
    }
    this.listeSearch(texteSearch.value) ;
  }

  linkSearch(obj) {
    this.prepareSearch() ;
    document.getElementById("texteSearch").value = obj.idObj ;
    this.goSearch() ;
  }

  prepareSearch() {
    this.kernel.divMainMenu.style.display=(false)?'block':'none';
    this.kernel.divUtilisateurs.style.display=(false)?'block':'none';
    this.kernel.divParcourir.style.display=(false)?'block':'none';
    this.kernel.divErreurs.style.display=(false)?'block':'none';

    this.kernel.divSearch.style.display=(true)?'block':'none';

    let texteSearch = document.getElementById("texteSearch") ;
    texteSearch.value = "" ;
    let contenu = document.getElementById('idSearchList') ;
    contenu.innerHTML = "" ;
  }

  listeSearch(texteSearch){
    this.api.get('/api/search',{ params: {texte: texteSearch}})
      .then((r) => {
        let content = '' ;
        for (let i=0; i< r.length; i++) {
          if (r[i].type_obj.includes('Link')) {
            content = content + `<span class='SpanLink' onclick="mobile.eventUserAction({ 'typeObj' : '${r[i].extraDonnees[0].type_id_from}', 'idObj': ${r[i].extraDonnees[0].id_from} },'searchGraph','showSearchObj')">` ;
            content += `${r[i].type_obj} | ` ;
            if (r[i].extraDonnees[0].parents_from !== '') {
              content += `[${r[i].extraDonnees[0].parents_from}] ` ;
            }
            content += `${r[i].extraDonnees[0].type_id_from} (${r[i].extraDonnees[0].libelle_from}) <-> `
            if (r[i].extraDonnees[0].parents_to !== '') {
              content += `[${r[i].extraDonnees[0].parents_to}] ` ;
            }
            content += `${r[i].extraDonnees[0].type_id_to}  (${r[i].extraDonnees[0].libelle_to})` ;
          } else {
            content = content + `<span class='SpanLink' onclick="mobile.eventUserAction({ 'typeObj' : '${r[i].type_obj}', 'idObj': ${r[i].id_obj} },'searchGraph','showSearchObj')">` ;
            if (r[i].extraDonnees[0].parents !== '') {
              content += `[${r[i].extraDonnees[0].parents}] ` ;
            }
            content += `${r[i].type_obj} (${r[i].extraDonnees[0].libelle})` ;
          }
          content += ` --> match [${r[i].valeur}]`
          content += `</span><br>` ;
        }
        if (content === '') {
          content = 'Aucun résultat...' ;
        }
        let contenu = document.getElementById('idSearchList') ;
        contenu.innerHTML = content ;
    });
  }

}

export default SearchGraphMobile;
