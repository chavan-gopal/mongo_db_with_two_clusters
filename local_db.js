// Represent our existing mongodb cluster
let mongoose = require('mongoose')
let Schema = mongoose.Schema

mongoose.plugin(require('./dateFields_celigo_plugin'))

const Heartbeat = new Schema({
  key: {type: String, required: true, unique: true},
  timestamp: {type: Date, required: true},
  uptime: {type: Number},
  deletedAt: {
    type: Date, 
    default: function () {
      // Set the default value to 30 days from the document's creation date
      const afterOneMinFromNow = new Date(this.createdAt);
      afterOneMinFromNow.setMinutes(afterOneMinFromNow.getMinutes() + 2)
      // const thirtyDaysFromNow = new Date(this.createdAt);
      // thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return afterOneMinFromNow;
    },
 
    index: { expireAfterSeconds: 0 }
  }

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
    key: 'some_key_9',
    timestamp: new Date(),
    uptime: 10,
    deletedAt: expirationTime,
  }]
  const MyModel = model.getInstance()
  // uncomment to check auto-delete functionality with default value
  // create_with_delay()
  const res = await MyModel.insertMany(recs)
  console.log("after creation", new Date())
}

async function create_with_delay() {
  console.log('settimeout', new Date())
  setTimeout(async function() {
    console.log('now inserting record-----------------------after 3 min')
    const recs = [{
      key: 'some_key_10',
      timestamp: new Date(),
      uptime: 10
    }];
    const MyModel = model.getInstance()
    const res = await MyModel.insertMany(recs)
    console.log('settimeout after creation', new Date())
  }, 2*60*1000)
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

