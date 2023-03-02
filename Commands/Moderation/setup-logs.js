const {SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits} = require('discord.js');
const logSchema = require('../../Models/Logs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-logs')
        .setDescription('日誌')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('頻道')
                .setDescription('設定日誌頻道')
                .setRequired(true)
        ),
        async execute(interaction) {
            const {guildId, options} = interaction;
            const logchannel = options.getChannel('頻道');
            const embed = new EmbedBuilder();
            logSchema.findOne({Guild: guildId}, async (err, data) => {
                if(!data) {
                    await logSchema.create({
                        Guild: guildId,
                        Channel: logchannel.id
                    });
                    embed.setDescription('成功設定日誌頻道')
                    .setColor('Random')
                    .setTimestamp();
                } else if (data) {
                    await logSchema.findOneAndDelete({ Guild: guildId });
                    await logSchema.create({
                        Guild: guildId,
                        Channel: logchannel.id
                    });
                    embed.setDescription('成功更新日誌頻道')
                    .setColor('Random')
                    .setTimestamp();
                }
                if (err) {
                    embed.setDescription('發生了錯誤')
                    .setColor('Red')
                    .setTimestamp();
                }
                return interaction.reply({ embeds: [embed], ephemeral: true});
            })
        }
}