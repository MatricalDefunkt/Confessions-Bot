const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('block')
        .setType(3),
	async execute(interaction) {

		if (!interaction.member._roles.includes('826961128642969630')) {
            staffRole = await interaction.guild.roles.fetch('826961128642969630');
            return interaction.editReply({content: `Sorry, but this command is reserved for ${staffRole} only.`})
        }
		
		message = await interaction.channel.messages.fetch(`${interaction.targetId}`);
		row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('yes')
				.setEmoji('❎')
				.setLabel('Block')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('no')
				.setEmoji('✅')
				.setLabel('Cancel')
				.setStyle('PRIMARY'),
		);
		interaction.editReply({embeds: [new MessageEmbed()
				.setAuthor({name: `${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}`})
				.setTitle(`Message link`)
				.setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${message.id}`)
				.setDescription(`The confessee is about to be blocked. Proceed?`)
			],
			components: [row]
		})

	},
};