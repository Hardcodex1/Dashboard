const mongoose = require("mongoose")

const economySchema = mongoose.Schema({
  userID: String,
  money: Number,
  buisness: [String],
  items: [String],
})

module.exports = mongoose.model("User Accounts", economySchema)