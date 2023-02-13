const {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require('discord.js');
const voiceSchema = require('../../Models/VoiceState');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("vleaderboard")
    .setDescription("查看成員在語音頻道的時間排名"),
    execute(interaction) {
       const guild = interaction.guild.id;
       voiceSchema.find({Guild: guild}, async (err, data) => {
            if(data.length === 0) {
                interaction.reply({content: '還沒有紀錄，趕快加入語音頻道！', ephemeral: true});
            } else {
                function up(x, y) {
                    return x.Time - y.Time
                }
                let i = 1;
                data.sort(up)
                const slicedata = data.slice(0, data.length || 5)
                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.guild}的語音時間排名`)
                    .setDescription(slicedata.map((x) => {
                            return `**第 ${i++}. ** <@${x.User}> **${(x.Time).toFixed(2)} 秒**`;
                            //\n \`紀錄時間 ${x.StartTimeStamp}-${x.EndTimeStamp}\`
                        }).join("\n\n")
                    )
                    .setColor('Random')
                    .setTimestamp();
                return interaction.reply({embeds: [embed]})
            }
        }
    )},
};