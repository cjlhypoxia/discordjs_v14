const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("查看稍後播放的前十首歌曲"),
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
                embed.setColor("Red").setDescription("❌ 沒有播放清單");
                return interaction.reply({ embeds: [embed], ephemeral: true});
            }
            let max;
            if (queue.songs.length >= 10) {
                max = 10
            } else {
                max = queue.songs.length;
            }
            const slicequeue = queue.songs.slice(0, max)
            embed.setColor("Blue").setDescription(`${slicequeue.map(
              (song, id) => (`\n**${id + 1}** . **${song.name}** - \`${song.formattedDuration}\`\nLink: ${song.url}`)
            )}`).setTimestamp().setFooter({text: `等 ${queue.songs.length - 10} 首歌`})
            return interaction.reply({ embeds: [embed], ephemeral: true});
        } catch (err) {
            console.log(err);
            embed.setColor("Blue").setDescription("❌ 發生了錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
    }
}