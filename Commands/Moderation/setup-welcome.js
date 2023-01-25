const {Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const welcomeSchema = require("../../Models/Welcome");
const {model, Schema} = require('mongoose');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("setupwelcome")
    .setDescription("set wlecome message")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName("頻道")
        .setDescription("選擇歡迎訊息頻道")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("歡迎訊息")
        .setDescription("輸入歡迎訊息")
        .setRequired(true)
    )
    .addRoleOption(option => 
        option.setName("基本身分組")
        .setDescription("輸入歡迎身分組")
        .setRequired(true)
    ),
    async execute(interaction) {
        const {channel, options} = interaction;
        const welcomechannel = options.getChannel("頻道");
        const wlecomeMessage = options.getString("歡迎訊息")
        const roleId = options.getRole("基本身分組");
        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({content: "我沒有權限", ephemeral: true});
        }
        welcomeSchema.findOne({Guild: interaction.guild.id}, async(err, data) => {
            if(!data) {
                const newWelcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomechannel.id,
                    Msg: wlecomeMessage,
                    Role: roleId.id
                });
            }
            interaction.reply({content: '成功創建歡迎訊息', ephemeral: true});
        })
    }
}