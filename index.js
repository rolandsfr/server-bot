require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]}); // the bot instance

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

	client.rooms = [];
	client.games = [];
	client.vouches = [];
	client.strikes = [];
	client.strikeChannels = [];

	client.strikers = [];
	client.vouchers = [];

	client.strikedUserObj = {
		channelId: null,
		strikedUserId: null,
		vouches: null,
		canBeVouched: false,
		vouchers: [],
		striker: null,
		previousStrike: null,
		previousVouch: null,
		voice: null,
		strikedUserTag: null,
		currentStrikes: 0
	}

	client.ticketCounter = 0;
	client.ticketUsers = [];

	// Bans and strikes
	client.bans = [];
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


client.on("message", async msg => {
	if(!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/)
	const command = args.shift().toLowerCase();

	if(command === 'clear') {
		client.commands.get("clear").execute(msg, args, Discord)
	} else if(command === "room") {
		await client.commands.get("room").execute(msg, args, Discord, client)
	} else if(command === "strike") {
		client.commands.get("strike").execute(msg, args, Discord, client)
	} else if(command === "ban") {
		client.commands.get("ban").execute(msg, args, Discord, client)
	} else if(command === "unban") {
		client.commands.get("unban").execute(msg, args, Discord, client)
	} else if(command === "strikes") {
		client.commands.get("strikes").execute(msg, args, Discord, client)
	} else if(command === "ticket") {
		client.commands.get("ticket").execute(msg, args, Discord, client)
	} else if(command === "resolve") {
		client.commands.get("resolve").execute(msg, args, Discord, client)
	} else if(command === "forcestrike") {
		client.commands.get("forcestrike").execute(msg, args, Discord, client)
	} else if(command === "removestrike") {
		client.commands.get("removestrike").execute(msg, args, Discord, client)
	}
});

// THIS CODE is supposed to delete all empty voice channels (specifically those ones that are created by the command) 
// when the client.rooms actually starts to work

client.on("voiceStateUpdate", (oldMember, newMember) => {
	if(client.rooms.length > 0) {
		for(let i = 0; i < client.rooms.length; i++) {

			let roomIsFull = client.rooms[i].guild.channels.cache.find(x => x.id == client.rooms[i].id).members.size === 10 ? true: false;
			let state = roomIsFull ? "Full" : "Pending";
			let footer = roomIsFull ? "Room is currently full." : "Room is currently filling in.";
			let descr = roomIsFull ? "You can't currently join the queue" : "There's currently a place for you in the game lobby.";

			let newMemberSizeEmbed = gameEmbed = new Discord.MessageEmbed()
				.setColor("#000")
				.setTitle(`Game by ${client.games[i].author}`)
				.setDescription(descr)
				.addFields(
					{name: "Room", value: client.games[i].room},
					{name: "State", value: state},
					{name: "Members", value: `${client.rooms[i].guild.channels.cache.find(x => x.id == client.rooms[i].id).members.size}/10`}
				)
				.setFooter(footer)

			client.games[i].embed.edit(newMemberSizeEmbed)


			if(client.rooms[i].guild.channels.cache.find(x => x.id == client.rooms[i].id).members.size <= 0){
	            client.rooms[i].guild.channels.cache.find(x => x.id == client.rooms[i].id).delete()
	            // Channel has been deleted!
				client.rooms.splice(i, 1);

				client.games[i].embed.delete();
				client.games.splice(i, 1)

	         }
	        
		}
	}
})

client.setDaysTimeout = (callback,days) => {
    // 86400 seconds in a day
    let msInDay = 86400*1000; 

    let dayCount = 0;
    let timer = setInterval(function() {
        dayCount++;  // a day has passed

        if (dayCount === days) {
           clearInterval(timer);
           callback.apply(this, []);
        }
    }, msInDay);
};

client.login(process.env.API_KEY);