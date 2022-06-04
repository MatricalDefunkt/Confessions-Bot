const { MessageEmbed, MessageActionRow, MessageButton } = require( "discord.js" )

module.exports = {
    customId: 'home',

    async execute ( interaction, client )
    {

        const helpEmbed = new MessageEmbed()
        row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId( 'privacy' )
                .setEmoji( '859242026620813343' )
                .setLabel( 'Privacy' )
                .setStyle( 'PRIMARY' ),
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
                .setDisabled( true )
        );
        helpEmbed.setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ interaction.user.displayAvatarURL( { dynamic: true } ) }` } )
        helpEmbed.setDescription( `
        Hey there! Looks like you asked for some help! Well, glad you did so.
        Here is some information that might help you. As always, if this does not suffice, you can always open a ticket in <#812700884256686110>.

        To get help about the slash commands, click on "Commands", and for help with privacy, click on "Privacy"
        `)
        helpEmbed.setTitle( "Help:" )

        interaction.update( { embeds: [ helpEmbed ], components: [ row ] } )

    }
}