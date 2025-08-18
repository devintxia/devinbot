const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("shuts down bot"),
    async execute(interaction, client) {
        if (interaction.user.id !== '131039560355282944') {
            return interaction.reply({ content: "You are not authorized to use this command.", ephemeral: true });
        } else {
            await interaction.reply({content: "bye. . . (ㅠ﹏ㅠ)"})
            // kill
            client.destroy();
        }
    }
}