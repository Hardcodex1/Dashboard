const DBD = require('discord-dashboard');
const CaprihamTheme = require('dbd-capriham-theme');

let langsSettings = {};

let currencyNames = {};

let botNicknames = {};
const {Intents, MessageEmbed, MessageButton, MessageActionRow} = require("discord.js")
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

module.exports = client =>
{
    const Dashboard = new DBD.Dashboard({
        port: 80,
        client: {
            id: '875781080886697984',
            secret: 'JWpsMcGYmQA7TbHx_3HUMPiowo6_3JlR', 
        },
        redirectUri: 'http://localhost/discord/callback',
        domain: 'https://nekie.000webhostapp.com',
        bot: client,
        theme: CaprihamTheme({
            websiteName: "Nekie Dashboard",
            iconURL: 'https://cdn.discordapp.com/attachments/862307473162502174/885504166481498122/fg24bctrfa869p0wd95xygq0kp_image_1_1_4.jpg',
            index: {
                card:{
                    title: "Nekie - The Most Advanced Multipurpose Bot",
                    description: "Nekie Bot management panel. Nekie Has All The Features That A Server Needs",
                    image: "https://www.geeklawblog.com/wp-content/uploads/sites/528/2018/12/liprofile-656x369.png",
                },
                information: {
                    title: "Information",
                    description: "To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>.<br><br><b><i>You can use HTML there</i></b>"
                },
                feeds: {
                    title: "Feeds",
                    list: [
                        {
                            icon: "fa fa-user",
                            text: "New user registered",
                            timeText: "Just now",
                            bg: "bg-light-info"
                        },
                        {
                            icon: "fa fa-server",
                            text: "Server issues",
                            timeText: "3 minutes ago",
                            bg: "bg-light-danger"
                        }
                    ]
                }
            },
            commands: {
                pageTitle: "Commands",
                table: {
                    title: "List",
                    subTitle: "All Assistants' commands",
                    list: 
                    [
                        {
                            commandName: "Test command",
                            commandUsage: "prefix.test <arg> [op]",
                            commandDescription: "Lorem ipsum dolor sth"
                        },
                        {
                            commandName: "2nd command",
                            commandUsage: "oto.nd <arg> <arg2> [op]",
                            commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff"
                        }
                    ]
                }
            }
        }),
        settings: [
            {
                categoryId: 'setup',
                categoryName: "Setup",
                categoryDescription: "Setup your bot with default settings!",
                categoryOptionsList: [
                    {
                        optionId: 'lang',
                        optionName: "Language",
                        optionDescription: "Change bot's language easily",
                        optionType: DBD.formTypes.select({"Polish": 'pl', "English": 'en', "French": 'fr'}),
                        getActualSet: async ({guild}) => {
                            return langsSettings[guild.id] || null;
                        },
                        setNew: async ({guild,newData}) => {
                            langsSettings[guild.id] = newData;
                            return;
                        }
                    },
                    {
                        optionId: 'nickname',
                        optionName: "Nickname",
                        optionDescription: "Bot's nickname on the guild",
                        optionType: DBD.formTypes.input("Bot username", 1, 16, false, true),
                        getActualSet: async ({guild}) => {
                            return botNicknames[guild.id] || false;
                        },
                        setNew: async ({guild,newData}) => {
                            botNicknames[guild.id] = newData;
                            return;
                        }
                    },
                ]
            },
            {
                categoryId: 'eco',
                categoryName: "Economy",
                categoryDescription: "Economy Module Settings",
                categoryOptionsList: [
                    {
                        optionId: 'currency_name',
                        optionName: "Currency name",
                        optionDescription: "Economy module Guild currency name",
                        optionType: DBD.formTypes.input('Currency name', null, 10, false, true),
                        getActualSet: async ({guild}) => {
                            return currencyNames[guild.id] || null;
                        },
                        setNew: async ({guild,newData}) => {
                            currencyNames[guild.id] = newData;
                            return;
                        }
                    },
                ]
            },
        ]
    });
    
    Dashboard.init();
}