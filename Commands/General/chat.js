const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
const path = require('path')
const fs = require('fs');
//const {training} = require("../../Data/training.json");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.openAIKey,
});
const openai = new OpenAIApi(configuration);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("向 ChatGPT 說說話 ( Model: gpt-3.5-turbo )")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("問題")
                .setDescription("輸入問題")
                .setRequired(true)
        ),
    async execute(interaction) {
        if(!interaction.member.roles.cache.has(process.env.chatrole)){
            await interaction.deferReply({ephemeral: true});
            return interaction.editReply({content: `你沒有使用該指令的權限！`, ephemeral: true});
        }  else {
            await interaction.deferReply();
            const {user} = interaction;
            const prompt = interaction.options.getString("問題");
            const prompt_text = { role: 'user', content: prompt };
            let pathfile = path.resolve('./Data/TextData', `${user.id}_txt.json`)
            if (fs.existsSync(pathfile)) {
                chat();
            } else {
                const data = {"messages":[]}
                fs.writeFileSync(path.resolve('./Data/TextData', `${user.id}_txt.json`), JSON.stringify(data))
                chat();
            }
            async function chat() {
                const arrjson = require(`../../Data/TextData/${user.id}_txt.json`)
                arrjson.messages.push(prompt_text);
                const message = arrjson.messages;
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo", //text-davinci-003
                    messages: message,
                    max_tokens: 200,
                    temperature: 0.2,
                });
                const response = completion.data.choices[0].message.content;
                arrjson.messages.push({ role: "assistant", content: response });
                if (arrjson.messages.length === 6 ) {
                    arrjson.messages.splice(0, 2);
                }
                var arrjsonstr = JSON.stringify(arrjson);
                fs.writeFileSync(`./Data/TextData/${user.id}_txt.json`, arrjsonstr)
                const total_tokens = completion.data.usage.total_tokens;
                const embed = new EmbedBuilder();
                embed.setColor("Random").setDescription(`**${prompt}** - <@${user.id}>\n\n**ChatGG：**${response}\n`).setFooter({ text:`API使用量 - ${total_tokens}` }).setTimestamp();
                return interaction.editReply({embeds: [embed], ephemeral: false});
            }
        
        //return console.log(message)
        //let tempModel = training;
        //tempModel += `User: ${prompt}\n`;
        
        
        //console.log(response)
        //const prompt_tokens = completion.data.usage.prompt_tokens;
        //const completion_tokens = completion.data.usage.completion_tokens;
        
        //console.log(prompt_tokens, completion_tokens, total_tokens)
        //const cleanedRes = response?.replace(/[\r\n]/gm, "") || ""; \n${cleanedRes}\n
        
        }
    },
};

