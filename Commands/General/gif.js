const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const axios = require('axios');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("搜尋 Tenor 的 GIF")
    .addStringOption(option =>
        option.setName('搜尋')
        .setDescription('輸入要搜尋的文字')
        .setRequired(true)
    ),
    async execute(interaction) {
        await interaction.deferReply();
        const search = interaction.options.getString("搜尋")
        const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(search)}&key=${process.env.tenorApiKey}&limit=5`
        const embed = new EmbedBuilder();
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
                embeds: [embed.setTitle(`${contentdescri}`).setImage(gifurl).setURL(tenorgifurl).setColor('Random').setFooter({text : `${search} - ${interaction.user.tag}`}).setTimestamp()], 
                
                components: [button]
            });
        }).catch(async (err) => {
            console.log(err);
            await interaction.editReply({
                content: "發生了錯誤...",
            });
        });
    },
}