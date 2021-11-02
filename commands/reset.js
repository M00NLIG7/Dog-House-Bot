const {
	MessageEmbed
} = require('discord.js');
module.exports = {
	name: 'reset',
	description: '!reset',
	async execute(bot, msg, args) {
		msg.delete();
		if (!msg.member.guild.me.hasPermission('ADMINISTRATOR')) return;

		const roleChannelID = '903743840014434367';
		const ticketChannelID = "904959531241590785";

		embed = new MessageEmbed();
		embed.setTitle("Ticket");
		embed.setColor("BLUE");
		embed.setDescription('🎫 - To create a new support ticket');
		try {
			const channel = await bot.channels.cache.get(ticketChannelID);
			await channel.send("!clear 100");
			const ticketHandler = await channel.send(embed);
			await ticketHandler.react('🎫');
		} catch (err) {
			console.log(err);
		}

		embed = new MessageEmbed();
		embed.setTitle("React with one of the emojis to get your role");
		embed.setColor("BLUE");
		embed.setDescription(
		"🔴 - Red Team\n 🟠 - Orange Team\n 1️⃣ - Blue Team 1\n 2️⃣ - Blue Team 2\n \
		3️⃣ - Blue Team 3\n 4️⃣ - Blue Team 4\n 5️⃣ - Blue Team 5\n 6️⃣ - Blue Team 6\n \
		7️⃣ - Blue Team 7\n 8️⃣ - Blue Team 8\n 9️⃣ - Blue Team 9\n 🔟 - Blue Team 10\n");
		try {
			const channel = await bot.channels.cache.get(roleChannelID);
			await channel.send("!clear 100");
			const ticketHandler = await channel.send(embed);      
			await ticketHandler.react("🔴"); 
      		await ticketHandler.react("🟠"); 
      		await ticketHandler.react("1️⃣"); 
      		await ticketHandler.react("2️⃣");   
      		await ticketHandler.react("3️⃣"); 
      		await ticketHandler.react("4️⃣"); 
      		await ticketHandler.react("5️⃣"); 
      		await ticketHandler.react("6️⃣"); 
      		await ticketHandler.react("7️⃣"); 
      		await ticketHandler.react("8️⃣"); 
      		await ticketHandler.react("9️⃣"); 
      		await ticketHandler.react("🔟"); 
		} catch (err) {
			console.log(err);
		}
	}
}