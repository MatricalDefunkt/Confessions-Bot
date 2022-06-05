const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton, MessageComponentInteraction, CollectorFilter, Message } = require( 'discord.js' );
const { confessId } = require( '../config.json' );
const { BlockLogs, Confessions } = require( '../database/database' );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( 'confess' )
		.setDescription( `Make an anonymous (or signed) confession in the confessions channel!` )
		.addStringOption( o => o
			.setName( `type` )
			.setDescription( `Please provide a type of confession:` )
			.setRequired( true )
			.addChoice( `Anonymous`, `1` )
			.addChoice( `Signed`, `2` )
		)
		.addStringOption( o => o
			.setName( 'confession' )
			.setDescription( 'Type out your confession here:' )
			.setRequired( true )
		),
	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 * @param {Client} client 
	 */
	async execute ( interaction, client )
	{
		if ( !interaction.inCachedGuild() ) return

		const confessChannel = await client.channels.fetch( confessId, { force: false, cache: true } )
		if ( !confessChannel.isText() ) return

		const blocks = await BlockLogs.findAll( { where: { usrID: interaction.user.id } } );
		const blockedUser = blocks[ blocks.length - 1 ]
		const action = blockedUser?.getDataValue( "action" );

		if ( action === "unblock" || !action )
		{
			const confType = interaction.options.getString( 'type' );
			const confession = interaction.options.getString( 'confession' );
			const icon = interaction.user.displayAvatarURL( { dynamic: true } );

			const embed = new MessageEmbed()
				.setColor( 'RANDOM' )
				.setDescription( `\n\n${ confession }\n` )
				.setTimestamp()
				.setTitle( 'Confession:' );

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId( 'sendconfirm' )
						.setEmoji( '✅' )
						.setStyle( 'SUCCESS' )
						.setLabel( 'Send' ),
					new MessageButton()
						.setCustomId( 'sendcancel' )
						.setEmoji( '❎' )
						.setStyle( 'PRIMARY' )
						.setLabel( 'Cancel' )
				)

			const filter = ( button ) => button.user.id === interaction.user.id
			const reply = await interaction.editReply( { content: `You are about to send this confession. Send it? You have 60 seconds to decide.`, embeds: [ embed ], components: [ row ] } )
			reply.awaitMessageComponent( {
				filter,
				time: 60000,
				componentType: 'BUTTON'
			} ).then( ( collected ) =>
			{
				if ( collected.customId === 'sendconfirm' )
				{

					if ( confType === '1' )
					{

						embed.setAuthor( { name: `Anon#0000`, iconURL: `${ client.user.displayAvatarURL() }` } );
						confessChannel.send( { embeds: [ embed ] } ).then( msg => newConfession( msg ) );
						return collected.update( {
							content: `Your message has been sent! Please open a ticket in <#812700884256686110> if there are any issues!\nWe hope that this helps you in feeling better!`, embeds: [], components: []
						} )

					} else if ( confType === '2' )
					{

						embed.setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ icon }` } ).setFooter( { text: `Please note that even though this confession was not anonymous, it does not allow anyone to send nasty stuff to ${ interaction.user.username }. Read rule#2.` } );
						confessChannel.send( { embeds: [ embed ] } ).then( msg => newConfession( msg ) );;
						return collected.update( {
							content: `Your confession has been sent! Please open a ticket in <#812700884256686110> if there are any issues.\nWe hope that this helps you in feeling better!`, embeds: [], components: []
						} );
					}
				} else
				{
					return collected.update( { content: `Confession was not sent. For your reference, here is your confession:\n----------------\n${ confession }`, embeds: [], components: [] } )
				}
			} ).catch( async () =>
			{
				interaction.editReply( { content: `You did not click the buttons in time. If you wish to try again, here is your confession:\n----------------\n${ confession }`, embeds: [], components: [] } )
			} )

			/**
			 * 
			 * @param {Message} msg 
			 */
			async function newConfession ( msg )
			{
				Confessions.create( {
					usrID: interaction.user.id,
					msgID: msg.id
				} ).then( () => { } ).catch( ( err ) =>
				{
					console.error( err )
				} );
			}
		} else if ( action === "block" )
		{
			return interaction.editReply( { content: `Sorry, but you have been blocked by staff from using this bot. Don't worry, nobody knows anything about the confession which you made, your privacy has been ensured.\nPlease go to <#812700884256686110> and create a ticket to get help.` } )
		}
	},
};