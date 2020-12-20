module.exports = {
	name: "resolve",
	description: "resolves the ticket",
	async execute(msg, args, Discord, bot) {
        let guildMember = msg.guild.members.cache.get(msg.author.id);
        let ticketObj = bot.ticketUsers.find(item => {return item.currentTicket.id == msg.channel.id})

        console.log(ticketObj)

        if(guildMember.roles.cache.has("779011972037345290") || guildMember.roles.cache.has("779485290771251252") || guildMember.roles.cache.has("786288049670586429")) {
            if(msg.channel.name.includes("ticket-nr-")){
                let counter = 3;

                msg.channel.send("Closing in:")
                let interval = setInterval(() => {
                    msg.channel.send(counter)

                    ticketObj.canCreateTicket = true;

                    if(counter === 0) {
                        clearInterval(interval);
                        msg.channel.delete();
                    }

                    counter--;
                }, 1000)
            } else {
                return msg.reply("You can only close ticket channels with this command.")
            }
        } else {
            return msg.reply("You dont have the permissions to use this command!")
        }
		
	}
}