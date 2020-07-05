module.exports = {
    name: 'skip',
    description: 'Skips current song',
    async execute(message){
        const serverQueue = message.client.queue.get(message.guild.id)

        if (!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to stop the music!");
        if (!serverQueue) return message.channel.send("There's no song currently playing");

        serverQueue.connection.dispatcher.end();
        serverQueue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(console.error);
    }
}