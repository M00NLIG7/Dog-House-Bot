module.exports = {
    name: 'help',
    description: '!help',
    execute(bot, msg, args) {
        msg.channel.send('Commands:\n!rules - Gives you a list of our server rules\n!help - gives you a list of avalilable commands for everyone\n!wiki <topic> - searches the Ashes of Creation wiki for information on that topic')
    }
}
