module.exports = {
    name: 'remove',
    description: 'Removes song from a queue',
    async execute(message){
        serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue == null){
            return;
        }
        const songNumber = message.content.split(' ')[1];
        if (songNumber === 0){
            return message.channel.send('Cannot remove currently playing song. Use skip command instead')
        }  
        if (serverQueue.songs[songNumber] === undefined){
            return message.channel.send(`No song with ${songNumber} number in queue`)
        }

        serverQueue.songs = serverQueue.songs.splice(songNumber);
        message.client.queue.set(message.guild.id, serverQueue) 
        message.reply('Removed ' + songNumber + ' song');
    }
}