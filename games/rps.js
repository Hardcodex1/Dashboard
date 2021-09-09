const rpsSchema = require("../schemas/rps-Schema")
const db = require("quick.db")
const mongo = require("../mongo")
const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js")

module.exports = client =>
{
    client.on("interactionCreate", interaction =>
    {
        if (interaction.commandName == "rps")
        {
            interaction.deferReply()

            const row1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('accept')
					.setLabel("✅")
					.setStyle('PRIMARY'),
			)
            .addComponents(
				new MessageButton()
					.setCustomId('reject')
					.setLabel("❌")
					.setStyle('PRIMARY'),
			)

        var taggedID = interaction.options.get("user").value
        var tagged = interaction.guild.members.cache.get(taggedID)

        if (!tagged) return interaction.reply({content: "Please Select A User To Play With", ephemeral: true})

        interaction.followUp({content: `${tagged.toString()}, ${interaction.user.toString()} Has Challenged You or Rock Paper Scissors.\nTo Accept Challenge Click Button Below`, components: [row1]})

        db.set(`rps-${tagged.id}`, interaction.user.id)
        }
    })

    const startGame = async message =>
{
    var tagged = message.tagged

    const embed = new MessageEmbed()
      .setTitle("Rock Paper Scissors")
      .setDescription("**Paper:** 📄 \n\n**Rock:** 💎 \n\n**Scissors:** ✂️ \n\nPlease Select Any Of The Following Options \n**Player 1:** <a:loading:884501575681318953> \n**Player 2:** <a:loading:884501575681318953>")
      .setColor("#FFFF00")

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('rock')
					.setLabel("💎")
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('paper')
					.setLabel('📄')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Scissors')
					.setLabel('✂️')
					.setStyle('PRIMARY'),
			)

        var guild = client.guilds.cache.get(message.guild.id)
        var user1 = guild.members.cache.get(message.author)

        user1.send({embeds: [embed], components: [row]})
        tagged.send({embeds: [embed], components: [row]})

        var data = {
            guildID: message.guild.id,
            creatorID: message.author,
            player1: message.author,
            player2: tagged.id,
            p1Choice: "none",
            p2Choice: "none"
        }

        await rpsSchema(data).save()
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customId == "rock" || interaction.customId == "paper" || interaction.customId == "Scissors")
    {
        var player;

        var check = await rpsSchema.find({
            player1: interaction.user.id
        })

        if (typeof check[0] == "undefined")

        check = await rpsSchema.find({
            player2: interaction.user.id
        })

        if (typeof check[0] == "undefined") return interaction.reply("No Game Running Currently")

        var player1 = check[0].player1
        var p1Choice = check[0].p1Choice
        var player2 = check[0].player2
        var p2Choice = check[0].p2Choice

        if (player1 == interaction.user.id)
        player = "player1"
        else
        player = "player2"

        if (player == "player1")
        {
            p1Choice = interaction.customId
        }
        else if (player == "player2")
        {
            p2Choice = interaction.customId
        }

        if (p1Choice != "none" && p2Choice != "none")
        {
            var final = 0;
            if (p1Choice == "rock")
            {
                if (p2Choice == "paper")
                {
                    final = 1;
                }
            }
            else if (p1Choice == "paper")
            {
                if (p2Choice == "Scissors")
                {
                    final = 1;
                }
            }
            else if (p1Choice == "Scissors")
            {
                if (p2Choice == "rock")
                {
                    final = 1;
                }
            }

            var guild = client.guilds.cache.get(check[0].guildID)
            var user1 = guild.members.cache.get(player1)
            var user2 = guild.members.cache.get(player2)

            const embed = new MessageEmbed()
           .setTitle("Rock Paper Scissors")
           .setDescription(`**Paper:** 📄 \n\n**Rock:** 💎\n\n**Scissors:** ✂️ \n\nPlease Select Any Of The Following Options \n**Player 1:** ${p1Choice} \n**Player 2:** ${p2Choice}`)
           .setColor("#FFFF00")

            if (final == "0")
            {
                user1.send({content: "`You Have Won!!!!`", embeds: [embed]})
                user2.send({content: "`Sorry You Lost! Better Luck Next Time`", embeds: [embed]})
            }
            else 
            {
                user2.send({content: "`You Have Won!!!!`", embeds: [embed]})
                user1.send({content: "`Sorry You Lost! Better Luck Next Time`", embeds: [embed]})
            }

            await rpsSchema.deleteMany({
                creatorID: player1
            })
        }

        if (p1Choice == "none")
        p1Choice = "<a:loading:884501575681318953>"
        else if (p2Choice == "none")
        p2Choice = "<a:loading:884501575681318953>"

        const embed = new MessageEmbed()
        .setTitle("Rock Paper Scissors")
        .setDescription(`**Paper:** 📄 \n\n**Rock:** 💎\n\n**Scissors:** ✂️ \n\nPlease Select Any Of The Following Options \n**Player 1:** ${p1Choice} \n**Player 2:** ${p2Choice}`)
        .setColor("#FFFF00")

        interaction.message.edit({embeds: [embed], components: []})
        interaction.reply({content: "Choice Updated", ephemeral: true})

        await rpsSchema.findOneAndUpdate({
            player1: player1,
        },
        {
            p1Choice: p1Choice,
            p2Choice: p2Choice,
        })
    }
    else if (interaction.customId == "accept")
    {
        var result = await db.get(`rps-${interaction.user.id}`)

        if (typeof result == "null" || result == null) return interaction.reply({content: "This Button Is Not Ment For You!!", ephemeral: true})

        db.delete(`rps-${interaction.user.id}`)

        var data = {
            tagged: interaction.user,
            author: result,
            guild: interaction.guild
        }

        interaction.message.edit({content: "The Match Is Now Starting In DMS, Best Of Luck!", components: []})

        startGame(data)
    }
    else if (interaction.customId == "reject")
    {
        var result = await db.get(`rps-${interaction.user.id}`)

        if (typeof result == "null" || result == null) return interaction.reply({content: "This Button Is Not Ment For You!!", ephemeral: true})

        db.delete(`rps-${interaction.user.id}`)

        var data = {
            tagged: interaction.user,
            author: result,
            guild: interaction.guild
        }

        interaction.message.edit({content: "The Opponent Did Not Accept The Challenge", components: []})
    }
})
}