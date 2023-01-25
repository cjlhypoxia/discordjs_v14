const {Client} = require('discord.js');
const mongoose = require('mongoose');
const config = require("../../config.json");
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });
        if (mongoose.connect)
            console.log('MongoDB連接成功')
        console.log(`${client.user.username} 已經上線`);
    },
};