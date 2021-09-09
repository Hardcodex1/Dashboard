const mongoose = require('mongoose')

const mongoPath = 'mongodb+srv://Hardcodex:rayyaan123@nekie.keklr.mongodb.net/Nekie?retryWrites=true&w=majority'

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  var options =  { useMongoClient: true, keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 }
  mongoose.connect(mongoPath, options, (err) => {
      if(err) {
          console.error("Error while connecting", err);
      }
  });
  
  mongoose.connection.on("connected", () =>
  {
      console.log("Connection With MongoDb Establised Sucessfully")
  })
  return mongoose
}