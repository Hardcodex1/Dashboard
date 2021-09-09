const mongoose = require("mongoose")

const rpsSchema = mongoose.Schema({
  creatorID: String,
  guildID: String,
  player1: String,
  player2: String,
  p1Choice: String,
  p2Choice: String,
})

module.exports = mongoose.model("RPS", rpsSchema)