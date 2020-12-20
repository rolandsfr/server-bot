module.exports = {
	name: "clear",
	description: "clears messages",
	async execute(msg, args, Discord) {

		if(!msg.member.roles.cache.has("779485290771251252")) return msg.reply("You don't have the neccessary permissions to use this command!")

		if(!args[0]) return msg.reply("enter the amount of msgs u want to clear!");
		if(isNaN(args[0])) return msg.reply("Please enter a real number")
		if(args[0] > 100) return msg.reply("You can't delete more than 100 messages")
		if(args[0] < 1) return msg.reply("You can't delete less than a 1 message, dummy!")

		await msg.channel.messages.fetch({limit: args[0]}).then(msgs => {
			msg.channel.bulkDelete(msgs)
		})
	}
}