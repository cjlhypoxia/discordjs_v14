const {Client, ActivityType} = require('discord.js');
const mongoose = require('mongoose');
const Levels = require("discord.js-leveling");
require('dotenv').config();
const mongodb = process.env.mongodb;
mongoose.set('strictQuery', false);
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(mongodb || '', {
            keepAlive: true,
        });
        if (mongoose.connect) {
            console.log('MongoDB連接成功')
        }
        if (Levels.setURL(mongodb)) {
            console.log('MongoDB設定成功')
        }
        client.user.setPresence({status: "online"});
        client.user.setActivity("/play | /chat | /help", {type: ActivityType.Playing});
        console.log(`${client.user.username} 已經上線`);
    },
};