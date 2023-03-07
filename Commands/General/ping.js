const {SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder} = require('discord.js');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("查看機器人延遲")
    .setDMPermission(false),
    async execute(interaction, client) {
        if(interaction.member.roles.cache.has(process.env.chatrole)){
            interaction.reply({content: `延遲: ${client.ws.ping}ms`, ephemeral: true})
        }  else {
            interaction.reply({content: `你沒有權限`, ephemeral: true})
        }
            
    },
};