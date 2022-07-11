const   { Client, Collection, Intents } = require("discord.js"),
        client = new Client({
            intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES ]
        }),
        Timeout = require("./structures/Timeout"),
        Logger = require("./structures/Logger"),
        ConfigUtil = require("./structures/ConfigUtil");

global.Config = new ConfigUtil();
global.Log = new Logger();

client.login(Config.token)
    .then(async () => {
        await Log.init(client);
        Log.send(`[INDEX] Инициализация бота`);
        client.commands = new Collection();
        
        require(`./handlers/events.js`).init(client);
        require(`./handlers/commands.js`).init(client);
    });

client.on('error', Log.error)
client.on('warn', Log.error)
process.on('uncaughtException', Log.error);
process.on('unhandledRejection', Log.error);

module.exports = client;