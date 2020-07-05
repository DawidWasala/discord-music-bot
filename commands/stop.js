module.exports = {
    name: 'stop',
    description: 'Stops current playing song',
    async execute(message){
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel to stop the music!");
        if (!serverQueue) return message.reply('There is nothing playing').catch(console.error);

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        serverQueue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
    }
}