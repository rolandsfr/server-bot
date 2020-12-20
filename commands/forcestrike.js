module.exports = {
    name: "forcestrike",
    description: "automatically adds another strike to a specified member",
    async execute(msg, args, Discord, bot) {

        let striker = msg.guild.members.cache.get(msg.author.id);

        if(striker.roles.cache.has("779011972037345290") || striker.roles.cache.has("779485290771251252") || striker.roles.cache.has("786288049670586429") || striker.roles.cache.has("787626200653627452")) {
            if(args[0]) {
                let userObj = msg.guild.members.cache.get(args[0].replace(/[<>@!]/g, ""))
                
                if(userObj.roles.cache.has("779011972037345290") || userObj.roles.cache.has("779485290771251252") || userObj.roles.cache.has("786288049670586429") || userObj.roles.cache.has("787626200653627452")) {
                    return msg.reply("You cannot strike a staff member!")
                } else {
                    // Then the user can be striked (here)

                    let strikedUserObj = bot.strikes.find(item => {return item.strikedUserId === args[0].replace(/[<>@!]/g, "")}) || false;

                    if(userObj.roles.cache.has("780898920083095633")) {
                       return msg.reply("This user is already banned!");
                    } 

                    let user = await bot.users.fetch(args[0].replace(/[<>&!@]/g, ""));
                    let userTag = `${user.username}#${user.discriminator}`;


                    if(!strikedUserObj) {
                        let newUserStrike = {...bot.strikedUserObj}; // copies a template of a striked user object template in index.js
                        newUserStrike.vouches = 0;
                        newUserStrike.canBeVouched = true;
                        newUserStrike.currentStrikes = 1;
                        newUserStrike.strikedUserId = args[0].replace(/[<>&!@]/g, "");

                        bot.strikes.push(newUserStrike)

                        console.log(bot.strikes)

                        return msg.channel.send(`**${userTag}** have received their first strike!`)
                    }
                    

                    strikedUserObj.currentStrikes += 1;

                    msg.channel.send(`**${userTag}** now has ${strikedUserObj.currentStrikes}/3 strikes!`)

                    if(strikedUserObj.currentStrikes == 3) {
                        msg.channel.send(`**${userTag}** has recieved all 3 strikes. <@${user.id}> has been banned for 30 days from now on.`)
                        userObj.roles.add("780898920083095633");

                        bot.bans.push({user: user, time: 30})

                        bot.setDaysTimeout(() => {
                            userObj.roles.remove("780898920083095633");
                            let indexOfUser = bot.bans.indexOf(bot.bans.find(i => i.user.id === user.id))
                            bot.bans.splice(indexOfUser, 1);
                        }, days)

                        return;
                    }
                }
            } else {
                return msg.reply("Please, specify a member you want to forcestrike.")
            }
        } else {
            return msg.reply("You must have moderator permissions to use this command.")
        }
       
    }
}