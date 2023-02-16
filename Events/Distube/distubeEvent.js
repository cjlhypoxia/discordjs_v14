const client = require("../../index.js");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const button = new ActionRowBuilder().setComponents(
    new ButtonBuilder().setCustomId('pause').setLabel('暫停播放').setStyle(ButtonStyle.Success).setEmoji('⏸️'),
    new ButtonBuilder().setCustomId('resume').setLabel('繼續播放').setStyle(ButtonStyle.Success).setEmoji('▶️'),
    new ButtonBuilder().setCustomId('shuffle').setLabel('隨機播放').setStyle(ButtonStyle.Primary).setEmoji('🔀'),
    new ButtonBuilder().setCustomId('skip').setLabel('跳過').setStyle(ButtonStyle.Danger).setEmoji('⏭️'),
    new ButtonBuilder().setCustomId('nowplaying').setLabel('現正播放').setStyle(ButtonStyle.Secondary).setEmoji('ℹ️'),
);
const status = queue =>
    `音量： \`${queue.volume}%\` | 音樂過濾： \`${queue.filters.names.join(', ') || '關閉'}\` | 循環： \`${queue.repeatMode ? (queue.repeatMode === 2 ? '全部歌曲' : '此首歌曲') : '關閉'
    }\` | 自動播放： \`${queue.autoplay ? '開啟' : '關閉'}\``
client.distube
    /** .on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [new EmbedBuilder().setColor("Green")
                .setDescription(`🎶 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user
                    }\n${status(queue)}`)]
        })
    )*/
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor("Green")
                    .setDescription(`🎶 | 新增 ${song.name} - \`${song.formattedDuration}\` 到播放列\nBy ${song.user}`)],
                components: [button]
            }
        )
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor("Green")
                    .setDescription(`🎶 | 新增 \`${playlist.name}\` 內的 ${playlist.songs.length
                        } 首歌到播放列\n${status(queue)}\nBy ${playlist.user}`)],
                components: [button]
            }
        )
    )
    .on('error', (channel, e) => {
        if (channel) channel.send(`⛔ | 發生了錯誤 : ${e.toString().slice(0, 1974)}`)
        else console.error(e)
    })
    .on('empty', queue => queue.textChannel.send({
        embeds: [new EmbedBuilder().setColor("Red")
            .setDescription('⛔ | 語音頻道內沒有人，我先閃了......')]
    }))
    .on('searchNoResult', (message, query) =>
        message.channel.send(
            {
                embeds: [new EmbedBuilder().setColor("Red")
                    .setDescription(`⛔ | 找不到關於 \`${query}\` 的結果 !`)]
            })
    )
    .on('finish', queue => queue.textChannel.send({
        embeds: [new EmbedBuilder().setColor("Green")
            .setDescription('🏁 | 歌曲播放完畢！')]
    }))