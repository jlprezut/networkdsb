import nodefony from 'nodefony-client' ;

class FiltreListe extends nodefony.Service {

  constructor(kernel) {
    super("filtreListe",kernel.container) ;
  }

  initialize() {
    this.api = this.kernel.api ;
    this.userGraph = this.kernel.userGraph ;
    this.siteGraph = this.kernel.siteGraph ;
    this.salleGraph = this.kernel.salleGraph ;
    this.baieGraph = this.kernel.baieGraph ;
    this.equipementGraph = this.kernel.equipementGraph ;
    this.portGraph = this.kernel.portGraph ;
    this.listenEvents() ;
    this.log("Start") ;
  }

  listenEvents(){
    let select = document.getElementById('listeUser') ;
    select.addEventListener('change', (event) => {
              this.filtreUser() ;
    });

    select = document.getElementById('filterUser') ;
    select.addEventListener('click', (event) => {
              this.filtreUser() ;
    });

    select = document.getElementById('listeSite') ;
    select.addEventListener('change', (event) => {
              this.filtreSite() ;
    });

    select = document.getElementById('filterSite') ;
    select.addEventListener('click', (event) => {
              this.filtreSite() ;
    });

    select = document.getElementById('listeSalle') ;
    select.addEventListener('change', (event) => {
              this.filtreSalle() ;
    });

    select = document.getElementById('filterSalle') ;
    select.addEventListener('click', (event) => {
              this.filtreSalle() ;
    });

    select = document.getElementById('listeBaie') ;
    select.addEventListener('change', (event) => {
              this.filtreBaie() ;
    });

    select = document.getElementById('filterBaie') ;
    select.addEventListener('click', (event) => {
              this.filtreBaie() ;
    });

    select = document.getElementById('listeEquipement') ;
    select.addEventListener('change', (event) => {
              this.filtreEquipement() ;
    });

    select = document.getElementById('filterEquipement') ;
    select.addEventListener('click', (event) => {
              this.filtreEquipement() ;
    });

    select = document.getElementById('listePort') ;
    select.addEventListener('change', (event) => {
              this.filtrePort() ;
    });

    select = document.getElementById('filterPort') ;
    select.addEventListener('click', (event) => {
              this.filtrePort() ;
    });

  }

  populateOption(url,idOption) {
    this.api.get(url)
      .then((r) => {
        var  select = document.getElementById(idOption) ;
        var opt ;
        for (let i=0; i< r.length; i++) {
          opt = document.createElement('option') ;
          opt.value = r[i].id ;
          opt.innerHTML = r[i].label ;
          select.appendChild(opt) ;
        }
    });
  }

  unPopulateOption(idOption) {
    var select = document.getElementById(idOption) ;
    select.selectedIndex = 0 ;
    var option = select.getElementsByTagName("option");
    var Length = option.length;
    for (let i=1;i<Length;i++) {
      select.removeChild(option[1]) ;
    }
  }

  filtreUser() {
    document.getElementById("listeSite").selectedIndex = 0 ;
    this.unPopulateOption('listeSalle');
    this.unPopulateOption('listeBaie');
    this.unPopulateOption('listeEquipement');
    this.unPopulateOption('listePort') ;
    let choixUser = document.getElementById("listeUser") ;
    if (choixUser.selectedIndex == 0) {
      this.userGraph.affichageAll() ;
    } else {
      let idUser = choixUser.options[choixUser.selectedIndex].value ;
      this.userGraph.affichageOne({ 'idUser': idUser }) ;
    }
  }

  filtreSite() {
    document.getElementById("listeUser").selectedIndex = 0 ;
    this.unPopulateOption('listeSalle');
    this.unPopulateOption('listeBaie');
    this.unPopulateOption('listeEquipement');
    this.unPopulateOption('listePort') ;
    let choixSite = document.getElementById("listeSite") ;
    if (choixSite.selectedIndex == 0) {
      this.siteGraph.affichageAll() ;
    } else {
      let idSite = choixSite.options[choixSite.selectedIndex].value ;
      this.siteGraph.affichageOne(idSite) ;
      this.populateOption(`/api/filter/site/${idSite}/salle`, 'listeSalle') ;
    }
  }

  filtreSalle() {
    document.getElementById("listeUser").selectedIndex = 0 ;
    this.unPopulateOption('listeBaie');
    this.unPopulateOption('listeEquipement');
    this.unPopulateOption('listePort') ;
    let choixSalle = document.getElementById("listeSalle") ;
    let choixSite = document.getElementById("listeSite") ;
    if (choixSalle.selectedIndex == 0) {
      if (choixSite.selectedIndex == 0) {
        this.salleGraph.affichageAll() ;
      } else {
        this.filtreSite() ;
      }
    } else {
      let idSalle = choixSalle.options[choixSalle.selectedIndex].value ;
      let idSite =choixSite.options[choixSite.selectedIndex].value ;
      this.salleGraph.affichageOne(idSalle) ;
      this.populateOption(`/api/filter/site/${idSite}/salle/${idSalle}/baie`, 'listeBaie') ;
    }
  }

  filtreBaie() {
    document.getElementById("listeUser").selectedIndex = 0 ;
    this.unPopulateOption('listeEquipement');
    this.unPopulateOption('listePort') ;
    let choixBaie = document.getElementById("listeBaie") ;
    let choixSalle = document.getElementById("listeSalle") ;
    if (choixBaie.selectedIndex == 0) {
      if (choixSalle.selectedIndex == 0) {
        this.baieGraph.affichageAll() ;
      } else {
        this.filtreSalle() ;
      }
    } else {
      let idBaie = choixBaie.options[choixBaie.selectedIndex].value ;
      let idSalle = choixSalle.options[choixSalle.selectedIndex].value ;
      this.baieGraph.affichageOne(idBaie) ;
      this.populateOption(`/api/filter/baie/${idBaie}/equipement`, 'listeEquipement') ;
    }
  }

  filtreEquipement() {
    document.getElementById("listeUser").selectedIndex = 0 ;
    this.unPopulateOption('listePort') ;
    let choixEquipement = document.getElementById("listeEquipement") ;
    let choixBaie = document.getElementById("listeBaie") ;
    if (choixEquipement.selectedIndex == 0) {
      if (choixBaie.selectedIndex > 0){
        this.filtreBaie() ;
      }
    } else {
      let idEquipement = choixEquipement.options[choixEquipement.selectedIndex].value
      let idBaie = choixBaie.options[choixBaie.selectedIndex].value ;
      this.equipementGraph.affichageOne(idEquipement);
      this.populateOption(`/api/filter/baie/${idBaie}/equipement/${idEquipement}/port`,'listePort') ;
    }
  }

  filtrePort() {
    let choixPort = document.getElementById("listePort") ;
    let choixEquipement = document.getElementById("listeEquipement") ;
    if (choixPort.selectedIndex == 0) {
      if (choixEquipement.selectedIndex > 0) {
        this.filtreEquipement() ;
      }
    } else {
      let idPort = choixPort.options[choixPort.selectedIndex].value ;
      this.portGraph.affichageOne(idPort) ;
    }
  }

}

export default FiltreListe;
