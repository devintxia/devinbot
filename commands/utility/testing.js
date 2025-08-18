const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testing')
        .setDescription('testing if commands work'),
    async execute(interaction){
        await interaction.reply('working! (,,>﹏<,,)')
    },
};
