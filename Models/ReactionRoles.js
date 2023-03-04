const {model, Schema} = require('mongoose');
let reactionRoles = new Schema({
    GuildId: String,
    Roles: Array
})
module.exports = model('ReactionRoles', reactionRoles);