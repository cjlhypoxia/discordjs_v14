const {SlashCommandBuilder, AttachmentBuilder} = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("使用AI生成圖片")
    .addStringOption(option => 
        option.setName("敘述")
        .setDescription("輸入想像的圖片樣貌")
        .setRequired(true)
    ),
    async execute(interaction) {
        const { default: midjourney } = await import('midjourney-client');
        const text = interaction.options.getString("敘述");
        const translated = await translate(text, {to: 'en'});
        interaction.deferReply();
        midjourney(translated.text).then(response => {
            if (response.length < 1) {
                return interaction.editReply({content: `${interaction.user} 很抱歉無法生成圖片`, ephemeral: true});
            }
            const attachment = new AttachmentBuilder(`${response}`);
            return interaction.editReply({content: `**${text}** - ${interaction.user}`, files: [attachment]});
        })
    },
};