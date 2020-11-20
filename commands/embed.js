module.exports = {
	name: "embed",
	description: "embed command",
	execute(msg, args, Discord) {

		const newEmbed = new Discord.MessageEmbed()
			.setColor("#000")
			.setTitle("Rules")
			.setURL("https://callisto-proto.netlify.app")
			.setDescription("This is the embed for server rules")
			.addFields(
				{name: "Rule 1", value: "Have braincells"},
				{name: "Rule 2", value: "Have at least 2 braincells"}
			)
			.setFooter("y r u in the fotter, dummy!")

		msg.channel.send(newEmbed)
	}
}