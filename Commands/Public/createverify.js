const {EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createverify')
    .setDescription('設定認證頻道')
    .addChannelOption(option => 
        option.setName('頻道')
        .setDescription('傳送認證嵌入訊息至頻道')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('頻道');
        const verifyEmbed = new EmbedBuilder()
        .setTitle("認證")
        .setDescription('點擊按鈕認證即可查看頻道')
        .setColor(0x5fb041)
        let sendChannel = channel.send ({
            embeds: ([verifyEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('認證').setLabel('認證').setStyle(ButtonStyle.Success),
                ),
            ],
        });
        if (!sendChannel) {
            return interaction.reply({content: '發生了錯誤請稍後嘗試', ephemeral: true});
        } else {
            return interaction.reply({content: '認證頻道已設定成功', ephemeral: true});
        }
    },
};