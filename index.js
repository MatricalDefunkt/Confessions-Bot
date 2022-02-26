const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

module.exports = {
	client
}

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

			interaction.deferReply({ephemeral:true});
			await command.execute(interaction, client);

		} catch (error) {

			console.error(error);
			interaction.channel.send({content: `An error was caught: \n\`\`\`js\n${error.stack}\`\`\``})

		};

	}

})


client.login(token);
