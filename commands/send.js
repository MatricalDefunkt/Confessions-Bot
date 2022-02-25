const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { confessId } = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription(`description`)
        .addStringOption(o => o
			.setName(`type`)
			.setDescription(`Please provide a type of confession:`)
			.setRequired(true)
			.addChoice(`Anonymous`, `1`)
			.addChoice(`Signed`, `2`)
			)
        .addStringOption(o => o
            .setName('confession')
            .setDescription('Type out your confession here:')
            .setRequired(true)
            ),
	async execute(interaction) {

		confessChannel = await interaction.guild.channels.cache.find(c => c.id === `${confessId}`)

		const confType = interaction.options.getString('type');
		const confession = interaction.options.getString('confession');
		const icon = interaction.user.displayAvatarURL({dynamicL: true, size: 256})

		let embed = new MessageEmbed()
					.setColor('PINK')
					.setDescription(`Confession: \n\n ${confession}`)
					.setTimestamp();

		if (confType === '1') {

			embed.setAuthor({name: `Anon#0000`, iconURL: `https://i.imgur.com/9CzJbMf.png`});
			await confessChannel.send({embeds: [embed]});
			return interaction.reply({content: `Your message has been sent! Please open a ticket in <#812700884256686110> if there are any issues!\n
										We hope that this helps you in feeling better!`, ephemeral:true})

		} else if (confType === '2') {

			embed.setAuthor({name: `${interaction.user.tag}`, iconURL: `${icon}`}).setFooter({text: `Please note that even though this confession was not anonymous, it does not allow anyone to send nasty stuff to ${interaction.user.username}. Read rule#2.`});
			await confessChannel.send({embeds: [embed]});
			return interaction.reply({content: `Your confession has been sent! Please open a ticket in <#812700884256686110> if there are any issues.\n
										We hope that this helps you in feeling better!`, ephemeral:true});

		}

	},
};