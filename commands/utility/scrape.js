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

            const channel = interaction.channel ?? await client.channels.fetch(interaction.channelId);
            
            // gathers the first 100 messages
            let messages = await channel.messages.fetch({limit: 100});
            // let messagesByMe = messages.filter(m => m.id && m.author.id === '131039560355282944');

            let index = 0;
            let flag = null;
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
                    }
                } catch (error) {

                }
            }, 10);
        }
    },
}