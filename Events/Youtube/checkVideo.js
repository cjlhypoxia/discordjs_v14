const {EmbedBuilder} = require('discord.js');
const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();
const {guildid, newschannelid, youtubechannelid} = require('../../config.json');
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const guild = await client.guilds.cache.get(guildid);
        const channel = guild.channels.cache.get(newschannelid);
        client.checkVideo = async() => {
            const data = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubechannelid}`).catch(console.error);
            const rawdata = fs.readFileSync(`${__dirname}/video.json`);
            const jsondata = JSON.parse(rawdata);
            if (jsondata.id_1 != data.items[0].id) {
                fs.writeFileSync(`./Events/Youtube/video.json`,JSON.stringify({id_1: data.items[0].id}))
                await channel.send(`${data.items[0].link}`)
            } else return;
        };
        setInterval(client.checkVideo, 6 * 1000);
    }
}