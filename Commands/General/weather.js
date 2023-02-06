const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("查看天氣")
    .addStringOption(option => 
        option.setName('城市')
        .setDescription("選擇城市")
        .addChoices(
            { name: "臺南市", value: "tainan" }
        )
        .setRequired(true)
    ),
    async execute(interaction, client) {
        let option = interaction.options.getString("城市")
        if (option === "tainan") {
            option = "%E5%AE%89%E5%8D%97%E5%8D%80";
        }
        if(interaction.member.roles.cache.has(process.env.chatrole)){
            fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-077?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&locationName=${option}`).then((response) => {
                return response.json();
            }).then((data) => {
                const test = data;
                const citytown = test.records.locations[0].location[0].locationName;
                console.log(citytown);
                return interaction.reply({ content: `${citytown}`})
            })
        } else {
            interaction.reply({content: `你沒有權限`, ephemeral: true})
        }
    },
};