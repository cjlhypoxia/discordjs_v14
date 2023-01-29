const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("forward")
        .setDescription("快轉目前音樂")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("要快轉的秒數 1 = 1s")
                .setMinValue(0)
                .setRequired(true)
            ),
    async execute(interaction) {
        const {options, member, guild, channel} = interaction;
        const seconds = options.getInteger("seconds");
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
            await queue.seek(queue.currentTime + seconds);
            embed.setColor("Blue").setDescription(`⏭️ 歌曲已快轉 \`${seconds}\`秒`);
            return interaction.reply({ embeds: [embed], ephemeral: true});
        } catch (err) {
            console.log(err);
            embed.setColor("Blue").setDescription("⏭️發生了錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
    }
}