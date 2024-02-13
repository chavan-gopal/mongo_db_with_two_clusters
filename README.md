This is a simple example/POC for connecting to two different MongoDB clusters in the node.js application

current in integrator-models for connecting to MongoDB we use the **connect** method
https://github.com/celigo/integrator-models/blob/main/src/client.js#L45
```javascript
  const mongoose = require('mongoose')

  // this would update the mongoose instance
  await mongoose.connect(url)
```
this connect method would directly update the Mongoose object
and Hence if we try to create one more connection using some connect method it would result in an error

However, mongoose provides one more method for creating connections called createConnection
this would not update the mongoose object, instead, it creates and returns the connection Object
```javascript
let mongoose = require('mongoose')

this will not update mongoose object
const conn = await mongoose.createConnection(url)
```

**conclusion:**

  for our new Mongodb cluster we could make use of the createConnection method for connecting with any need to update our existing integrator-adaptor connection creation logic
