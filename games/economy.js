const economySchema = require("../schemas/eco-Schema")

module.exports = client =>
{
    client.on("interactionCreate", async interaction =>
    {
        if (interaction.commandName == "account")
        {
            interaction.deferReply()

            var result = await economySchema.find({
                userID: interaction.user.id
            })

            if (typeof result[0] == "undefined") 
            {
                await economySchema.findOneAndUpdate({
                    userID: interaction.user.id
                },
                {
                    userID: interaction.user.id,
                    money: 1000,
                },
                {
                    upsert: true,
                    new: true,
                })

                interaction.followUp("Welcome To The World Of Trading. \nYour Account Has Been Credited With 1000 Coins")
                return;
            }

            var money = result[0].money

            interaction.followUp(`User Name: ${interaction.user.toString()}\nCoins: ${money}`)
        }
    })
}