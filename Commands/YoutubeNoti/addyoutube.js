const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const videoSchema = require('../../Models/YoutubeVideo');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addyoutube")
        .setDescription("新增Youtube通知的頻道ID")
        .addStringOption(option => 
            option.setName("頻道")
            .setDescription("輸入頻道ID")
            .setRequired(true)
        ),
    async execute(interaction) {
        const guildid = interaction.guild.id;
        const channelid = interaction.options.getString('頻道');
        videoSchema.findOne({ Guildid: guildid, Channelid: channelid}, async (err, data) => {
            if (!data) {
                await videoSchema.create({
                    Guildid: guildid,
                    Channelid: channelid,
                    Videoid: ''
                });
                const embed = new EmbedBuilder().setColor('Green').setDescription('新增頻道成功').setTimestamp();
                interaction.reply({embeds: [embed], ephemeral: true});
            }
        })
    },
};