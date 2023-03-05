const {EmbedBuilder} = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
const {guildid, newschannelid} = require('../../config.json');
const videoSchema = require('../../Models/YoutubeVideo');
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const guild = await client.guilds.cache.get(guildid);
        const channel = guild.channels.cache.get(newschannelid);
        client.checkVideo = async() => {
            videoSchema.find({ Guildid: guildid }, async (err, data) => {
                    if (!data) {
                        return
                    }
                    for(let i = 0; i < data.length; i++) {
                        const newdata = data[i];
                        const videodata = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${newdata.Channelid}`);
                        if (newdata.Videoid != videodata.items[0].id) {
                            const videoid = videodata.items[0].id;
                            newdata.Videoid = videoid;
                            newdata.save();
                            const embed = new EmbedBuilder().setDescription(`新影片上架了 !`).setColor('Random').setTimestamp();
                            await channel.send({embeds: [embed]});
                            await channel.send(videodata.items[0].link);
                        };
                    }
                }
            )
        }
        setInterval(client.checkVideo, 6 * 1000);
    }
}