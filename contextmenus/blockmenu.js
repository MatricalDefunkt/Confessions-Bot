const { ContextMenuCommandBuilder } = require( '@discordjs/builders' );
const { MessageEmbed, MessageActionRow, MessageButton, MessageContextMenuInteraction, Modal, TextInputComponent } = require( 'discord.js' );
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
		const message = interaction.targetMessage

		if ( !message.inGuild() ) return

		if ( !interaction.inCachedGuild() ) return

		if ( !interaction.member.roles.resolve( staffRoleId ) )
		{
			const staffRole = await interaction.guild.roles.fetch( `${ staffRoleId }`, { force: false, cache: true } );
			return interaction.editReply( { content: `This command is reserved for ${ staffRole } only.` } )
		}

		if ( interaction.channelId !== confessId || message.embeds.length !== 1 ) return interaction.editReply( { content: `\`\`\`diff\n- The selected message is not a confession.\`\`\`` } )

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

		const modal = new Modal()
			.setCustomId( "reasonModal" )
			.setTitle( "Block Reason:" )

		const reasonInputComponent =
			new TextInputComponent()
				.setStyle( "PARAGRAPH" )
				.setCustomId( "reason" )
				.setLabel( "Reason for blocking." )
				.setPlaceholder( "Under 512 characters..." )
				.setMaxLength( 512 )
				.setRequired( true )

		const reasonInputRow = new MessageActionRow().addComponents( reasonInputComponent )
		modal.addComponents( reasonInputRow )

		const reply = await interaction.editReply( {
			embeds: [ new MessageEmbed()
				.setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ interaction.user.displayAvatarURL( { dynamic: true } ) }` } )
				.setTitle( `Message link` )
				.setURL( message.url )
				.setDescription( `The confessee is about to be blocked. Proceed? You have 5 minuted to decide.` )
			],
			components: [ row ]
		} )
		reply.awaitMessageComponent( { componentType: "BUTTON", time: 300_000 } )
			.then( async ( button ) =>
			{
				if ( button.customId === "yes" )
				{
					await button.showModal( modal )
					await button.editReply( { components: [] } )
					button.awaitModalSubmit( { time: 300_000 } ).then( async ( modalInteraction ) =>
					{
						await modalInteraction.deferUpdate()

						const reason = modalInteraction.components[ 0 ].components[ 0 ].value
						const confession = await Confessions.findByPk( message.id )
						if ( !confession )
						{
							message.delete()
							return modalInteraction.editReply( {
								content: `\`\`\`diff\n- Message was not found in the database, but this message has been deleted for now.\n- This is an error. Please contact Matrical ASAP.\`\`\``, embeds: [], components: []
							} )
						} else
						{
							const usrID = confession.usrID
							const blockCount = await BlockLogs.count( { where: { usrID, action: "block" } } )
							const previousBlocks = await BlockLogs.findAll( { where: { usrID } } )

							if ( previousBlocks[ previousBlocks - 1 ]?.getDataValue( "action" ) === "block" ) return modalInteraction.editReply( { content: `Confessee is already blocked.`, components: [], embeds: [] } )

							await BlockLogs.create( {
								usrID: usrID,
								action: "block",
								modID: interaction.user.id,
								reason
							} ).then( ( result ) =>
							{
								modalInteraction.editReply( {
									content: `\`\`\`diff\n+ Confessee has been blocked from making any new confessions for the reason: \`${ reason }\`.${ ( blockCount > 0 ) ? `\nConfessee has been previously blocked ${ blockCount } time(s).` : `` }\`\`\``, embeds: [], components: []
								} ).then( () => message.delete() )
							} ).catch( async ( err ) =>
							{
								return modalInteraction.editReply( {
									content: `There was an error. Please contact Matrical ASAP.`, embeds: [], components: []
								} )
							} );

						}
					} ).catch( err =>
					{
						if ( err?.code === "INTERACTION_COLLECTOR_ERROR" )
							return interaction.editReply( { content: `You did not submit modal in time. Please try again, if you wish to do so.`, embeds: [], components: [] } )
						else
						{
							console.error( err )
							return interaction.editReply( { content: `There was an error. Please contact Matrical ASAP.`, embeds: [], components: [] } )
						}
					} )
				} else
				{
					button.editReply( { content: `Cancelled.`, components: [], embeds: [] } )
				}
			} ).catch( ( err ) =>
			{
				if ( err?.code === "INTERACTION_COLLECTOR_ERROR" )
					return interaction.editReply( { content: `You did not click the buttons in time. Please try again, if you wish to do so.`, embeds: [], components: [] } )
				else
				{
					console.error( err )
					return interaction.editReply( { content: `There was an error. Please contact Matrical ASAP.`, embeds: [], components: [] } )
				}
			} );
	},
};