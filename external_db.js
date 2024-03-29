// Represent new mongo db cluster
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const Account = new Schema({
  account_id: Number,
  limit: Number,
  products: Schema.Types.Mixed
})

  
function getExternalDBUrl(){
  const USER = 'get_your_own'
  const PASSWORD = 'get_your_own'
  const HOST = 'get_your_own'
  const DB = 'get_your_own'
  const url = `mongodb+srv://${USER}:${PASSWORD}@${HOST}/${DB}?retryWrites=true&w=majority`
  return url
}

const tableName = 'accounts'
const condition = { account_id: 371138 }

async function connect_ext(url) {
  // Here we make use of createConnection method, instead of connect method
  // connect method would directly update mongoose object, where as
  // createConnection method would not update mongoose object, it creates a new and returs it
  const conn = await mongoose.createConnection(url)
  return conn
}

async function printRecord_ext(conn) {
  const MyModel = conn.model(tableName, Account)
  const res = await MyModel.findOne(condition)
  console.log(res)
}

async function insertRecs_ext(conn) {
  const recs = [{
    account_id: 999901,
    limit: 10000,
    products: ['a', 'b']
  }]
  const MyModel = conn.model(tableName, Account)
  const res = await MyModel.insertMany(recs)
  console.log(res)
}

module.exports = {
  url: getExternalDBUrl(),
  schema: Account,
  condition,
  tableName,
  connect_ext,
  printRecord_ext,
  insertRecs_ext
}