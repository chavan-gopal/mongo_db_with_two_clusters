// Represent our existing mongodb cluster
let mongoose = require('mongoose')
let Schema = mongoose.Schema

const Heartbeat = new Schema({
  key: {type: String, required: true, unique: true},
  timestamp: {type: Date, required: true},
  uptime: {type: Number}
})

function getLocalDBUrl(){
  const USER = 'gopal'
  const PASSWORD = 'Gopal'
  const HOST = 'localhost:27017'
  const DB = 'integrator'
  const url = `mongodb://${USER}:${PASSWORD}@${HOST}/${DB}`
  return url
}
  
const tableName = 'heartbeats'

async function connect_local(url) {
  // we use the same method to connect to cluster as we do in adaptor-model repo
  await mongoose.connect(url)
}

async function printRecord_local(details) {
  const {tableName, schema, condition} = details
  const MyModel = mongoose.model(tableName, schema)
  const res = await MyModel.findOne(condition)
  console.log(res)
}
  
module.exports = {
  url: getLocalDBUrl(),
  schema: Heartbeat,
  condition: {key: "Gopals-MBP"},
  tableName,
  connect_local,
  printRecord_local
}

