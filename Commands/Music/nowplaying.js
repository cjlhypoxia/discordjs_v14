const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("目前播放的音樂"),
    async execute(interaction) {
        const {options, member, guild, channel} = interaction;
        const voiceChannel = member.voice.channel;
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
            const queue = await client.distube.getQueue(voiceChannel);
            if(!queue) {
                embed.setColor("Red").setDescription("沒有播放清單");
                return interaction.reply({ embeds: [embed], ephemeral: true});
            }
            const song = queue.songs[0];
            embed.setColor("Blue").setDescription(`⏭️ **正在播放** \`${song.name}\` - \`${song.formattedDuration}\` \n**連結: ** ${song.url}`).setThumbnail(song.thumbnail);
            return interaction.reply({ embeds: [embed], ephemeral: true});
        } catch (err) {
            console.log(err);
            embed.setColor("Blue").setDescription("⏭️發生了錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
    }
}