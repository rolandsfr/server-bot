module.exports = {
	name: "ticket",
	description: "creates a ticket message",
	async execute(msg, args, Discord, bot) {
		const emoji = '📩';

		let embed = new Discord.MessageEmbed()
			.setColor("#000")
			.setTitle("React to create a ticket")
			.setDescription("Got any server related questions? Create a ticket by reacting under this message to get into a private text channel with our staff members.")
			.addFields(
				{name: "Your question might already be answered", value: "Check #rules and #bot-info before asking your question. If you do not find the answer, feel free to create a ticket."},
				{name: "Be patient", value: "Our staff members can be really busys so you will have to wait a bit before someone will have some free time to help you."},
				{name: "Nothing unrelated, please", value: "Our staff members have full rights to close a ticket with a topic that does not have anything to do with our server. Please, ask only related questions."}
			)

		let msgEmbed = await msg.channel.send(embed);
		msgEmbed.react(emoji)

		bot.on("messageReactionAdd", async(reaction, user) => {
			let userTicket = bot.ticketUsers.find(item => {return item.userId == user.id}) || false;

			if(user.id != "779001624973672469") {
				msgEmbed.reactions.resolve("📩").users.remove(user.id)
			}

			if(!userTicket || userTicket.canCreateTicket) {
				if(user.id != "779001624973672469") {
					msgEmbed.reactions.resolve("📩").users.remove(user.id)
	
					bot.ticketCounter++;
					let channel = await reaction.message.guild.channels.create(`ticket-nr-${bot.ticketCounter}`, {
						permissionOverwrites: [
							{
								id: user.id,
								allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
							}, {
								id: reaction.message.guild.roles.everyone,
								deny: ["VIEW_CHANNEL"]
							}
						],
						type: 'text', parent: "787687491510468618"				
					})

					const embed = new Discord.MessageEmbed()
						.setColor("#000")
						.setTitle(`Welcome to the ticket!`)
						.setDescription("Please describe the issue you have ran into and our staff member will be with you shortly")
					
					channel.send(`<@${user.id}>`)
					channel.send(embed)
					bot.ticketUsers.push({userId: user.id, canCreateTicket: false, currentTicket: channel})
				} 
			} else if(!userTicket.canCreateTicket) {
				return;
			}
		})
	}
}