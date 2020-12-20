// TODO
// Make the object with the striker accessible at the moment of checking if user has just been striked by the person.
// (So that can't double strike)

module.exports = {
	name: "strike",
	description: "creates striking channel",
	async execute(msg, args, Discord, bot) {

		if(!args[0]) return msg.reply("Please, either use ``vouch``, ``close`` or tag a member to use a certain functionality of this command. Refer to #bot-info for more details.")

    	let category = msg.guild.channels.cache.find(cat => cat.id === "780464888073289740");
    	// If the command argument is "close" then check the channel and close it

		let currentStrikedObj = bot.strikes.find(item => {return item.channelId === msg.channel.id}) || false;

    	let isChannel = true;
		if(args[0] === "close") {

			if(msg.channel.id === currentStrikedObj.channelId) {
				if(msg.author.id !== currentStrikedObj.striker) {
					msg.reply("You can't close this channel since it can be done only by striker.")
					isChannel = false;
					return;
				}
				let counter = 3;

				msg.channel.send("Closing in:")
				let interval = setInterval(() => {
					msg.channel.send(counter)

					if(counter === 0) {
						clearInterval(interval);
						msg.channel.delete();
					}

					counter--;
				}, 1000)

				isChannel = false;
			}

			if(!isChannel) return;

			if(isChannel) {
				msg.reply("You can only close your strike channels!")
				return;
			}
		}

		let voucherObj = bot.vouchers.find((item) => {return item.userId === msg.author.id || false});

		if(args[0] === "vouch") {

			currentStrikedObj = bot.strikes.find(item => {return item.channelId === msg.channel.id}) || false;

			if(msg.channel.id === currentStrikedObj.channelId) {
				bot.strikedUserObj.vouchers.push(msg.author.id)

				let strikedObj = bot.strikes;

				let strikedUser = strikedObj.find((item) => {return item.channelId === msg.channel.id})

				console.log(voucherObj)

				if(strikedObj.length === 0) {
					msg.reply("There's noone to vouch right now!")
					return;
				} else if(strikedUser.canBeVouched) {
					if(msg.author.id === strikedUser.striker) {
						msg.reply("Sorry, you can't vouch because you are the one who striked.")
						return;
					} else if(msg.author.id === strikedUser.strikedUserId) {
						msg.reply("You can't vouch for yourself!")
						return;
					} else if(voucherObj) {
						if(voucherObj.vouchedPersonId == strikedUser.strikedUserId) {
							msg.reply("You can't doublevouch.")
							return;
						}
					}

				}

				if(strikedUser.voice.members.size >= 6) {
					strikedUser.vouches += 1;

					if(voucherObj) {
						voucherObj.vouchedPersonId = strikedUser.strikedUserId;
					} else {
						bot.vouchers.push({userId: msg.author.id, vouchedPersonId: strikedUser.strikedUserId})
					}


					(async() => {
						let user = await bot.users.fetch(strikedUser.strikedUserId);
						let userTag = `${user.username}#${user.discriminator}`;
						let reqs = (strikedUser.voice.members.size - 1) / 2;

						if(strikedUser.vouches >= Math.trunc(Math.floor(reqs))) {

							msg.channel.send(`${userTag} has ${strikedUser.vouches}/${Math.trunc(Math.floor(reqs))} vouches`)


							strikedUser.vouches = 0;

							if(strikedUser.currentStrikes < 2) {			
								strikedUser.currentStrikes += 1;

								msg.channel.send(`${userTag} now has ${strikedUser.currentStrikes}/3 strikes!`)
								msg.channel.send(`<@${strikedUser.striker}> please use \`!strike close\` to close this channel or it will be automatically deleted!`)
							
								return;
							}

							// Adding ban role
							let sentMsg = bot.bannedUserMsgIntance;
							sentMsg = bot.bannedUserMsgIntance;
							strikedUser.currentStrikes = 3;
							bot.bans.push({user: user, time: 30})
							let guildmember = msg.guild.members.cache.get(strikedUser.strikedUserId)

							guildmember.roles.add("780898920083095633");

							sentMsg.edit(bot.bannedUserMsg)

							// Remove ban role after 30 days
							bot.setDaysTimeout(() => {
								guildmember.roles.remove("780898920083095633")
								strikedUser.currentStrikes = 0;

								let indexOfUser = bot.bans.indexOf(bot.bans.find(i => i.user.id === user.id))
								bot.bans.splice(indexOfUser, 1);
							}, 30)

							msg.channel.send(`${userTag} has recieved all 3 strikes. <@${user.id}> has been banned for 30 days from now on.`)
							msg.channel.send(`<@${strikedUser.striker}> please use \`!strike close\` to close this channel or it will be automatically deleted!`)
							return;
						}

					})()
					
				} else {
					msg.reply("sorry, too few players in the game voice chat to vouch the player.\nYou can vouch the player once you have at least 6 players in the lobby.")
				}

			} else {
				msg.reply("You can only vouch in strike channels!");
				return;
			}
			

			return;
		}

    	let canCreateChannel = true;

    	category.children.map(channel => {
			if(channel.name.toLowerCase() === `strike-by-${msg.author.tag.replace("#", "").toLowerCase()}`) {
    			canCreateChannel = false;
			}

    	})

    	let reason = "";

    	args.map((word) => {
    		if(args.indexOf(word) !== 0) {
    			reason += `${word} `;
    		}
    	})

    	let voiceChannelCategory = msg.guild.channels.cache.find(cat => cat.id === "778997646475526156");

		let isInVc = false;
		let voice;

		voiceChannelCategory.children.forEach((vc) => {
			for([memberId, member] of vc.members) {
				if(member.user.id === msg.author.id) {
					isInVc = true;
					voice = vc;
				}
			}
		});

		let guildmemberTemp = msg.guild.members.cache.get(args[0].replace(/[<>&!@]/g, ""));

		let strikerUser = bot.strikers.find((item) => item.userId === msg.author.id) || false;

		let strikedUser = bot.strikes.find((item) => {return item.channelId === msg.channel.id})

		console.log

    	if(!canCreateChannel) {
			msg.reply("\nPlease close your strike channel using command `!strike close` before starting another report.")
			return;
    	} else if(!memberExists(args[0])) {
    		msg.reply("Please, tag a server member as command's argument");
    		return;
    	} else if(reason === "") {
    		msg.reply("Please, clearify reason of striking the player after tagging him.")
    		return;
    	} else if(!isInVc) {
    		msg.reply("In order to strike someone, you have to be in a game lobby voice channel with other players.")
    		return;
    	} else if(msg.author.id === args[0].replace(/[<>&!@]/g, "")) {
			msg.reply("You can't strike yourself!");
			return;
		} else if(guildmemberTemp.roles.cache.has("780898920083095633")) {
			msg.reply("You can't strike a member that is already banned!")
			return;
		} else if(strikerUser.strikedPersonId === args[0].replace(/[<>&!@]/g, "")) {
			msg.reply("You can't strike this member because they were just previously striked by you!")
			return;
		} else if(guildmemberTemp.roles.cache.has("779011972037345290") || guildmemberTemp.roles.cache.has("779485290771251252") || guildmemberTemp.roles.cache.has("786288049670586429")) {
			msg.reply("You can't strike a staff member!");
			return;
		} else if(guildmemberTemp.roles.cache.has("787626200653627452")) {
			msg.reply("You can't strike a bot!")
			return;
		} else if(voucherObj) {
			if(voucherObj.vouchedPersonId == args[0].replace(/[<>&!@]/g, "")) {
				msg.reply("You can't strike a person that you have just vouched for.")
				return;
			}
		} 

		var strike = await msg.guild.channels.create(`strike-by-${msg.author.tag}`, {type: "text"})
		strike.setParent("780464888073289740");

		if(isInVc) {
			let pretext = `<@${msg.author.id}> striked ${args[0]} for the reason "${reason}". You want to vouch?\n`
			let strikeMsg = ""
			for([memberId, member] of voice.members) {
				if(member.user.id === msg.author.id) continue;
				strikeMsg += `<@${member.user.id}> `
			}
			strike.send(pretext + strikeMsg)

			let newUserStrike = {...bot.strikedUserObj}; // copies a template of a striked user object template in index.js
			newUserStrike.vouches = 0;
			newUserStrike.canBeVouched = true;
			newUserStrike.channelId = strike.id;
			newUserStrike.striker = msg.author.id;
			newUserStrike.voice = voice;
			newUserStrike.strikedUserId = args[0].replace(/[<>&!@]/g, "");

			let strikerObj = bot.strikers.find((item) => item.userId === msg.author.id) || false;

			if(strikerObj) {
				strikerObj.strikedPersonId = args[0].replace(/[<>&!@]/g, "")
			} else {
				bot.strikers.push({userId: msg.author.id, strikedPersonId: args[0].replace(/[<>&!@]/g, "")})
			}

			bot.strikes.push(newUserStrike) // pushes new striked user object in an array with currently actice strikes
		}

		function memberExists(member) {
			const guild = bot.guilds.cache.get("778997646475526154"); 
			return guild.member(member.replace(/[<>&!@]/g, ""));
		}

		// Automatically deleting report channel after 20 minutes
		setTimeout(() => {
			strike.delete();
		}, 1000 * 60 * 20)

	}
}