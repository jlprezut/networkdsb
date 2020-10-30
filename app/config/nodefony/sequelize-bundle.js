/**
 *  OVERRIDE ORM SEQUELIZE BUNDLE
 *
 *       @see SEQUELIZE BUNDLE config for more options
 *       @more options http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html
 *
 *       Nodefony Database Management
 *        dialect :               'mysql'|'sqlite'|'postgres'|'mssql'
 *
 *       By default nodefony create  connector name nodefony ( driver sqlite )
 *       for manage Sessions / Users
 *
 *       For mysql/mariadb create database nodefony before :
 *
 *       $ nodefony sequelize:create:database [force]  => Create database
 *
 *       Synchronize entities :
 *       $ nodefony sequelize:sync [force]    => Create tables index ...
 *
 *       Here create new databases connectors
 *       and use for sync connectors :
 *       nodefony sequelize:sync
 *
 *        connectors: {
 *         nodefony: {
 *           driver: "mysql",
 *           dbname: 'nodefony',
 *           username: 'nodefony',
 *           password: 'nodefony',
 *           options: {
 *             dialect: "mysql",
 *             host: "localhost",
 *             port: "3306",
 *             pool:{
 *               max:   5,
 *               min:   0,
 *               idle:  10000,
 *               acquire:60000
 *             }
 *           }
 *         }
 *
 */
 //console.log(process.env && process.env.NODE_ENV === "production", kernel.environment, kernel.debug ,kernel)
 let dbname = "networkdsb_DEV";
if ( process.env && process.env.NODE_ENV === "production"){
  dbname = "networkdsb_DEV";
}

module.exports = {
  debug: false,
  connectors: {
              dsb: {
                driver: "mysql",
                dbname: dbname,
                username: 'networkUser',
                password: 'networkUser',
                options: {
                  dialect: "mysql",
                  host: "192.168.100.30",
                  port: "3306",
                  pool:{
                    max:   5,
                    min:   0,
                    idle:  10000,
                    acquire:60000
                  }
                }
              }
            }
};
