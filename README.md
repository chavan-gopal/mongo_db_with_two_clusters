This is a simple example/POC for connecting to two different MongoDB clusters in the node.js application
one MongoDB cluster running locally and one on atlas mongodb

currently, in integrator-models for connecting to MongoDB, we use the **connect** method
https://github.com/celigo/integrator-models/blob/main/src/client.js#L45
```javascript
  const mongoose = require('mongoose')

  //This would update the mongoose instance
  await mongoose.connect(url)
```
this connect method would directly update the Mongoose object
and Hence if we try to create one more connection using the same connect method it would result in an error

However, mongoose provides one more method for creating connections called createConnection
this would not update the mongoose object, instead, it creates and returns the connection Object
```javascript
let mongoose = require('mongoose')

this will not update mongoose object
const conn = await mongoose.createConnection(url)
```

**conclusion:**

  for our new MongoDB cluster we could make use of the createConnection method for connecting with any need to update our existing integrator-adaptor connection creation logic


To run this application
1. please update the connection details, schema & tableName in the external_db.js file
```javascript
// Schema
const Account = new Schema({
  account_id: Number,
  limit: Number,
  products: Schema.Types.Mixed
})

// connection details
function getExternalDBUrl(){
  const USER = 'get_your_own'
  const PASSWORD = 'get_your_own'
  const HOST = 'get_your_own'
  const DB = 'get_your_own'
  const url = `mongodb+srv://${USER}:${PASSWORD}@${HOST}/${DB}?retryWrites=true&w=majority`
  return url
}

// table name
const tableName = 'accounts'
```
2. setup mongodb locally and update the connection details in local_db.js file
```javascript
// Schema
const Heartbeat = new Schema({
  key: {type: String, required: true, unique: true},
  timestamp: {type: Date, required: true},
  uptime: {type: Number}
})

// connection details
function getLocalDBUrl(){
  const USER = 'gopal'
  const PASSWORD = 'Gopal'
  const HOST = 'localhost:27017'
  const DB = 'integrator'
  const url = `mongodb://${USER}:${PASSWORD}@${HOST}/${DB}`
  return url
}

// table name
const tableName = 'heartbeats'
```
**command**
```shell
npm run start
```
