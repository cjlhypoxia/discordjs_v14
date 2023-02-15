const {EmbedBuilder} = require('discord.js');
const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();
const {channelid_1} = require("../../video.json");
const {id_1} = require('../../video.json')
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.checkVideo = async() => {
            const data = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelid_1}`).catch(console.error);
            if (id_1 != data.items[0].id) {
                fs.writeFileSync(`./video.json`,JSON.stringify({id_1: data.items[0].id, channelid_1: channelid_1, id_2: null}))
                console.log('New video avaliable');
            } else return;
        };
        setInterval(client.checkVideo, 900 * 1000);
    }
}