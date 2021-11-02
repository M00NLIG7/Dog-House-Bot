const {
	MessageEmbed
} = require('discord.js');
module.exports = {
	name: 'rules',
	description: '!rules',
	execute(bot, msg, args) {
		const embed = new MessageEmbed()
		embed.setTitle("🛡 Discord Rules");
		embed.setColor("BLUE");
		embed.setDescription('● Use common sense. \n● All channels must be used appropriately and solely for their intended use. \n● No behavior or language which can be considered but not limited to; Harassment, Defamatory, Homophobic, Sexually Explicit, Encouragement of Self-Harm, Racially, Ethnically or otherwise offensive. \n● Pornographic, gore and explicit content or media is completely forbidden. \n● Revealing peoples personal information. \n● Any use of alt accounts to ban evade etc will result in a permanent ban for all accounts you own. \n● Do not needlessly ping or spam @ recognizable faces in our community');
		msg.channel.send(embed);
	}
}