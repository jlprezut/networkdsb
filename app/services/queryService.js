
class query extends nodefony.Service {

  constructor(container,  sequelize){
    super("query", container);
    this.dsbdb = sequelize.getConnection("dsb");
    sequelize.on("onOrmReady", ()=>{
      this.dsbdb = sequelize.getConnection("dsb");
    })

  }

  callQuery(url) {
    return this.dsbdb.query(url)
              .then((recordSet) => {
                return recordSet[0] ; // this.cleanResult(recordSet[0]);
              })
              .catch((error) => {
                throw error ;
              }) ;
  }

  callProcedure(url) {
    return this.dsbdb.query(url)
              .then((recordSet) => {
                return recordSet ; // this.cleanResult(recordSet) ;
              })
              .catch((error) => {
                throw error ;
              }) ;
  }
/*
  cleanResult(result) {
    let work = JSON.parse(JSON.stringify(result)) ;
    //console.log(work) ;
    for (let i=0; i<result.length; i++) {
      if (work[i].linkWith !== undefined) {
        work[i].linkWith = JSON.parse(work[i].linkWith) ;
      }
    }
    return work ;
  }
*/
};

module.exports = query ;
