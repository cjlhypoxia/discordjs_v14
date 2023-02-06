const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const Levels = require('discord.js-leveling');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('調整成員等級')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => 
        subcommand.setName('增加等級')
            .setDescription('增加成員等級')
            .addUserOption(option =>
                option.setName('目標')
                    .setDescription('選擇成員')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('等級')
                    .setDescription("要增加的等級")
                    .setMinValue(0)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('減少等級')
            .setDescription('減少成員等級')
            .addUserOption(option =>
                option.setName('目標')
                    .setDescription('選擇成員')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('等級')
                    .setDescription("要減少的等級")
                    .setMinValue(0)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('設定等級')
            .setDescription('設定成員等級')
            .addUserOption(option =>
                option.setName('目標')
                    .setDescription('選擇成員')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('等級')
                    .setDescription("要設定的等級")
                    .setMinValue(0)
                    .setRequired(true)
            )
    ),
    async execute(interaction) {
        const {options, guildId} = interaction;
        const sub = options.getSubcommand();
        const target = options.getUser("目標");
        const amount = options.getInteger("等級");
        const embed = new EmbedBuilder();
        try {
            switch (sub) {
                case "增加等級":
                    await Levels.appendLevel(target.id, guildId, amount);
                    embed.setDescription(`增加 ${target} 的 ${amount} 個等級`).setColor("Random").setTimestamp();
                    break;
                case "減少等級":
                    await Levels.subtractLevel(target.id, guildId, amount);
                    embed.setDescription(`減少 ${target} 的 ${amount} 個等級`).setColor("Random").setTimestamp();
                    break;
                case "設定等級":
                    await Levels.setLevel(target.id, guildId, amount);
                    embed.setDescription(`設定 ${target} 的等級為 ${amount}`).setColor("Random").setTimestamp();
                    break;                        
            }
        } catch (err) {
            console.log(err);
        }
        interaction.reply({ embeds: [embed], ephemeral: true});
    }
}