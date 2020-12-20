module.exports = {
	name: "unban",
	description: "unbans a member from the server",
	async execute(msg, args, Discord, bot) {
		if(msg.member.roles.cache.has("779011972037345290") || msg.member.roles.cache.has("779485290771251252") || msg.member.roles.cache.has("786288049670586429")) {
			
			if(args[0] === undefined) {
				msg.reply("Please, tag a person you want to unban.")
				return;
			}

			let bannedUser = msg.guild.members.cache.get(args[0].replace(/[<>&!@]/g, ""));

			if(!bannedUser.roles.cache.has("780898920083095633")) {
				msg.reply("This member is not banned!");
				return;
			} else if(bannedUser.roles.cache.has("779011972037345290") || bannedUser.roles.cache.has("779485290771251252") || bannedUser.roles.cache.has("786288049670586429")) {
				msg.reply("You want to unban a user that in priot cannot get banned? k...")
			}

			bannedUser.roles.remove("780898920083095633")

			let user = await bot.users.fetch(args[0].replace(/[<>&!@]/g, ""));

			let bannedDays = bot.bans.find((item) => item.user.id == bannedUser.id);

			let indexOfUser = bot.bans.indexOf(bot.bans.find(i => i.user.id === user.id))
			bot.bans.splice(indexOfUser, 1);

			const bannedUserEmbed = new Discord.MessageEmbed()
				.setColor("#000")
				.setTitle(`Unban by ${msg.author.tag}`)
				.setDescription(`**${user.username}#${user.discriminator}** has been unbanned!`)
				.setFooter(`Check #bans for further information!`)

			msg.channel.send(bannedUserEmbed)

		} else {
			msg.reply("You don't have the neccessary permissions to procceed this command!")
			return;
		}
	}
}