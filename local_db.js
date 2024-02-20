// Represent our existing mongodb cluster
let mongoose = require('mongoose')
let Schema = mongoose.Schema

mongoose.plugin(require('./dateFields_celigo_plugin'))

const Heartbeat = new Schema({
  key: {type: String, required: true, unique: true},
  timestamp: {type: Date, required: true},
  uptime: {type: Number},
  deletedAt: { type: Date, default: null, index: { expireAfterSeconds: 0 } }
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

const condition = {key: "Gopals-MBP"}

async function connect_local(url) {
  // we use the same method to connect to cluster as we do in adaptor-model repo
  await mongoose.connect(url)
}

function modelWrapper() {
  let instance;
  return {
    getInstance: function() {
      if(instance) return instance
      instance = mongoose.model(tableName, Heartbeat)
      return instance
    }
  } 
}
const model = modelWrapper()

async function printRecord_local() {
  const MyModel = model.getInstance()
  const res = await MyModel.findOne(condition)
  console.log(res)
}

async function insertRecs_local() {

  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 1)
  // expirationTime.setDate(expirationTime.getDate() + dataRetentionDays);

  const recs = [{
    key: 'some_key_8',
    timestamp: new Date(),
    uptime: 10,
    deletedAt: expirationTime,
  }]
  const MyModel = model.getInstance()
  const res = await MyModel.insertMany(recs)
  console.log(res)
}
  
module.exports = {
  url: getLocalDBUrl(),
  schema: Heartbeat,
  condition,
  tableName,
  connect_local,
  printRecord_local,
  insertRecs_local
}

