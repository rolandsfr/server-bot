module.exports = {
    name: "removestrike",
    description: "removes one strike from a specified member",
    async execute(msg, args, Discord, bot) {

        let striker = msg.guild.members.cache.get(msg.author.id);

        if(striker.roles.cache.has("779011972037345290") || striker.roles.cache.has("779485290771251252") || striker.roles.cache.has("786288049670586429") || striker.roles.cache.has("787626200653627452")) {
            if(args[0]) {
                let userObj = msg.guild.members.cache.get(args[0].replace(/[<>@!]/g, ""))
                
                if(userObj.roles.cache.has("779011972037345290") || userObj.roles.cache.has("779485290771251252") || userObj.roles.cache.has("786288049670586429") || userObj.roles.cache.has("787626200653627452")) {
                    return msg.reply("You cannot remove a strike from a staff member!")
                } else {
                    // Then the strike can be removed (here)

                    let strikedUserObj = bot.strikes.find(item => {return item.strikedUserId === args[0].replace(/[<>@!]/g, "")}) || false;

                    if(userObj.roles.cache.has("780898920083095633")) {
                       return msg.reply("This user is banned so you cannot use this command. Use `!unban <@member> instead`");
                    } 

                    let user = await bot.users.fetch(args[0].replace(/[<>&!@]/g, ""));
                    let userTag = `${user.username}#${user.discriminator}`;

                    if(!strikedUserObj) return msg.reply("This member currently has no strikes!")
                    if(strikedUserObj.currentStrikes === 0) return msg.reply("This member currently has no strikes!")

                    strikedUserObj.currentStrikes -= 1;

                    msg.channel.send(`**${userTag}** now has ${strikedUserObj.currentStrikes}/3 strikes!`)
                }
            } else {
                return msg.reply("Please, specify a member from who you want to remove a strike.")
            }
        } else {
            return msg.reply("You must have moderator permissions to use this command.")
        }
       
    }
}