const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription(`Ban a user from using this bot. (Moderators only.)`)
        .addStringOption(o => o
			.setName(`msgid`)
			.setDescription(`Please provide the message ID of the confession whose sender you want to ban:`)
			.setRequired(true)
			),
	async execute(interaction) {

	},
};