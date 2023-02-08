const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("播放音樂")
        .addStringOption(option =>
            option.setName("歌曲")
                .setDescription("連結或名稱")
                .setRequired(true)
        ),
    async execute(interaction) {
        const {options, member, guild, channel} = interaction;
        const query = options.getString("歌曲");
        const voiceChannel = member.voice.channel;
        const embed = new EmbedBuilder();
        if (!voiceChannel) {
            embed.setColor("Red").setDescription("❌ 你必須在語音頻道內");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription("❌ 錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
        try {
            client.distube.play(voiceChannel, query, { textChannel: channel, member: member});
            
            interaction.reply({content: `🎵 收到要求 `});
        } catch (err) {
            console.log(err);
            embed.setColor("Blue").setDescription("❌ 發生了錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
    }
}