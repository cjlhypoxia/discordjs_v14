const {SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("刪除指定數量訊息")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName('數量')
        .setDescription('要刪除訊息的數量')
        .setRequired(true)
        )
    .addUserOption(option =>
        option.setName('目標')
        .setDescription('選擇要刪除訊息的目標')
        .setRequired(false)
        ),
    async execute(interaction) {
        const {channel, options} = interaction;
        const amount = options.getInteger('數量');
        const target = options.getUser('目標');
        const messages = await channel.messages.fetch({
            limit: amount + 1,
        });
        const res = new EmbedBuilder()
            .setColor(0x111111)
        if(target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((msg) => {
                if(msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`成功刪除${target}的${messages.size}則訊息`);
                interaction.reply({embeds: [res], ephemeral: true});
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`成功刪除在頻道的${messages.size}則訊息`);
                interaction.reply({embeds: [res], ephemeral: true});
            });
        }
    }
}