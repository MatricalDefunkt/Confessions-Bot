const { MessageEmbed, MessageActionRow, MessageButton } = require( "discord.js" )

module.exports = {
    customId: 'privacy',

    async execute ( interaction, client )
    {

        const privacyEmbed = new MessageEmbed();
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId( 'privacy' )
                .setEmoji( '859242026620813343' )
                .setLabel( 'Privacy' )
                .setStyle( 'PRIMARY' )
                .setDisabled( true ),
            new MessageButton()
                .setCustomId( 'commands' )
                .setEmoji( '🤖' )
                .setLabel( 'Commands' )
                .setStyle( 'PRIMARY' ),
            new MessageButton()
                .setCustomId( 'home' )
                .setEmoji( '🏠' )
                .setLabel( 'Home' )
                .setStyle( 'PRIMARY' )
        );

        privacyEmbed.setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ interaction.user.displayAvatarURL( { dynamic: true } ) }` } )
        privacyEmbed.setDescription( `
            This bot ensures your privacy, as well as allows for security.

            The message ID of the final confession is stored where it is linked to your user ID, but this is only for security and prevention of misuse.

            Note: Neither staff, nor any other human being will ever be able to read this information. There is no premium version of this bot which allows for the same.

            The bot is fully open source and available on [GitHub](https://github.com/MatricalDefunkt/Confessions-Bot) 

        `)
        privacyEmbed.setTitle( "Privacy:" )

        interaction.update( { embeds: [ privacyEmbed ], components: [ row ] } )

    }
}