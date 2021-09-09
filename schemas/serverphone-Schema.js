const mongoose = require("mongoose")

const serverPhoneSchema = mongoose.Schema({
  name: String,
  guildID: String,
  channelID: String,
  phoneNo: String,
  role: String,
})

module.exports = mongoose.model("Server Phone", serverPhoneSchema)