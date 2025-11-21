const { SlashCommandBuilder, InteractionResponse } = require('discord.js');
const { after } = require('node:test');

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
            const files = await fs.promises.readdir(dir).catch(() => []);
            const size = files.length;

            const channel = interaction.channel ?? await client.channels.fetch(interaction.channelId);
            
            // gathers the first 100 messages
            let messages = await channel.messages.fetch({limit: 100});
            // let messagesByMe = messages.filter(m => m.id && m.author.id === '131039560355282944');

            let index = 0;
            let flag = null;
            let data = [
                ['word', 'next']
            ];
            let intervalID = setInterval(async function () {
                // this is what stops it
                if (messages.size < 100 && index === messages.size) {
                    await interaction.editReply('done! (,,> ᴗ <,,)');
                    clearInterval(intervalID);
                    // okay so now I think I can start adding the data to file. hooray!
                    
                    const csvContent = data.map(r => r.join(',')).join('\n');

                    const filePath = path.join(dir, `devinmessages ${size}.csv`);
                    fs.writeFile(filePath, csvContent, (err) => {
                        if (err) {
                            console.error('Error creating csv file', err);
                            return;
                        }
                        console.log(`File "devinmessages ${size}.csv" created successfully!`);
                    });
                    return; // finally end it all...
                }

                // this is what iterates through it
                let message = messages.at(index++);
                if (message) {
                    // this is the last message that isn't null / exists
                    flag = message;
                }

                // this is what resets it
                if (index === messages.size) {
                    if (!flag) {
                        // in case message is null somehow?
                        flag = messages.at(messages.size - 1);
                    }
                    // console.log(`current flag is: ${flag.content}`)
                    messages = await channel.messages.fetch({before: flag.id, limit: 100});
                    index = 0;
                }

                try {
                    if (message.author.id === '131039560355282944') {
                        // this is where you want to do stuff with the message
                        console.log(`Got message ${message.content}`);
                        const messageList = message.content.split(" ");
                        for (let i=0; i<messageList.length; i++) {
                            if (i == messageList.length-1) {
                                // if you've reached the last word
                                const row = [messageList[i], ""];   // no word after!
                                data.push(row);
                            } else {
                                // not at last word
                                const row = [messageList[i], messageList[i+1]]
                                data.push(row);
                            }
                        }
                    }
                } catch (error) {

                }
            }, 10);
        }
    },
}