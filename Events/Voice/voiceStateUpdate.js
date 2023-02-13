const client = require('../../index');
const voiceSchema = require('../../Models/VoiceState');
//Bug 假如機器人過久沒上線但成員已經在語音頻道，則在機器人再次上線後，退出語音頻道將會得到更多時間。
client.on('voiceStateUpdate', (oldState, newState) => {
    const guild = newState.guild.id;
    const user = newState.id
    const channelid = newState.channelId;
    var timer = new Date();
    voiceSchema.findOne({ Guild: guild, User: user }, async (err, data) => {
        if (!data) {
            return voiceSchema.create({
                Guild: guild,
                User: user,
                Time: 0,
                TimeStamp: timer.getTime(),
                StartTimeStamp: timer.toLocaleString(),
                EndTimeStamp: timer.toLocaleString()
            });
        }
        if (channelid != null) {
            var oldtime = timer.getTime();
            data.TimeStamp = oldtime;
            data.save()
        } else {
            var newtime = timer.getTime();
            var totaltime = ((newtime - data.TimeStamp) / 1000);
            data.Time = data.Time + totaltime;
            data.EndTimeStamp = timer.toLocaleString();
            data.save()
        }
    })
})