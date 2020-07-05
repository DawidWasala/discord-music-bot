const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

module.exports = {
    name: 'play',
    description: 'Plays a song',
    async execute(message){

        const serverQueue = message.client.queue.get(message.guild.id)

        const args = message.content.split(" ");
        args.shift();

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.reply("You need to be in a voice channel to play music!");

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.reply("I need the permissions to join and speak in your voice channel!");
        } 


        var song = null
        if (validURL(args[0])){
            try {
                songInfo = await ytdl.getInfo(args[0]);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: secondsToMinutesAndSeconds(songInfo.videoDetails.lengthSeconds)
                }
            } catch (error){
                return message.reply('Song couldn\'t be played').catch(console.error);
            }
        } else {
            try {
                songInfo = await ytsr(args.join(' '), {limit: 1})
                console.log(songInfo)
                song = {
                    title: songInfo.items[0].title,
                    url: songInfo.items[0].link,
                    duration: songInfo.items[0].duration
                }
                if (song.url === undefined) throw "No song exception";
            } catch (error){
                return message.reply("Couldn't find song").catch(console.error)
            }
        } 

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
            
        queueConstruct.songs.push(song);
        
        try {
            queueConstruct.connection = await voiceChannel.join();
            message.client.queue.set(message.guild.id, queueConstruct);
            play(queueConstruct.songs[0], message);
        } catch (err) {
            message.client.queue.delete(message.guild.id);
        }

    }
}

function play(song, message) {
    const serverQueue = message.client.queue.get(message.guild.id)
    if (!song) {
        serverQueue.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
    }
    //TODO catch too many redirects and 416 and Error: read ECONNRESET and install forever package
    //TODO songs are finishing 5 seconds to early
    console.log(ytdl(song.url))
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, {highWaterMark: 1<<25}))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(serverQueue.songs[0], message);
        })
        .on("error", () => message.reply('Couldnt play this song'));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);

    message.client.queue.set(message.guild.id, serverQueue);
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function secondsToMinutesAndSeconds(inputSeconds){
    var minutes = Math.floor(inputSeconds / 60)
    var seconds = inputSeconds - minutes * 60
    return minutes + ':' + seconds
}