module.exports = {
    name: "createRoom",
    description: "Creates among us room",
    async execute(msg, args, Discord, bot) {

        var vc = await msg.guild.channels.create(`${args[0].toUpperCase()} by ${msg.author.tag}`, {type: "voice"})

	    bot.rooms.push({ id: vc.id, guild: vc.guild })
	    vc.setParent("778997646475526156");
	    msg.member.voice.setChannel(vc)
    }
}