const{model, Schema} = require('mongoose');
let videoSchema = new Schema({
    Guildid: String, 
    Channelid: String,
    Videoid: String,
});
module.exports = model("video", videoSchema);