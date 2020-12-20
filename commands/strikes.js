module.exports = {
	name: "strikes",
	description: "shows current amount of strikes a user has recieved",
	async execute(msg, args, Discord, bot) {
		let userId = args[0];

		if(!userId) {
			userId = msg.author.id;
		} else if(!isNaN(parseInt(args[0].replace(/[<>&!@]/g, "")))) {
			userId = args[0].replace(/[<>&!@]/g, "");
		} else {
			msg.reply("If you want to see amount of strikes of a certain user, tag him as parameter of the command.")
			return;
		}

		let user = await bot.users.fetch(userId);

		let strikesObj = bot.strikes.find(item => {return item.strikedUserId === userId}) || false;

		let strikes;

		if(!strikesObj) strikes = 0
		else strikes = strikesObj.currentStrikes;

		const strikesEmbed = new Discord.MessageEmbed()
			.setColor("#000")
			.setTitle(`${user.username}#${user.discriminator} currently has ${strikes} strikes`)
			.setFooter(`Use !strike <@member> to strike a member of the server.`)

		msg.channel.send(strikesEmbed)
	}
}