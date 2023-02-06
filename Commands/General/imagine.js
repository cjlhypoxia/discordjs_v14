const {SlashCommandBuilder, AttachmentBuilder} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
require('dotenv').config();
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
        /**await interaction.deferReply();
        const text = interaction.options.getString("敘述");
        const configuration = new Configuration({
            apiKey: process.env.openAIKey,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createImage({
            prompt: text,
            n: 1,
            size: "512x512",
          });
        console.log(response)
        const image_url = response.data.data[0].url;
        const attachment = new AttachmentBuilder(`${image_url}`);
        return interaction.editReply({content: `**${text}** - ${interaction.user}`, files: [attachment]})*/
        const { default: midjourney } = await import('midjourney-client');
        const text = interaction.options.getString("敘述");
        const translated = await translate(text, {to: 'en'});
        console.log(translated);
        await interaction.deferReply();
        const response = await midjourney(translated.text);
        console.log(response);
        if (response.length < 1) {
            return interaction.editReply({content: `${interaction.user} 很抱歉無法生成圖片`, ephemeral: true});
        } else {
        const attachment = new AttachmentBuilder(`${response}`);
        return interaction.editReply({content: `**${text}** - ${interaction.user}`, files: [attachment]});
        }
    },
};