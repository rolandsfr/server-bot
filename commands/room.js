module.exports = {
    name: "room",
    description: "Creates a voice chat room",
    async execute(msg, args, Discord, bot) {

    	let category = msg.guild.channels.cache.find(cat => cat.id === "778997646475526156");
    	let canCreateChannel = true;

    	category.children.each(channel => {
	    	if(channel.name.toLowerCase() == `${args[0]} by ${msg.author.tag}`.toLowerCase()) {
	    		msg.reply("There is already an existing channel with the exact same name!")
	    		canCreateChannel = false;
	    	} 
    	})

    	if(canCreateChannel) {
			var vc = await msg.guild.channels.create(`${args[0].toUpperCase()} by ${msg.author.tag}`, {type: "voice"})

			 // Creating game embed
		    const gameEmbed = new Discord.MessageEmbed()
				.setColor("#000")
				.setTitle(`Game by ${msg.author.tag}`)
				.setDescription("There's currently a place for you in the game lobby.")
				.addFields(
					{name: "Room", value: `${args[0].toUpperCase()} by ${msg.author.tag}`},
					{name: "State", value: `Pending`},
					{name: "Members", value: `0/10`}
				)
				.setFooter(`Room is currently filling in.`)

			// Sending the embed
			var sentEmbed = await bot.channels.cache.get("779905144115822612").send(gameEmbed)
			bot.games.push({channel: vc.id, embed: sentEmbed, room: `${args[0].toUpperCase()} by ${msg.author.tag}`, author: `Game by ${msg.author.tag}`})

		    bot.rooms.push({ id: vc.id, guild: vc.guild })

		    vc.setParent("778997646475526156");
		    msg.member.voice.setChannel(vc).then(() => {
		    	let newEmbed = new Discord.MessageEmbed()
		    	.setColor("#000")
				.setTitle(`Game by ${msg.author.tag}`)
				.setDescription("There's currently a place for you in the game lobby.")
				.addFields(
					{name: "Room", value: `${args[0].toUpperCase()} by ${msg.author.tag}`},
					{name: "State", value: `Pending`},
					{name: "Members", value: `1/10`}
				)
				.setFooter(`Room is currently filling in.`)

		    	sentEmbed.edit(newEmbed)
		    })

		    setTimeout(() => {

				for(let i = 0; i < bot.rooms.length; i++) {

					if(bot.rooms[i].guild.channels.cache.find(x => x.id == bot.rooms[i].id).members.size <= 0){
				        bot.rooms[i].guild.channels.cache.find(x => x.id == bot.rooms[i].id).delete()
				        // Channel has been deleted!
				        bot.rooms.pop();

				        bot.games[i].embed.delete();
						bot.games.splice(i, 1)
				    }
					
				}	

		    }, 10000)
    	}
	    
    }
}