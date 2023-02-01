const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
const {training} = require("../../training.json");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.openAIKey,
});
const openai = new OpenAIApi(configuration);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("chat gpt")
        .addStringOption(option =>
            option.setName("問題")
                .setDescription("輸入問題")
                .setRequired(true)
        ),
    async execute(interaction) {
        const {user} = interaction;
        const prompt = interaction.options.getString("問題") ?? "";
        if(!interaction.member.roles.cache.has(process.env.chatrole)){
            await interaction.deferReply({ephemeral: true});
            return interaction.editReply({content: `你沒有使用該指令的權限！`, ephemeral: true});
        }  else {
        await interaction.deferReply();
        let tempModel = training;
        tempModel += `User: ${prompt}\n`;
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: tempModel,
            max_tokens: 200,
            temperature: 0,
        });
        const response = completion.data.choices[0].text;
        const prompt_tokens = completion.data.usage.prompt_tokens;
        const completion_tokens = completion.data.usage.completion_tokens;
        const total_tokens = completion.data.usage.total_tokens;
        const cleanedRes = response?.replace(/[\r\n]/gm, "") || "";
        const embed = new EmbedBuilder();
        embed.setColor("Random").setDescription(`**${prompt}** - <@${user.id}>\n\n${cleanedRes}\n\nAPI使用量 - ${total_tokens}`).setTimestamp();
        return interaction.editReply({embeds: [embed], ephemeral: false});
        }
    },
};

