const {
	MessageEmbed
} = require('discord.js');
module.exports = {
	name: 'rules',
	description: '!rules',
	execute(bot, msg, args) {
		const embed = new MessageEmbed()
		embed.setTitle("š” Discord Rules");
		embed.setColor("BLUE");
		embed.setDescription('ā Use common sense. \nā All channels must be used appropriately and solely for their intended use. \nā No behavior or language which can be considered but not limited to; Harassment, Defamatory, Homophobic, Sexually Explicit, Encouragement of Self-Harm, Racially, Ethnically or otherwise offensive. \nā Pornographic, gore and explicit content or media is completely forbidden. \nā Revealing peoples personal information. \nā Any use of alt accounts to ban evade etc will result in a permanent ban for all accounts you own. \nā Do not needlessly ping or spam @ recognizable faces in our community');
		msg.channel.send(embed);
	}
}