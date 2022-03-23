const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { confessId } = require('../config.json');
const { airtable_API } = require('../config.json');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base('appZ1npMgruWsfhgi');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription(`Make an anonymous (or signed) confession in the confessions channel!`)
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
	async execute(interaction, client) {

		confessChannel = await client.channels.cache.find(c => c.id === `${confessId}`)

		base('Blocks').select({
			filterByFormula: `BlkID = ${interaction.user.id}`	
		}).eachPage(function page(records, fetchNextPage) {

			try{
				if (records[0]) {return interaction.editReply({content: `Sorry, but you have been blocked by staff from using this bot. Don't worry, nobody knows anything about the confession which you made, your privacy has been ensured.\nPlease go to <#812700884256686110> and create a ticket to get help.`})}
				fetchNextPage();
			} catch (err) {
				console.error(err)
			}
		}, function done(error){
			
			const confType = interaction.options.getString('type');
			const confession = interaction.options.getString('confession');
			const icon = interaction.user.displayAvatarURL({dynamic: true});

			let embed = new MessageEmbed()
				.setColor('RANDOM')
				.setDescription(`\n\n${confession}\n`)
				.setTimestamp()
				.setTitle('Confession:');

			if (confType === '1') {

				embed.setAuthor({name: `Anon#0000`, iconURL: `${client.user.avatarURL()}`});
				confessChannel.send({embeds: [embed]}).then(msg => newConfession(msg));
				return interaction.editReply({content: `Your message has been sent! Please open a ticket in <#812700884256686110> if there are any issues!\n
											We hope that this helps you in feeling better!`})

			} else if (confType === '2') {

				embed.setAuthor({name: `${interaction.user.tag}`, iconURL: `${icon}`}).setFooter({text: `Please note that even though this confession was not anonymous, it does not allow anyone to send nasty stuff to ${interaction.user.username}. Read rule#2.`});
				confessChannel.send({embeds: [embed]});
				return interaction.editReply({content: `Your confession has been sent! Please open a ticket in <#812700884256686110> if there are any issues.\n
											We hope that this helps you in feeling better!`});

			}

			async function newConfession(msg){
				base('Confessions').create([
					{
					"fields": {
						"UsrID": `${interaction.user.id}`,
						"MsgID": `${msg.id}`
					}
					}
				], function(err, records) {
					if (err) {
					console.error(err);
					return;
					}
				})
			}

		})

		

	},
};