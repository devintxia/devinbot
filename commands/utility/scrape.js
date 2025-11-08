const { SlashCommandBuilder, InteractionResponse } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scrape')
        .setDescription(`get Devin's messages`),
    async execute(interaction, client){
        // await interaction.reply("working . . .")
        console.log(interaction.user.id);
        if (interaction.user.id !== '131039560355282944') {
            return interaction.reply({ content: "You are not authorized to use this command.", ephemeral: true });
        } else {
            // hopefully this should actually collect all my messages ever
            await interaction.deferReply();
            await interaction.editReply('working . . .');

            // now you want to look for the .csv file that I stored in and iterate the name by 1
            // ex: devinmessages 1.csv --> devinmessages 2.csv
            // maybe I should just do f = filename.split() --> nf = file(f.at(0) + f.at(1)+=1).csv

            const fs = require('fs');
            const path = require('node:path');
            const dir = path.join(__dirname, 'messages');   // gets messages folder
            let size = 0;
            fs.readdir(dir, (err, files) => {
                if (files) {
                    console.log(files.length);
                    size = files.length;
                } else {
                    // otherwise you know it's empty
                    console.log('empty');
                }
            });

            const channel = interaction.channel ?? await client.channels.fetch(interaction.channelId);
            
            // gathers the first 100 messages
            let messages = await channel.messages.fetch({limit: 100});
            // let messagesByMe = messages.filter(m => m.id && m.author.id === '131039560355282944');

            let index = 0;
            let flag = null;
            let data = [
                ['Name', 'Message', 'Time']
            ];
            let intervalID = setInterval(async function () {
                // this is what stops it
                if (index === messages.length && index % 100 !== 0) {
                    await interaction.editReply('done! (,,> ᴗ <,,)');
                    clearInterval(intervalID);
                }
                
                // this is what resets it
                if (index === 100) {
                    messages = await channel.messages.fetch({before: flag.id, limit: 100});
                    index = 0;
                }

                // this is what iterates through it
                let message = messages.at(index++);
                if (message) {
                    // this is the last message that isn't null / exists
                    flag = message;
                }
                try {
                    if (message.author.id === '131039560355282944') {
                        // this is where you want to do stuff with the message
                        console.log(`Got message ${message.content}`);
                        const row = [message.author, message.content, message.createdAt];
                        data.push(row);
                    }
                } catch (error) {

                }
            }, 10);

            // okay so now I think I can start adding the data to file. hooray!
            const csvContent = data.map(r => r.join(',')).join('\n');
            fs.writeFile(`devinmessages ${size}.csv`, csvContent, (err) => {
                if (err) {
                    console.error('Error creating csv file', err);
                    return;
                }
                console.log(`File "devinmessages ${size}.csv" created successfully!`);
            });
        }
    },
}