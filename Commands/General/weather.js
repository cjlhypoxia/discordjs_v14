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
            { name: "臺南市", value: "tainan" },
            { name: "臺中市", value: "taichung" },
            { name: "嘉義市", value: "chiayi" }
        )
        .setRequired(true)
    ),
    async execute(interaction) {
        let option = interaction.options.getString("城市")
        if (option === "tainan") {
            //option = "%E5%AE%89%E5%8D%97%E5%8D%80";
            option = "467410";
        } else if (option === "taichung") {
            option = "467490";
        } else if (option === "chiayi") {
            option = "467480";
        }
        //https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option} #auto weather obs
        //https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option} #weather obs
        //https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-077?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&locationName=${option} #weather predict
        if(interaction.member.roles.cache.has(process.env.generalrole)){
            fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option}`).then((response) => {
                return response.json();
            }).then((data) => {
                const test = data;
                const city = test.records.location[0]["parameter"][0]["parameterValue"];
                const obst = test.records.location[0].time.obsTime;
                const temp =  test.records.location[0]["weatherElement"][3]["elementValue"];
                const humd = (test.records.location[0]["weatherElement"][4]["elementValue"]) * 100;
                const weather = test.records.location[0]["weatherElement"][20]["elementValue"];
                const embed = new EmbedBuilder()
                    .setTitle(`${city} 目前天氣`)
                    .setColor('Aqua')
                    .addFields(
                        { name: '溫度', value: `${temp} ℃`, inline: true },
                        { name: '濕度', value: `${humd} %`, inline: true },
                        { name: '天氣狀態', value: `${weather}`, inline: true },
                        { name: '觀測時間', value: `${obst}`, inline: false },
                        //{ name: '\u200B', value: '\u200B' },
                    )
                    .setFooter({ text: '資料來源：氣象局' })
                    .setTimestamp()
                return interaction.reply({ embeds: [embed] })
            })
        } else {
            interaction.reply({content: `你沒有權限`, ephemeral: true})
        }
    },
};