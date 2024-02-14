// Using Node.js `require()`
const localDB = require('./local_db')
const externalDB = require('./external_db')

let mongoose = require('mongoose')
// plugin for adding createdAt
mongoose.plugin(require('./dateFields_celigo_plugin'))

async function exec_local(localDB){
  await localDB.connect_local(localDB.url)
  await localDB.printRecord_local()
  await localDB.insertRecs_local()
}

async function exec_external(externalDB){
  const conn = await externalDB.connect_ext(externalDB.url)
  await externalDB.printRecord_ext(conn, externalDB)
  await externalDB.insertRecs_ext(conn)
}

(async function run() {
  console.log("=================LOCAL=====================")
  await exec_local(localDB)
  console.log("===========================================")
  console.log("=================External==================")
  await exec_external(externalDB)
  console.log("===========================================")
})()
