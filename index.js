const {Client, GatewayIntentBits, Partials, Collection, TextChannel} = require("discord.js");
const {Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel} = Partials;
const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');
require('dotenv').config();
const {DisTube} = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});
client.commands = new Collection();
module.exports = client;
client.login(process.env.TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
});
