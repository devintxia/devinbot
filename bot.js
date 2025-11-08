console.log('Hello world!');

const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits, User } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// initializes commands for "client" into a collection of files
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');   // gets commands folder inside the directory of bot.js (this file)
const commandFolders = fs.readdirSync(foldersPath);     // sets commandFolders to \commands


// get commands folder
for (const folder of commandFolders){   // for each folder inside of commandFolders
    const commandsPath = path.join(foldersPath, folder);    //  commandsPath -> devinbot\commands\{current "folder"}
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //  creates array of files in commandsPath that end in .js
    for (const file of commandFiles){   // starts looping through the files
        const filePath = path.join(commandsPath, file); // filePath -> commandsPath -> devinbot\commands\{current "folder"}\{current "file"}
        // console.log(filePath);
        const command = require(filePath);
        if ('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);    // im assuming this adds it to client.commands
        } else {
            console.log(`Something is missing at ${filePath}`);
        }
    }
}

// ready up
client.once(Events.ClientReady, readyClient => {
    console.log('Ready! <3');
});

// wait for command
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command){
        console.error('ERROR');
        return;
    }

    try{
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ context: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ context: 'There was an error while executing this command!', ephemeral: true});
        }
    }
	// console.log(interaction);
});

client.on(Events.MessageCreate, gotMessage);

// this is probably just going to be for silly fun stuff.
function gotMessage(msg){
    // const message = `${msg.author}: ${msg.content}`;
    // console.log(message);
    
    // hi :3
    if (msg.content.toLowerCase() == "<@1160128119638859806> hi"){
        msg.reply('hiii (,,> ᴗ <,,)')
    }

    // good night
    if (msg.content.toLowerCase() == "<@1160128119638859806> goodnight" ||
    msg.content.toLowerCase() == "<@1160128119638859806> good night" ||
    msg.content.toLowerCase() == "<@1160128119638859806> gn") {
        msg.reply('good night (ᴗ˳ᴗ)💤')
    }

    // good morning
    if (msg.content.toLowerCase() == "<@1160128119638859806> good morning" || msg.content.toLowerCase() == "<@1160128119638859806> gm") {
        msg.reply('good morning! ˶ᵔ ᵕ ᵔ˶')
    }

    // Oguri Cap??
    if (msg.content.toLowerCase().includes("dance") && msg.content.toLowerCase().includes("oguri") && msg.content.toLowerCase().includes("cap")) {
        if (!msg.author.bot) {
            msg.channel.send('https://tenor.com/view/oguri-cap-oguri-cap-dancing-umamusume-chibi-gif-10169214246627292150')
        }
    }
}

client.login(token);
