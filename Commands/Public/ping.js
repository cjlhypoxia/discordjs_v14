const {SlashCommandBuilder , CommandInteraction, PermissionFlagsBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("查看機器人延遲")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(interaction, client) {
        interaction.reply({content: `延遲: ${client.ws.ping}ms`, ephermal: true})
    },
};