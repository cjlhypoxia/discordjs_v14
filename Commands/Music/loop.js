const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const client = require("../../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("循環播放選項")
        .addStringOption(option =>
            option.setName("options")
                .setDescription("循環選項 關閉 單一 全部")
                .addChoices(
                    {name: "關閉", value: "off"},
                    {name: "單一", value: "song"},
                    {name: "全部", value: "queue"},
                )
                .setRequired(true)
            ),
        async execute(interaction) {
            const {member, options, guild} = interaction;
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
            try{
                const queue = await client.distube.getQueue(voiceChannel);
                if(!queue) {
                    embed.setColor("Red").setDescription("沒有播放清單");
                    return interaction.reply({embeds: [embed], ephemeral: true});
                }
                let mode = null;
                switch (option) {
                    case "off":
                        mode = 0;
                        break;
                    case "song":
                        mode = 1;
                        break;
                    case "queue":
                        mode = 2;
                        break;
                }
                mode = await queue.setRepeatMode(mode);
                mode = mode ? (mode === 2? "重複音樂清單" : "重複歌曲") : "關閉";
                embed.setColor("Orange").setDescription(`設定循環模式為 \`${mode}\``);
                return interaction.reply({ embeds: [embed], ephemeral: true});
            } catch (err) {
                console.log(err);
                embed.setColor("Blue").setDescription("⏭️發生了錯誤");
                return interaction.reply({ embeds: [embed], ephemeral: true});
            }
        }
}