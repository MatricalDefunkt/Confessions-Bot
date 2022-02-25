const { Client, Intents, Collection } = require('discord.js');
const { token, airtable_API } = require('./config.json');
const fs = require('fs');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base('appZ1npMgruWsfhgi');
var IDs = []

base('Table 1').select({
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
		let UID = record.get('UsrID');
		let MID = record.get('MsgID');
        console.log('Retrieved', UID, MID);
		this.IDs = IDs.push({uid: `${UID}`, mid: `${MID}`})
		console.log(IDs)
    });
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {

	if (interaction.isCommand()) {

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {

			await command.execute(interaction);

		} catch (error) {

			console.error(error);
			interaction.reply({content: `An error was caught: \n\`\`\`js\n${error.stack}\`\`\``})

		};

	}

})



client.login(token);

