const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("播放音樂")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("name or url")
                .setRequired(true)
        ),
    async execute(interaction) {
        const {options, member, guild, channel} = interaction;
        const query = options.getString("query");
        const voiceChannel = member.voice.channel;
        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('pause').setLabel('pause').setStyle(ButtonStyle.Danger).setEmoji('😵‍💫'),
            new ButtonBuilder().setCustomId('resume').setLabel('resume').setStyle(ButtonStyle.Secondary).setEmoji('😒'),
            new ButtonBuilder().setCustomId('shuffle').setLabel('shuffle').setStyle(ButtonStyle.Primary).setEmoji('👌'),
            new ButtonBuilder().setCustomId('skip').setLabel('skip').setStyle(ButtonStyle.Success).setEmoji('💡'),
        );
        const embed = new EmbedBuilder();
        if (!voiceChannel) {
            embed.setColor("Red").setDescription("你必須在語音頻道內");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
        if (!member.voice.channelId ==guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription("錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
        try {
            client.distube.play(voiceChannel, query, { textChannel: channel, member: member});
            return interaction.reply({content: "🎵 收到要求", components: [button]});
        } catch (err) {
            console.log(err);
            embed.setColor("Blue").setDescription("⏭️發生了錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
    }
}