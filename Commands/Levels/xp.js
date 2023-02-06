const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const Levels = require('discord.js-leveling');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('調整成員經驗')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => 
        subcommand.setName('增加經驗')
            .setDescription('增加成員經驗')
            .addUserOption(option =>
                option.setName('目標')
                    .setDescription('選擇成員')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('數量')
                    .setDescription("經驗數量")
                    .setMinValue(0)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('減少經驗')
            .setDescription('減少成員經驗')
            .addUserOption(option =>
                option.setName('目標')
                    .setDescription('選擇成員')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('數量')
                    .setDescription("經驗數量")
                    .setMinValue(0)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('設定經驗')
            .setDescription('設定成員經驗')
            .addUserOption(option =>
                option.setName('目標')
                    .setDescription('選擇成員')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('數量')
                    .setDescription("經驗數量")
                    .setMinValue(0)
                    .setRequired(true)
            )
    ),
    async execute(interaction) {
        const {options, guildId} = interaction;
        const sub = options.getSubcommand();
        const target = options.getUser("目標");
        const amount = options.getInteger("數量");
        const embed = new EmbedBuilder();
        try {
            switch (sub) {
                case "增加經驗":
                    await Levels.appendXp(target.id, guildId, amount);
                    embed.setDescription(`增加 ${target} ${amount} 的經驗`).setColor("Random").setTimestamp();
                    break;
                case "減少經驗":
                    await Levels.subtractXp(target.id, guildId, amount);
                    embed.setDescription(`減少 ${target} ${amount} 的經驗`).setColor("Random").setTimestamp();
                    break;
                case "設定經驗":
                    await Levels.setXp(target.id, guildId, amount);
                    embed.setDescription(`設定 ${target} 的經驗為 ${amount}`).setColor("Random").setTimestamp();
                    break;                        
            }
        } catch (err) {
            console.log(err);
        }
        interaction.reply({ embeds: [embed], ephemeral: true});
    }
}