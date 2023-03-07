const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const voiceSchema = require('../../Models/VoiceState');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration);
module.exports = {
    data: new SlashCommandBuilder()
    .setName("voicerank")
    .setDescription("查看成員在語音頻道時間的前五名")
    .setDMPermission(false),
    execute(interaction) {
        const guild = interaction.guild.id;
        voiceSchema.find({Guild: guild}, async (err, data) => {
            if(data.length === 0) {
                interaction.reply({content: '還沒有紀錄，趕快加入語音頻道！', ephemeral: true});
            } else {
                function up(x, y) {
                    return y.Time - x.Time
                }
                let i = 1;
                let max;
                if (data.length >= 5) {
                    max = 5
                } else {
                    max = data.length;
                }
                data.sort(up)
                const slicedata = data.slice(0, max)
                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.guild}的語音時間前五名`)
                    .setDescription(slicedata.map((x) => {
                            return `**第 ${i++} - **<@${x.User}>** ${dayjs.duration(x.Time, "seconds").format('D日 H時 m分 ss秒')}**`;
                            //\n \`紀錄時間 ${x.StartTimeStamp}-${x.EndTimeStamp}\`
                        }).join("\n\n")
                    )
                    .setColor('Random')
                    .setFooter({text: `進出語音頻道才會更新時間`})
                    .setTimestamp();
                return interaction.reply({embeds: [embed]})
            }
        }
    )},
};