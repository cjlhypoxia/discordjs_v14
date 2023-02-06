const { Client, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const accountSchema = require('../../Models/Account');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('查看餘額、建立或刪除你的帳戶')
    .addStringOption(option => 
        option.setName('options')
        .setDescription('選擇選項')
        .setRequired(true)
        .addChoices(
            { name: "建立", value: "create"},
            { name: "刪除", value: "delete"},
            { name: "餘額", value: "balance"}
        )
    ),
    async execute(interaction) {
        const { options, user, guild } = interaction;
        const option = options.getString("options");
        let Data = await accountSchema.findOne({ Guild: interaction.guild.id, User: user.id }).catch(err => { })
        switch (option) {
            case "create": {
                if (Data) return interaction.reply({ content: "你已經有帳戶了", ephemeral: true})
                Data = new accountSchema({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Bank: 0,
                    Wallet: 1000
                })
                await Data.save()
                interaction.reply({ content: `你已經成功建立帳戶並得到 ${Data.Wallet} 在您的錢包內`, ephemeral: true});
            }
            break;
            case "balance": {
                if(!Data) return interaction.reply({ content: "請先建立帳戶", ephemeral: true});
                const embed = new EmbedBuilder()
                    .setTitle(`帳戶餘額`)
                    .setColor('Random')
                    .setDescription(`<@${user.id}>\n**Bank:** ${Data.Bank}\n**Wallet:** ${Data.Wallet}\n**總餘額:** ${Data.Bank + Data.Wallet} `);
                await interaction.reply({ embeds: [embed] })
            }
            break;
            case "delete": {
                if(!Data) return interaction.reply({ content: "請先建立帳戶", ephemeral: true});
                await Data.delete()
                interaction.reply({ content: "你的帳戶已成功刪除", ephemeral: true});
            }
            break;
        }
    }
}