const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { confessId } = require('../config.json');
var IDsJSON = require('../ids.json').IDs;
const { airtable_API } = require('../config.json');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base('appZ1npMgruWsfhgi');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription(`Block a user from using this bot.`)
        .addStringOption(o => o
            .setName('messageid')
            .setDescription('The message ID of the user\'s message you want to block from using this bot')
            .setRequired(true)),
	async execute(interaction, client) {

        try {
        const messageID = interaction.options.getString('messageid');
        var confessChannel = await client.channels.resolve(confessId);
        let  message = await confessChannel.messages.resolve(messageID);
        await interaction.editReply({content: `${message.embeds}`})
        } catch (err){
            
        }

		async function newBlock(msg){
			console.log(interaction.user.id)
			base('Table 2').create([
				{
				  "fields": {
					"BlkID": `${interaction.user.id}`,
					"Banned?": 'true'
				  }
				}
			], function(err, records) {
				if (err) {
				  console.error(err);
				  return;
				}
				records.forEach(function (record) {
				  console.log(record.getId());
				});
			})
		}

	},
};