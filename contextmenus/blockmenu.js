const { ContextMenuCommandBuilder } = require( '@discordjs/builders' );
const { MessageEmbed, MessageActionRow, MessageButton, MessageContextMenuInteraction } = require( 'discord.js' );
const { staffRoleId, confessId } = require( '../config.json' );
const { BlockLogs, Confessions } = require( '../database/database' );

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName( 'block' )
		.setType( 3 ),
	/**
	 * 
	 * @param {MessageContextMenuInteraction} interaction 
	 * @returns 
	 */
	async execute ( interaction )
	{
		if ( !interaction.inCachedGuild() ) return

		if ( !interaction.member.roles.resolve( staffRoleId ) )
		{
			const staffRole = await interaction.guild.roles.fetch( `${ staffRoleId }`, { force: false, cache: true } );
			return interaction.editReply( { content: `This command is reserved for ${ staffRole } only.` } )
		}

		if ( interaction.channelId !== confessId ) return interaction.editReply( { content: `\`\`\`diff\n- The selected message is not a confession.\`\`\`` } )

		const message = await interaction.channel.messages.fetch( `${ interaction.targetId }` );
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId( 'yes' )
				.setEmoji( '❎' )
				.setLabel( 'Block' )
				.setStyle( 'PRIMARY' ),
			new MessageButton()
				.setCustomId( 'no' )
				.setEmoji( '✅' )
				.setLabel( 'Cancel' )
				.setStyle( 'PRIMARY' ),
		);
		const reply = await interaction.editReply( {
			embeds: [ new MessageEmbed()
				.setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ interaction.user.displayAvatarURL( { dynamic: true } ) }` } )
				.setTitle( `Message link` )
				.setURL( `https://discord.com/channels/${ interaction.guild.id }/${ interaction.channel.id }/${ message.id }` )
				.setDescription( `The confessee is about to be blocked. Proceed? You have 5 minuted to decide.` )
			],
			components: [ row ]
		} )
		reply.awaitMessageComponent( { componentType: "BUTTON", time: 300_000 } )
			.then( async ( button ) =>
			{
				await button.deferUpdate()
				if ( button.customId === "yes" )
				{
					const confession = await Confessions.findByPk( message.id )
					if ( !confession )
					{
						message.delete()
						return button.editReply( {
							content: `\`\`\`diff\n- Message was not found in the database, but this message has been deleted for now.\n- This is an error. Please contact Matrical ASAP.\`\`\``, embeds: [], components: []
						} )
					} else
					{
						const usrID = confession.getDataValue( "usrID" )
						const blockCount = await BlockLogs.count( { where: { usrID, action: "block" } } )
						const previousBlocks = await BlockLogs.findAll( { where: { usrID } } )

						if ( previousBlocks[ previousBlocks - 1 ]?.getDataValue( "action" ) === "block" ) return button.editReply( { content: `Confessee is already blocked.`, components: [], embeds: [] } )

						BlockLogs.create( {
							usrID: confession.getDataValue( "usrID" ),
							action: "block",
							modID: interaction.user.id
						} ).then( ( result ) =>
						{
							button.editReply( {
								content: `\`\`\`diff\n+ Confessee has been blocked from making any new confessions.${ ( blockCount > 0 ) ? `\nConfessee has been previously blocked ${ blockCount } time(s).` : `` }\`\`\``, embeds: [], components: []
							} ).then( () => message.delete() )
						} ).catch( async ( err ) =>
						{
							return button.editReply( {
								content: `There was an error. Please contact Matrical ASAP.`, embeds: [], components: []
							} )
						} );
					}
				} else
				{
					button.editReply( { content: `Cancelled.`, components: [], embeds: [] } )
				}
			} ).catch( ( err ) =>
			{
				console.error( err )
				return interaction.editReply( { content: `You did not click the buttons in time. Please try again, if you wish to do so.` } )
			} );
	},
};