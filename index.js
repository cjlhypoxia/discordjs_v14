const {Client, GatewayIntentBits, Partials, Collection} = require("discord.js");
//const YoutubePoster = require('discord-youtube');
const {logsHandler} = require('./Handlers/logsHandler');
const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');
require('dotenv').config();
const { DiscordTogether } = require('discord-together');
const {DisTube} = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');
const logs = require('discord-logs');
const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});
logs(client, {
  debug: true
});
client.discordTogether = new DiscordTogether(client);
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  leaveOnEmpty: false,
  emitAddSongWhenCreatingQueue: true,
  plugins: [new SpotifyPlugin()]
});
//client.ytp = new YoutubePoster(client, {
//  loop_delay_in_min: 1
//});
client.commands = new Collection();
module.exports = client;
client.login(process.env.TOKEN).then(() => {
    logsHandler(client);
    loadEvents(client);
    loadCommands(client);
});
