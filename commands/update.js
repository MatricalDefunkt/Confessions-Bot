const { SlashCommandBuilder } = require('@discordjs/builders');
const { airtable_API } = require('../config.json');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base('appZ1npMgruWsfhgi');
var IDs = []
const fs = require('fs')
var IDsJSON = require('../ids.json').IDs
const { wait } = require('../wait')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Checks / Updates local vs offsite database. Use before running commands except /confess.`),
	async execute(interaction, client) {

		console.log(IDsJSON);

		base('Table 1').select({
			view: "Grid view"
		}).eachPage(function page(records) {
			records.forEach(function(record) {
				let UID = record.get('UsrID');
				let MID = record.get('MsgID');
				this.IDs = IDs.push({uid: `${UID}`, mid: `${MID}`})
			});

				console.log(IDs)
				const IDJSON = JSON.stringify(IDs);
				interaction.editReply({content: `Updated!`});
				fs.writeFileSync('../ids.json', `{"idFromJson": ${IDJSON}}`, "utf-8");

		}, function done(err) {

			if (err) { console.log(`in err`); console.error(err); return; }

		});
	},
};