const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    customId: 'commands',

    async execute(interaction, client) {

        commandEmbed = new MessageEmbed();
        row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('privacy')
				.setEmoji('859242026620813343')
				.setLabel('Privacy')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('commands')
				.setEmoji('🤖')
				.setLabel('Commands')
				.setStyle('PRIMARY')
                .setDisabled(true),
            new MessageButton()
                .setCustomId('home')
                .setEmoji('🏠')
                .setLabel('Home')
                .setStyle('PRIMARY')
		);

        commandEmbed.setAuthor({name: `${interaction.user.tag}`, iconURL:`${interaction.user.avatarURL()}`});
        commandEmbed.setDescription(
        `
        
        Commands: 
        1) Help =>
        The command which you just ran to get this message!
        
        2) Confess =>
        This command allows you to use the main function of this bot, confessions.
        If you type /confess, you will see two options, namely "type", and "confession".
        Under "type", there are two choices, where Anonymous means that in your confession,
        no information related to you will be stored, and signed, where your tag and avatar
        appears on the message "Confess" is where you will actually type out your confession.

        `);


        interaction.update({embeds:[commandEmbed], components:[row]});

    }
}