module.exports = {
    name: 'clear',
    description: '!clear <amount>',
    execute(bot, msg, args) {
      if(msg.member.guild.me.hasPermission('ADMINISTRATOR')) msg.channel.bulkDelete(args[0]);
    }
}
