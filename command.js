var { prefix } = require('./config.json')
const db = require("quick.db")
const Discord = require("discord.js")

const cooldowns = new Map()

module.exports = (client, aliases, callback) => {

  if (typeof aliases === 'string') {
    aliases = aliases.toLowerCase()
    aliases = [aliases]
  }

  client.on('messageCreate', (message) => {
      if (!message.guild) return
      if (message.guild)
      {
        if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) return
      }
    const { content } = message
    var commandName = content.toLowerCase()

    if (typeof message.guild == "null" || message.guild == null) 
    {
      usePrefix = "!"
    }
    else
    {
      var customPrefix = db.get(`prefix-${message.guild.id}`)
     var usePrefix
     if (customPrefix == null || typeof customPrefix == "null" || typeof customPrefix == "undefined" || customPrefix == " ")
     {
     usePrefix = prefix;
     }
    else
    {
     usePrefix = customPrefix
    }
    }

    aliases.forEach((alias) => {
      const command = `${usePrefix}${alias}`
      const backCommand = `${prefix}${alias}`

      if (commandName.startsWith(`${command} `) || commandName === command) {
        console.log(command)
        if (!cooldowns.has(command))
        {
          cooldowns.set(command, new Discord.Collection())
        }

        const current_time = Date.now()
          const time_stamps = cooldowns.get(command)
        const cooldown_amount = 5 * 1000

        if (time_stamps.has(message.author.id)) {
          const expiration_time = time_stamps.get(message.author.id) + cooldown_amount

          if (current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000

            return message.channel.send(`Please Wait ${time_left.toFixed(1)} More Secconds To Run This Command`)
          }
        }

        time_stamps.set(message.author.id, current_time)
        setTimeout(()=> time_stamps.delete(message.author.id), cooldown_amount)

        console.log(`Running the command ${command}`)
        callback(message)
      }
    })
  })
}