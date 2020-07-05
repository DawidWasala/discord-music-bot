const Discord = require('discord.js');
const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
    name: 'queue',
    description: 'Prints preety song queue',
    async execute(message){
        // message.channel.send(getPreetyQueue(message))
        getPreetyQueue(message)
    }
}


function getPreetyQueue(message){
    
    serverQueue = message.client.queue.get(message.guild.id);

    if (serverQueue.songs === undefined) return message.channel.send('There are no songs in queue')
    const description = serverQueue.songs.map((song, index) => `${index+1}. ${escapeMarkdown(song.title)} ${song.duration}`);

    let queueEmbed = new MessageEmbed()
        // .setColor("#")
        .setTitle("EvoBot Music Queue")
        .setDescription(description);


    const splitDescription = splitMessage(description, {
        maxLength: 2048,
        char: "\n",
        prepend: "prepend",
        append: "append"
    });

    splitDescription.forEach(async (m) => {
        queueEmbed.setDescription(m);
        message.channel.send(queueEmbed);
    });
}

