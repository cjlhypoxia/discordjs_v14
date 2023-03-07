const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
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
        //let tempModel = training;
        //tempModel += `User: ${prompt}\n`;
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", //text-davinci-003
            messages: [
                //{role: "user", content: "人一天要喝多少水?"},
                //{role: "assistant", content: "根据世界卫生组织的建议，成年人每天应该喝6-8杯水，即约2-2.5升水。然而，这个建议并不适用于每个人，因为每个人的身体状况、活动水平和环境条件都不同。因此，最好的方法是根据自己的身体需要来确定每天需要喝多少水。"},  //role 類型: user, system, assistant 
                //{role: "user", content: "那水的內容物會影響身體嗎?"},
                //{role: "assistant", content: "是的，水的成分和质量会影响身体健康。一般来说，纯净的水对身体最好，因为它不含任何有害物质。但是，如果水中含有过多的矿物质、重金属、细菌或化学物质，就会对身体产生负面影响。例如，含有过多矿物质的水可能会导致肾结石，含有过多重金属的水可能会导致中毒，含有细菌或化学物质的水可能会导致感染或其他健康问题。因此，选择高质量的水非常重要，最好是通过过滤"},
                //{role: "user", content: "那要如何過濾水?"},
                {role: "user", content: `${prompt}`},
            ],
            max_tokens: 200,
            temperature: 0,
        });
        const response = completion.data.choices[0].message.content;
        //console.log(response)
        //const prompt_tokens = completion.data.usage.prompt_tokens;
        //const completion_tokens = completion.data.usage.completion_tokens;
        const total_tokens = completion.data.usage.total_tokens;
        //const cleanedRes = response?.replace(/[\r\n]/gm, "") || ""; \n${cleanedRes}\n
        const embed = new EmbedBuilder();
        embed.setColor("Random").setDescription(`**${prompt}** - <@${user.id}>\n\n**ChatGG：**${response}\n`).setFooter({ text:`API使用量 - ${total_tokens}` }).setTimestamp();
        return interaction.editReply({embeds: [embed], ephemeral: false});
        }
    },
};

