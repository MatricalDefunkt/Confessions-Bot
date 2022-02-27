const { SlashCommandBuilder } = require('@discordjs/builders');
const { airtable_API } = require('../config.json');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base('appZ1npMgruWsfhgi');
var IDs = []
const fs = require('fs')
var IDsFromJSON = require('../ids.json').IDsFromJSON

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Checks / Updates local vs offsite database. Use before running commands except /confess.`),
	async execute(interaction, client) {

		console.log(IDsFromJSON);

		base('Table 1').select({

			view: "Grid view"

		}).eachPage(function page(records, fetchNextPage) {

			records.forEach(function(record) {

				let UID = record.get('UsrID');
				let MID = record.get('MsgID');
				let RID = record.get('RcrdID');
				this.IDs = IDs.push({uid: `${UID}`, mid: `${MID}`, rid: `${RID}`});

			});

				fetchNextPage();	

		}, function done(err) {

			if (err) { console.log(`in err`); console.error(err); return; }

			console.log(IDs);
			const IDJSON = JSON.stringify(IDs);
			interaction.editReply({content: `Updated!`});
			fs.writeFileSync('ids.json', `{"IDsFromJSON": ${IDJSON}}`, "utf-8");

		});
	},
};