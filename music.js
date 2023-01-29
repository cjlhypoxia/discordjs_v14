const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("音樂")
        .addSubcommand(subcommand => 
            subcommand.setName("play")
                .setDescription("播放音樂")
                .addStringOption(option =>
                    option.setName("query")
                        .setDescription("name or url")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName("volume")
                .setDescription("調整音量")
                .addIntegerOption(option =>
                    option.setName("percent")
                        .setDescription("10 = 10%")
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName("options")
                .setDescription("音樂選項")
                .addStringOption(option =>
                    option.setName("options")
                        .setDescription("選擇選項")
                        .addChoices(
                            {name: "queue", value: "queue"},
                            {name: "skip", value: "skip"},
                            {name: "pause", value: "pause"},
                            {name: "resume", value: "resume"},
                            {name: "stop", value: "stop"},
                        )
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const {options, member, guild, channel} = interaction;
        const subcommand = options.getSubcommand();
        const query = options.getString("query");
        const volume = options.getInteger("percent");
        const option = options.getString("options");
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
            switch(subcommand) {
                case "play":
                    client.distube.play(voiceChannel, query, { textChannel: channel, member: member});
                    return interaction.reply({content: "🎵 收到要求"});
                case "volume":
                    client.distube.setVolume(voiceChannel, volume);
                    return interaction.reply({content: `🔊 音量已設定為 ${volume}%`});
                case "options":
                    const queue = await client.distube.getQueue(voiceChannel);
                    if(!queue) {
                        embed.setColor("Red").setDescription("沒有播放清單");
                        return interaction.reply({ embeds: [embed], ephemeral: true});
                    }
                    switch(option) {
                        case "skip":
                            await queue.skip(voiceChannel);
                            embed.setColor("Blue").setDescription("⏭️ 歌曲已被跳過");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "stop":
                            await queue.stop(voiceChannel);
                            embed.setColor("Blue").setDescription("⏭️ 歌曲已被停止");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "pause":
                            await queue.pause(voiceChannel);
                            embed.setColor("Blue").setDescription("⏭️ 歌曲已被暫停");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "resume":
                            await queue.resume(voiceChannel);
                            embed.setColor("Blue").setDescription("⏭️ 歌曲已重新播放");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "queue":
                            embed.setColor("Blue").setDescription(`${queue.songs.map(
                                (song, id) => `\n**${id + 1}**.**${song.name}** -\`${song.formattedDuration}\``
                            )}`);
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                    }

            }
        } catch (err) {
            console.log(err);
            embed.setColor("Blue").setDescription("⏭️發生了錯誤");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
    }
}