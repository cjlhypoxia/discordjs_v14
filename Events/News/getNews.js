const {EmbedBuilder} = require('discord.js');
const Parser = require('rss-parser');
const fs = require('fs');
const {guildid, newschannelid} = require('../../config.json');
const parser = new Parser();
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const guild = await client.guilds.cache.get(guildid);
        const channel = guild.channels.cache.get(newschannelid);
        client.checkNews = async() => {
            const data = await parser.parseURL(`https://www.cdc.gov.tw/RSS/RssXml/Hh094B49-DRwe2RR4eFfrQ?type=1`).catch(console.error);
            const rawdata = fs.readFileSync(`${__dirname}/newsdata.json`);
            const jsondata = JSON.parse(rawdata);
            if (jsondata.link != data.items[0].link) {
                fs.writeFileSync(`./Events/News/newsdata.json`,JSON.stringify({link: data.items[0].link}));
                const url = data.items[0].link;
                const newstitle = data.items[0].title;
                const embed = new EmbedBuilder().setTitle(newstitle).setURL(url).setColor('Random').setTimestamp();
                await channel.send({embeds: [embed]})
            } else return;
        };
        setInterval(client.checkNews, 5 * 1000);
    }
}