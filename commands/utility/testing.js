const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testing')
        .setDescription('testing if commands work'),
    async execute(interaction){
        await interaction.reply('working! (,,>﹏<,,)')
        const fs = require('fs');
        const path = require('node:path');
        const dir = path.join(__dirname, 'messages');   // gets messages folder
        fs.readdir(dir, (err, files) => {
            if (files) {
                console.log(files.length);
            } else {
                console.log('empty');
            }
            // otherwise you know it's empty
        });
    },
};
