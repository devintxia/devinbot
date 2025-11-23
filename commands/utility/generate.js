// this is going to generate a sentence using a markov chain... hopefully
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate')
        .setDescription('generate a devin sentence!'),
    async execute(interaction, client){
        const { exec } = require('child_process');
        const path = require('path');
        const fs = require('fs');
        
        const scriptPath = path.join(__dirname, 'markov_generator.py');
        
        if (!fs.existsSync(scriptPath)) {
            // checking if the file exists
            console.log('markov_generator.py not found');
            return await interaction.reply({content: 'markov_generator.py not found', 
                flags: 64 });   // ephemeral
        }
        
        console.log('markov_generator.py found');
        
        await interaction.deferReply({ flags: 64 });    // ephemeral
        await interaction.editReply('Working...');

        // execute python script
        exec(`python -u "${scriptPath}"`, (error, stdout, stderr) => {
            console.log('finished');
            console.log('error:', error);
            console.log('output:', stdout);
            console.log('stderror:', stderr);
            
            if (error) {
                console.error('error: ', error);
                interaction.editReply('something went wrong');
                return;
            }

            interaction.editReply('done! (,,> ᴗ <,,)').then(() => {
                const channel = interaction.channel;
                if (channel) {
                    channel.send(stdout || "No output received.");
                }
            });
        });
    },
};