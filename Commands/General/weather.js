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
            { name: "基隆市", value: "466940" },
            { name: "臺北市", value: "466920" },
            { name: "新北市", value: "466881" },
            { name: "桃園市（新屋）", value: "467050" },
            { name: "新竹縣", value: "467571" },
            { name: "臺中市", value: "467490" },
            { name: "彰化縣", value: "467270" },
            { name: "南投縣", value: "467650" },
            { name: "嘉義市", value: "467480" },
            { name: "臺南市", value: "467410" },
            { name: "高雄市", value: "467441" },
            { name: "屏東縣", value: "467590" },
            { name: "臺東縣", value: "467660" },
            { name: "花蓮縣", value: "466990" },
            { name: "宜蘭縣", value: "467080" },
            { name: "澎湖縣", value: "467350" },
            { name: "金門縣", value: "467110" },
            { name: "連江縣", value: "467990" },
        )
        .setRequired(true)
    ),
    async execute(interaction) {
        await interaction.deferReply();
        let option = interaction.options.getString("城市")
        /**var tf;
        if (option === "tainan") {
            option = "467410";
            tf = 1;
        } else if (option === "taichung") {
            option = "467490";
            tf = 1;
        } else if (option === "chiayi") {
            option = "467480";
            tf = 1;
        }
        if (!tf) { 
            if (option === "miaoli") {
                option = "C0E750";
            } else if (option === "taoyuan") {
                option = "C0C480";
            } 
            tf = 2;
        }*/
        //https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option} #auto weather obs
        //https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option} #weather obs
        //https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-077?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&locationName=${option} #weather predict
        if (interaction.member.roles.cache.has(process.env.generalrole)) {
            fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option}`).then((response) => {
                    return response.json();
                }).then((data) => {
                    const test = data;
                    const city = test.records.location[0]["parameter"][0]["parameterValue"];
                    const obst = test.records.location[0].time.obsTime;
                    const wdsd = test.records.location[0]["weatherElement"][2]["elementValue"];
                    const temp =  test.records.location[0]["weatherElement"][3]["elementValue"];
                    const humd = (test.records.location[0]["weatherElement"][4]["elementValue"]) * 100;
                    const r24 = test.records.location[0]["weatherElement"][6]["elementValue"];
                    const h_uvi = parseInt(test.records.location[0]["weatherElement"][13]["elementValue"]);
                    const d_tx = test.records.location[0]["weatherElement"][14]["elementValue"];
                    const weather = test.records.location[0]["weatherElement"][20]["elementValue"];
                    var a;
                    if (h_uvi >= 0 && h_uvi <= 2) {
                        a = `🟢   ${h_uvi}  （低量級）`;
                    } else if (h_uvi >= 3 && h_uvi <= 5) {
                        a = `🟡   ${h_uvi}  （中量級）`;
                    } else if (h_uvi >= 6 && h_uvi <= 7) {
                        a = `🟠   ${h_uvi}  （高量級）`;
                    } else if (h_uvi >= 8 && h_uvi <= 10) {
                        a =`🔴   ${h_uvi}  （過量級）`;
                    } else {
                        a = `🟣   ${h_uvi}  （危險級）`;
                    }
                    const embed = new EmbedBuilder()
                        .setTitle(`${city} 目前天氣`)
                        .setColor('Aqua')
                        .addFields(
                            { name: '溫度', value: `${temp} ℃`, inline: true },
                            { name: '濕度', value: `${humd} %`, inline: true },
                            { name: '天氣狀態', value: `${weather}`, inline: true },
                            { name: '風速', value: `${wdsd} m/s`, inline: true },
                            { name: '累積雨量', value: `${r24} mm`, inline: true },
                            { name: '紫外線指數', value: `${a}`, inline: true },
                            { name: '今日最高溫', value: `${d_tx} ℃`, inline: true },
                            { name: '觀測時間', value: `${obst}`, inline: false },
                            //{ name: '\u200B', value: '\u200B' },
                        )
                        .setFooter({ text: '資料來源：氣象局' })
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed] })
                })
            /**else if ( tf === 2) {
                fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${process.env.openWEATHERKey}&limit=1&format=JSON&stationId=${option}`).then((response) => {
                    return response.json();
                }).then((data) => {
                    const test = data;
                    const city = test.records.location[0]["parameter"][0]["parameterValue"];
                    const obst = test.records.location[0].time.obsTime;
                    const wdsd = test.records.location[0]["weatherElement"][2]["elementValue"];
                    const temp =  test.records.location[0]["weatherElement"][3]["elementValue"];
                    const humd = (test.records.location[0]["weatherElement"][4]["elementValue"]) * 100;
                    const r24 = test.records.location[0]["weatherElement"][6]["elementValue"];
                    const d_tx = test.records.location[0]["weatherElement"][10]["elementValue"];
                    const embed = new EmbedBuilder()
                        .setTitle(`${city} 目前天氣`)
                        .setColor('Aqua')
                        .addFields(
                            { name: '溫度', value: `${temp} ℃`, inline: true },
                            { name: '濕度', value: `${humd} %`, inline: true },
                            { name: '天氣狀態', value: `未提供`, inline: true },
                            { name: '風速', value: `${wdsd} m/s`, inline: true },
                            { name: '累積雨量', value: `${r24} mm`, inline: true },
                            { name: '紫外線指數', value: `未提供`, inline: true },
                            { name: '今日最高溫', value: `${d_tx} ℃`, inline: true },
                            { name: '觀測時間', value: `${obst}`, inline: false },
                            //{ name: '\u200B', value: '\u200B' },
                        )
                        .setFooter({ text: '資料來源：氣象局' })
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed] })
                })
            }*/
        } else {
            interaction.editReply({content: `你沒有權限`, ephemeral: true})
        }
    },
};