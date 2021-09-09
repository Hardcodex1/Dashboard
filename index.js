const Discord = require("discord.js")
const {Intents, MessageEmbed, MessageButton, MessageActionRow} = require("discord.js")
const mongo = require("./mongo")
const dotenv = require("dotenv")
dotenv.config()
const slashCommands = require("./slashcommands")
const rps = require("./games/rps")
const serverPhone = require("./games/serverPhone")
const economy = require("./games/economy")
const dash = require("./dashboardMain")

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ]
})

client.on("ready", async message =>
{
    console.log("Bot Online, Proceed To Discord")
    await mongo()
    slashCommands(client)
    rps(client)
    serverPhone(client)
    economy(client)
    dash(client)
})

client.on("interactionCreate", interaction =>
{
    if (interaction.commandName == "ping")
    {
        interaction.reply("pong!")
    }
})

client.login("ODc1NzgxMDgwODg2Njk3OTg0.YRagsA.RnKyjAjBimh1jbXn5NzJHveKgLI")