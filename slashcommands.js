const command = require("./command")

module.exports = bot =>
{
    command(bot, "deploy", async message =>
    {
        await message.guild.commands.set([
        {
            name: "rps",
            description: "Play Rock Paper Sicssors With Someone",
            options: [
                {
                    name: "user",
                    type: "USER",
                    description: "User To Player Rock Paper Sicssors With",
                    required: true,
                },
            ]
        },
        {
            name: "serverphone",
            description: "Set Channel For Calls",
            options: [
                {
                    name: "option",
                    description: "Turn On Or Off Server Phone",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "on",
                            value: "on",
                        },
                        {
                            name: "off",
                            value: "off",
                        },
                        {
                            name: "number",
                            value: "number"
                        },
                    ]
                },
                {
                    name: "role",
                    description: "Add A Role To Pinged When Call Comes",
                    type: "ROLE",
                    required: false,
                }
            ]
        },
        {
            name: "call",
            description: "Call Using Serverphone",
            options: [
                {
                    name: "number",
                    type: "STRING",
                    description: "Phone Number Of Server",
                    required: true,
                },
            ]
        },
        {
            name: "disconnect",
            description: "End The Current Call",
        },
        {
            name: "randomcall",
            description: "Call A Random Server",
        },
        {
            name: "account",
            description: "Economy Account",
        },
    ])
        message.channel.send("deployed!")
    })
}