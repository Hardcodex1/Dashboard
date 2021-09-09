const { Client, Intents } = require('discord.js');
const Dashboard = require('discord-easy-dashboard');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

module.exports = client =>
{
    client.dashboard = new Dashboard(client, {
        name: 'Nekie',
        description: 'The Best Multipurpose Bot Ever Made!',
        baseUrl: 'http://localhost',
        port: 80,
        secret: 'JWpsMcGYmQA7TbHx_3HUMPiowo6_3JlR', 
    });

    client.prefixes = {};

    const validatePrefix = prefix => prefix.length <= 5; // Only accepts prefixes of up to 5 characters
const setPrefix = (discordClient, guild, value) => discordClient.prefixes[guild.id] = value; // Stores the prefix in the client.prefixes object
const getPrefix = (discordClient, guild) => discordClient.prefixes[guild.id] || '!'; 

client.dashboard.addTextInput('Prefix', 'The prefix that is added to discord messages in order to invoke commands.', validatePrefix, setPrefix, getPrefix);

client.on('messageCreate', message => {
    
    let prefix = getPrefix(client, message.guild); // We reuse our function to gain in readability!

    console.log(prefix)

    if (message.content.startsWith(prefix + 'ping')) message.reply('Pong !'); // 🏓 :D
});
}