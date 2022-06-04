const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { CommandInteraction, Client, MessageActionRow, MessageButton, MessageEmbed } = require( 'discord.js' );
const { staffRoleId } = require( '../config.json' );
const { BlockLogs } = require( '../database/database' );

module.exports = {
  data: new SlashCommandBuilder()
    .setName( 'unblock' )
    .setDescription( `Unblocks a user.` )
    .addStringOption( o => o
      .setName( "user-id" )
      .setDescription( "User ID of the confessee you wish to unblock." )
      .setRequired( true )
    ),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute ( interaction, client )
  {
    if ( !interaction.inCachedGuild() ) return;

    if ( !interaction.member.roles.resolve( staffRoleId ) )
    {
      const staffRole = await interaction.guild.roles.fetch( `${ staffRoleId }`, { force: false, cache: true } );
      return interaction.editReply( { content: `This command is reserved for ${ staffRole } only.` } )
    }

    const usrID = interaction.options.getString( "user-id", true )
    if ( usrID.length !== 18 ) return interaction.editReply( { content: `Please enter a vaild user ID.` } )
    const blockLog = await BlockLogs.findOne( { where: { usrID } } )

    if ( !blockLog ) return interaction.editReply( { content: `There is no block record for \`${ usrID }\`` } )

    if ( blockLog.getDataValue( "action" ) === "unblock" ) return interaction.editReply( { content: `The user was blocked previously, but is now unblocked.\nThey were blocked on <t:${ Date.parse( blockLog.getDataValue( "createdAt" ) ) / 1000 }:F>` } )

    if ( blockLog.getDataValue( "action" ) === "block" )
    {
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
        components: [ row ], embeds: [ new MessageEmbed()
          .setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ interaction.user.displayAvatarURL( { dynamic: true } ) }` } )
          .setTitle( `Unblock Request` )
          .setDescription( `<@${ usrID }> is about to be unblocked. Proceed? You have 5 minuted to decide.` )
        ]
      } )
      reply.awaitMessageComponent( { componentType: "BUTTON", time: 300_000 } )
        .then( async ( button ) =>
        {
          await button.deferUpdate()

          if ( button.customId === "yes" )
          {
            await BlockLogs.create( { usrID, action: "unblock", modID: interaction.user.id } )
            await button.editReply( { content: `<@${ usrID }> has been unblocked.`, embeds: [], components: [] } )
          } else
          {
            await button.editReply( { content: `Cancelled.`, embeds: [], components: [] } )
          }

        } ).catch( ( err ) =>
        {
          interaction.editReply( { content: `You did not click a button on time.`, embeds: [], components: [] } )
        } );
    }
  },
};