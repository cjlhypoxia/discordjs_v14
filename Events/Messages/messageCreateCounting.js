const countingSchema = require('../../Models/Counting');
const {EmbedBuilder} = require('discord.js');
module.exports = {
    name: "messageCreate",
    async execute(message) {
        const guildId = message.guild.id;
        if(message.author.bot) return;
        if(message.content.length === 0) return;
        if(isNaN(message.content)) return;
        countingSchema.findOne({GuildID: guildId}, async (err, data) => {
            if (!data || !data.Channel) return;
            const list = [
                `太笨了 ${data.Count} \n 新數字：\`1\``,
                `GG ${data.Count} \n 新數字：\`1\``,
                `QQ ${data.Count} \n 新數字：\`1\``
            ]
            if (message.channel.id === data.Channel) {
                if (message.author.id == data.LastPerson || message.content < data.Count || message.content > data.Count) {
                    const random = list[Math.floor(Math.random() * list.length)];
                    data.Count = 1
                    data.LastPerson = ""
                    data.save();
                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`<@${message.author.id}> ${random}`)
                            .setColor('Random')
                            .setTimestamp()
                        ]
                    }).then(msg => {
                        msg.react("😡")
                    })
                    return message.react("❌")
                }
                if (message.content == 10000 && data.Count == 10000) {
                    message.react("㊗️")
                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`重新開始 輸入\`1\``)
                            .setColor('Random')
                            .setTimestamp()
                        ]
                    })
                    data.Count = 1
                    data.LastPerson = ""
                    data.save()
                } else {
                    message.react("✅")
                    data.Count++
                    data.LastPerson = message.author.id
                    data.save()
                    if (err) {
                        console.log(err)
                    }
                    
                }
            }
        })
    }
}