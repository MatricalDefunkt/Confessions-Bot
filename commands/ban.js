const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { token, airtable_API } = require('../config.json');

var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base('appZ1npMgruWsfhgi');
var IDs = []

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

		await base('Table 1').select({
			maxRecords: 3,
			view: "Grid view"
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function(record) {
				let UID = record.get('UsrID');
				let MID = record.get('MsgID');
				console.log('Retrieved', UID, MID);
				this.IDs = IDs.push({uid: `${UID}`, mid: `${MID}`})
				console.log(IDs.uid)
			});
			fetchNextPage();
		
		}, function done(err) {
			if (err) { console.error(err); return; }
		});

	},
};