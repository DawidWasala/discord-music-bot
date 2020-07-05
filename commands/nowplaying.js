module.exports = {
    name: 'nowplaying',
    description: 'Prints now playing song',
    async execute(message){
        const serverQueue = message.client.queue.get(message.guild.id);
        return await message.reply(`Now playing: ${serverQueue.songs[0]}`);
    }
}