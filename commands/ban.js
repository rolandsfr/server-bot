module.exports = {
	name: "ban",
	description: "bans a member from the server",
	async execute(msg, args, Discord, bot) {	
		if(msg.member.roles.cache.has("779485290771251252")) {
			
			if(msg.channel.id != "789199233394933770") {
				return msg.reply("You can only use this command in #bans channel.");
			} else if(args[0] === undefined) {
				msg.reply("Please, tag a person you want to ban.")
				return;
			}

			let bannedUser = msg.guild.members.cache.get(args[0].replace(/[<>&!@]/g, ""));

			if(bannedUser.roles.cache.has("780898920083095633")) {
				msg.reply("This member is already banned!");
				return;
			} else if(bannedUser.roles.cache.has("779011972037345290") || bannedUser.roles.cache.has("779485290771251252") || bannedUser.roles.cache.has("786288049670586429") || bannedUser.roles.cache.has("787626200653627452")) {
				msg.reply("You can't ban a moderator!");
				return;
			} else if(isNaN(parseInt(args[1]))) {
				msg.reply("Please, using an integer, clearify the amount of days you want a person to get banned for.")
				return;
			}

			let days = parseInt(args[1]);

			bannedUser.roles.add("780898920083095633")

			let user = await bot.users.fetch(args[0].replace(/[<>&!@]/g, ""));

			bot.bans.push({user: user, time: parseInt(args[1])})

			bot.setDaysTimeout(() => {
				bannedUser.roles.remove("780898920083095633");
				let indexOfUser = bot.bans.indexOf(bot.bans.find(i => i.user.id === user.id))
				bot.bans.splice(indexOfUser, 1);
			}, days)

			const bannedUserEmbed = new Discord.MessageEmbed()
				.setColor("#000")
				.setTitle(`Ban by ${msg.author.tag}`)
				.setDescription(`**${user.username}#${user.discriminator}** has been banned for ${args[1]} days`)

			msg.channel.send(bannedUserEmbed)
		
		} else {
			msg.reply("You don't have the neccessary permissions to procceed this command!")
			return;
		}
	}
}