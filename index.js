const Discord = require("discord.js");
const client = new Discord.Client(); // the bot instance

const prefix = "!";

const fs = require("fs");

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command)
}

// Showing the message when the not gets on
client.once('ready', () => {
	console.log("pog, the bot is online")
});

// Greetings
client.on("guildMemberAdd", member => {
	member.roles.add("779030692217749524").catch(err => console.error(err))
	client.channels.cache.get('779040987036516404').send(`Hello there, ${member.user.toString()}`)
})

// Saying Cya when user leaves
client.on("guildMemberRemove", member => {
	client.channels.cache.get('779040987036516404').send(`Cya **${member.user.tag}**!`)
})

client.rooms = [];

client.on("message", msg => {
	if(!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/)
	const command = args.shift().toLowerCase();

	if(command === 'embed') {
		client.commands.get("embed").execute(msg, args, Discord)
	} else if(command === 'clear') {
		client.commands.get("clear").execute(msg, args, Discord)
	} else if(command === "createroom") {
		client.commands.get("createRoom").execute(msg, args, Discord, client)
		console.log(client.rooms[0]) // 1st off i wanna see if i can just get the value out of this just for the sake of testing
	}
});

// THIS CODE is supposed to delete all empty voice channels (specifically those ones that are created by the command) 
// when the client.rooms actually starts to work

// client.on("voiceStateUpdate", () => {
// 			if(client.rooms.length > 0) {
// 				for(let i = 0; i < client.rooms.length; i++) {
// 					let room = client.rooms[i].guild.channels.find(x => x.id == client.rooms[i].id)

// 					if(client.rooms.members.size <= 0){
// 			              client.rooms.delete()
// 			             // Channel has been deleted!
// 			         }
// 				}
// 			}
// 		})

client.login("secret token");