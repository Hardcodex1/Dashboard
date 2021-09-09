//Math.random().toString().slice(2,11);
const serverPhone = require("../schemas/serverphone-Schema")
const db = require("quick.db")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = client =>
{
    const talkedRecently = new Set();

    var randomIndex = message =>
    {
        var max = message.length;
        var index = Math.random() * max 
        return index = Math.round(index) - 1
    }

    const embedSender = message =>
    {
        const embed = new MessageEmbed()
        .setTitle(message.title)
        .setDescription(message.content)
        .setFooter("☎️ Phone Calling System")
        .setColor("#00000")
        .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/885394306205089792/21-215884_telephone-icon-png-phone-emoji-transparent-background-png-removebg-preview.png")

        return embed
    }

    client.on("interactionCreate", async interaction =>
    {
        if (interaction.commandName == "serverphone")
        {
            if (!interaction.guild) return

            var option = interaction.options.get("option").value

            if (option == "on")
            {
                var phoneNo = "p-" + Math.random().toString().slice(2,6);
                var role = ""

                if (interaction.options.get("role"))
                {
                    role = interaction.options.get("role").value
                }

                if (!role)
                {
                    role = "none"
                }

                await serverPhone.findOneAndUpdate({
                    channelID: interaction.channel.id
                },
                {
                    channelID: interaction.channel.id,
                    guildID: interaction.guild.id,
                    name: "serverPhone",
                    phoneNo: phoneNo,
                    role: role,
                },
                {
                    upsert: true,
                    new: true,
                })

                const embed = new MessageEmbed()
                .setTitle("Channel Set Successful")
                .setDescription(`☎️ <#${interaction.channel.id}> Successfully Set. \n This Channel's Phone Number is: \`${phoneNo}\``)
                .setFooter(`Server Calling System`)
                .setColor("#00000")

                interaction.reply({embeds: [embed]})
                return;
            }
            else if (option == "off")
            {
                await serverPhone.deleteMany({
                    channelID: interaction.channel.id
                })

                const embed = new MessageEmbed()
                .setTitle("Channel Delete Successful")
                .setDescription(`☎️ <#${interaction.channel.id}> Successfully Deleted.`)
                .setFooter(`Server Calling System`)
                .setColor("#00000")


                interaction.reply({embeds: [embed]})
            }
            else if (option == "number")
            {
                var result = await serverPhone.find({
                    channelID: interaction.channel.id
                })

                var data = {
                    title: `Error`,
                    content: `☎️ This Channel Does Not Have An Existing Phone Number`
                }

                if (typeof result[0] == "undefined") return interaction.reply({embeds: [embedSender(data)], ephemeral: true})
                
                var phoneNo = result[0].phoneNo

                data = {
                    title: `Phone Number For ${interaction.channel.name}`,
                    content: `☎️ Phone Number: ${phoneNo}`
                }

                interaction.reply({embeds: [embedSender(data)]})

            }
            else
            {
                return
            }
        }
        else if (interaction.commandName == "call")
        {
            if (!interaction.guild) return

            var phoneNo = interaction.options.get("number").value

            var data = {
                title: `Error`,
                content: "☎️ Invalid Phone Number!"
            }

            if (!phoneNo) return interaction.reply({embeds: [embedSender(data)], ephemeral: true})

            var result = await serverPhone.find({
                phoneNo: phoneNo,
            })

            data = {
                title: `Error`,
                content:  "☎️ The Number You Have Entered Does Not Exist, Please Check The Number And Try Again"
            }

            if (typeof result[0] == "undefined") return interaction.reply({embeds: [embedSender(data)], ephemeral: true})

            data = {
                title: `Error`,
                content:  "☎️ This Number Belongs To This Server, You Cannot Call Yourself"
            }

            if (result[0].guildID == interaction.guild.id) return interaction.reply({embeds: [embedSender(data)], ephemeral: true})

            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('callaccept')
					.setLabel("✅")
					.setStyle('PRIMARY'),
			)
            .addComponents(
				new MessageButton()
					.setCustomId('callreject')
					.setLabel("❌")
					.setStyle('PRIMARY'),
			)

            const row1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('callcancel')
					.setLabel("❌")
					.setStyle('PRIMARY'),
			)

            var guild = client.guilds.cache.get(result[0].guildID)
            var channel = guild.channels.cache.get(result[0].channelID)

            var dataMain = {
                callerguildID: interaction.guild.id,
                callerchannelID: interaction.channel.id,
                recieverguildID: guild.id,
                reciverchannelID: channel.id
            }

            var serverInfo = await serverPhone.find({
                channelID: channel.id
            })

            var roleID = serverInfo[0].role
            var role = `<@&${roleID}>`

            if (roleID == "none")
            {
                role = "Call"
            }

            data = {
                title: `ServerPhone`,
                content:  "☎️ Someone Is Calling..."
            }

            data2 = {
                title: `Server Phone`,
                content: `☎️ Calling... \n Phone Number: ${phoneNo}`
            }

            db.set(`serverphone-${interaction.channel.id}`, dataMain)
            db.set(`serverphone-${channel.id}`, dataMain)
            channel.send({content: `${role}`,embeds: [embedSender(data)], components: [row]})
            interaction.reply({embeds: [embedSender(data2)], components: [row1]})
        }
        else if (interaction.commandName == "disconnect")
        {
            var result = db.get(`serverphoneA-${interaction.channel.id}`)
           var data = {
                title: `Error`,
                content:  "☎️ There Is No Call Connected To This Channel"
            }
            if (!result) return interaction.reply({embeds: [embedSender(data)], ephemeral: true})
            var channelID = ""
            var guildID = ""
            if (interaction.channel.id == result.callerchannelID)
            {
                guildID = result.recieverguildID
                channelID = result.reciverchannelID
            }
            else if (interaction.channel.id == result.reciverchannelID)
            {
                guildID = result.callerguildID
                channelID = result.callerchannelID
            }
            db.delete(`serverphoneA-${channelID}`)
            db.delete(`serverphoneA-${interaction.channel.id}`)
            talkedRecently.delete(channelID)
            talkedRecently.delete(interaction.channel.id)
            data = {
                title: `Disconnect`,
                content:  "☎️ Call Has Been Disconnected"
            }
            interaction.reply({embeds: [embedSender(data)]})
            var guild = client.guilds.cache.get(guildID)
            var channel = guild.channels.cache.get(channelID)
            channel.send({embeds: [embedSender(data)]})
        }
        else if (interaction.commandName == "randomcall")
        {
            if (!interaction.guild) return

            var result = await serverPhone.find({
                name: "serverPhone",
            })

            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('callaccept')
					.setLabel("✅")
					.setStyle('PRIMARY'),
			)
            .addComponents(
				new MessageButton()
					.setCustomId('callreject')
					.setLabel("❌")
					.setStyle('PRIMARY'),
			)

            const row1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('callcancel')
					.setLabel("❌")
					.setStyle('PRIMARY'),
			)

            var data = {
                title: `Error`,
                content: "☎️ Unable To Make A Call At This Moment!, Please Try Again Later"
            }

            if (typeof result[0] == "undefined") return interaction.reply({embeds: [embedSender(data)], ephemeral: true})

            var index = randomIndex(result)

            if (index < 0)
            {
                index = 0
            }

            var serverData = result[index]

            if (serverData.guildID == interaction.guild.id) return interaction.reply({embeds: [embedSender(data)], ephemeral: true})

            var guild = client.guilds.cache.get(serverData.guildID)
            var channel = guild.channels.cache.get(serverData.channelID)

            var dataMain = {
                callerguildID: interaction.guild.id,
                callerchannelID: interaction.channel.id,
                recieverguildID: guild.id,
                reciverchannelID: channel.id
            }

            var serverInfo = await serverPhone.find({
                channelID: channel.id
            })

            var roleID = serverInfo[0].role
            var role = `<@&${roleID}>`

            if (roleID == "none")
            {
                role = "Call"
            }

            data = {
                title: `Server Phone`,
                content: "☎️ Someone Is Calling..."
            }

            data2 = {
                title: `Server Phone`,
                content: `☎️ Calling... \n Phone Number: ${serverData.phoneNo}`
            }

            db.set(`serverphone-${interaction.channel.id}`, dataMain)
            db.set(`serverphone-${channel.id}`, dataMain)
            channel.send({content: `${role}`, embeds: [embedSender(data)], components: [row]})
            interaction.reply({embeds: [embedSender(data2)], components: [row1]})
        }
    })

    client.on("interactionCreate", async interaction =>
    {
        if (!interaction.isButton()) return;
        if (!interaction.guild) return

        if (interaction.customId == "callaccept")
        {
            var testRow = new MessageActionRow()
            .addComponents(
                interaction.component.setDisabled(true)
            )
            interaction.message.edit({content: `Call Accepted By - ${interaction.user.toString()}`, components: [testRow] })

            var result = db.get(`serverphone-${interaction.channel.id}`)
            if (!result) return interaction.reply("☎️ Call Could Not Be Connected")
            interaction.reply({content: `☎️  Accepted`, ephemeral: true})
            db.delete(`serverphone-${result.callerchannelID.id}`)
            db.delete(`serverphone-${interaction.channel.id}`)
            db.set(`serverphoneA-${interaction.channel.id}`, result)
            db.set(`serverphoneA-${result.callerchannelID}`, result)
            var guild = client.guilds.cache.get(result.callerguildID)
            var channel = guild.channels.cache.get(result.callerchannelID)
            channel.send("☎️ Call Has Been Accepted, You Are Now Connected")
            talkedRecently.add(channel.id)
            talkedRecently.add(interaction.channel.id)
            var today = new Date()
            var min = today.getMinutes()
            db.set(`serverphoneT-${interaction.channel.id}`, min)
            db.set(`serverphoneT-${channel.id}`, min)
        }
        else if (interaction.customId == "callreject")
        {
            var testRow = new MessageActionRow()
            .addComponents(
                interaction.component.setDisabled(true)
            )
            interaction.message.edit({content: `Call Rejected By - ${interaction.user.toString()}`, components: [testRow] })

            var result = db.get(`serverphone-${interaction.channel.id}`)
            if (!result) return interaction.reply("Call Does Not Exist")
            interaction.reply({content: "Call Rejected", ephemeral: true})
            var guild = client.guilds.cache.get(result.callerguildID)
            var channel = guild.channels.cache.get(result.callerchannelID)
            channel.send("☎️ Call Has Been Rejected")
            db.delete(`serverphone-${channel.id}`)
            db.delete(`serverphone-${interaction.channel.id}`)
        }
        else if (interaction.customId == "callcancel")
        {
            var testRow = new MessageActionRow()
            .addComponents(
                interaction.component.setDisabled(true)
            )
            interaction.message.edit({content: `☎️ Call Cancelled By - ${interaction.user.toString()}`, components: [testRow] })

           var result = await db.get(`serverphone-${interaction.channel.id}`)
           if (!result) return interaction.reply("☎️ There Is No Outgoing Call")

           db.delete(`serverphone-${interaction.channel.id}`)
           db.delete(`serverphone-${result.reciverchannelID}`)

           interaction.reply({content: "☎️ Call Cancelled", ephemeral: true})
        }
    })

    const checkTimeout = async message =>
    {
        var min = await db.get(`serverphoneT-${message.channel.id}`)
            var today = new Date()
            var newMin = today.getMinutes()
            if (newMin - min >= 2)
            {
                talkedRecently.delete(message.otherChannel.id)
                talkedRecently.delete(message.channel.id)
                db.delete(`serverphoneT-${message.channel.id}`)
                db.delete(`serverphoneT-${message.otherChannel.id}`)
                db.delete(`serverphoneA-${message.otherChannel.id}`)
                db.delete(`serverphoneA-${message.channel.id}`)
                data = {
                    title: `Disconnected`,
                    content: "📶 Phone Disconnected Due To Inactivity!"
                }
                message.otherChannel.send({embeds: [embedSender(data)]})
                message.channel.send({embeds: [embedSender(data)]})
                return;
            }
            else
            {
                db.set(`serverphoneT-${message.channel.id}`, newMin)
                db.set(`serverphoneT-${message.otherChannel.id}`, newMin)
                return;
            }
    }

    client.on("messageCreate", async message =>
    {
        if (!message.guild) return
        if (message.author.bot) return


        if (db.has(`serverphoneA-${message.channel.id}`))
        {
            var result = await db.get(`serverphoneA-${message.channel.id}`)

            if (!talkedRecently.has(message.channel.id)) return

            var guildID = ""
            var channelID = ""

            if (result.callerchannelID == message.channel.id)
            {
                guildID = result.recieverguildID
                channelID = result.reciverchannelID
            }
            else if (result.reciverchannelID == message.channel.id)
            {
                guildID = result.callerguildID
                channelID = result.callerchannelID
            }

            var guild = client.guilds.cache.get(guildID)
            var channel = guild.channels.cache.get(channelID)
            var author = message.author.username

            channel.send(`${author} <:ServerPhone:885386816826531950>- ${message.content}`)
            var data = {
                channel: message.channel,
                otherChannel: channel,
            }
            checkTimeout(data)
        }
    })
}