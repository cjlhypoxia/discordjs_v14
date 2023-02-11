const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const axios = require('axios');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("搜尋Tenor或Giphy的 GIF")
    .addStringOption(option =>
        option.setName('搜尋')
        .setDescription('輸入要搜尋的文字')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('平台')
        .setDescription('選擇平台')
        .addChoices(
            {name : "Tenor", value: "tenor"},
            {name : "Giphy", value: "giphy"}
        )
    ),

    async execute(interaction) {
        await interaction.deferReply();
        const platform = interaction.options.getString("平台")
        const text = interaction.options.getString("搜尋")
        const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=${process.env.tenorApiKey}&limit=5`
        const url1 = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.giphyApiKey}&q=${encodeURIComponent(text)}&limit=5&offset=0&rating=g&lang=zh-TW`
        const embed = new EmbedBuilder();
        async function tenorgif() {
            axios.get(url).then(async(res) => {
                const content = res.data.results[Math.floor(Math.random() * 5)];
                const contentdescri = content.content_description;
                const gifurl = content.media_formats.gif.url;
                const tenorgifurl = content.url;
                const button = new ActionRowBuilder()
                    .setComponents(new ButtonBuilder()
                        .setLabel('GIF 連結').setStyle(ButtonStyle.Link).setURL(tenorgifurl).setEmoji('🔗'),
                );
                await interaction.editReply({
                    embeds: [embed.setTitle(`${contentdescri} - Tenor`).setImage(gifurl).setURL(tenorgifurl).setColor('Random').setFooter({text : `${text} - ${interaction.user.tag}`}).setTimestamp()], 
                    
                    components: [button]
                });
            }).catch(async (err) => {
                console.log(err);
                await interaction.editReply({
                    content: "發生了錯誤...",
                });
            });
        }
        async function giphygif() {
                axios.get(url1).then(async(res) => {
                    let content = res.data.data[Math.floor(Math.random() * 5)];
                    const contenttitle = content.title;
                    const originalgifurl = content.images.original.url;
                    const gifurl = content.bitly_url;
                    const button = new ActionRowBuilder()
                    .setComponents(new ButtonBuilder()
                        .setLabel('GIF 連結').setStyle(ButtonStyle.Link).setURL(gifurl).setEmoji('🔗'),
                );
                await interaction.editReply({
                    embeds: [embed.setTitle(`${contenttitle} - Giphy`).setImage(originalgifurl).setURL(gifurl).setColor('Random').setFooter({text : `${text} - ${interaction.user.tag}`}).setTimestamp()], 
                    components: [button]
                });
            }).catch(async (err) => {
                console.log(err);
                await interaction.editReply({
                    content: "發生了錯誤...",
                });
            });
        }

        if (platform === "tenor") {
            tenorgif();
        }
        if (platform === "giphy") {
            giphygif();
        }
        if(!platform) {
            let gif = [tenorgif, giphygif];
            gif[Math.floor(Math.random() * gif.length)]();
        }
    },
}