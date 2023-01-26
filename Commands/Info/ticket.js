const {Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require('discord.js');
const {openticket} = require("../../config.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("開啟幫助對話")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const {guild} = interaction;
        const embed = new EmbedBuilder()
            .setDescription("開啟幫助對話")
        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('member').setLabel('report member').setStyle(ButtonStyle.Danger).setEmoji('😵‍💫'),
            new ButtonBuilder().setCustomId('bug').setLabel('report bug').setStyle(ButtonStyle.Secondary).setEmoji('😒'),
            new ButtonBuilder().setCustomId('code').setLabel('report code').setStyle(ButtonStyle.Primary).setEmoji('👌'),
            new ButtonBuilder().setCustomId('other').setLabel('report other').setStyle(ButtonStyle.Success).setEmoji('💡'),
        );
        await guild.channels.cache.get(openticket).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });
        interaction.reply({content: "幫助訊息已傳送", ephemeral: true});
    }
}