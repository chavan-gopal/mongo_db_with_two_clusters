// Using Node.js `require()`
const localDB = require('./local_db')
const externalDB = require('./external_db')


async function exec_local(localDB){
  await localDB.connect_local(localDB.url)
  await localDB.printRecord_local(localDB)
}

async function exec_external(externalDB){
  const conn = await externalDB.connect_ext(externalDB.url)
  await externalDB.printRecord_ext(conn, externalDB)
}

(async function run() {
  console.log("=================LOCAL=====================")
  await exec_local(localDB)
  console.log("===========================================")
  console.log("=================External==================")
  await exec_external(externalDB)
  console.log("===========================================")
})()




