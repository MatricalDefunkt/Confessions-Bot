const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton, InteractionCollector } = require( 'discord.js' );
const { BlockLogs } = require( '../database/database' );
const { staffRoleId } = require( "../config.json" )

const row = new MessageActionRow().addComponents(
  [
    new MessageButton()
      .setCustomId( "previous" )
      .setEmoji( "◀️" )
      .setStyle( "PRIMARY" ),
    new MessageButton()
      .setCustomId( "next" )
      .setEmoji( "▶️" )
      .setStyle( "PRIMARY" )
  ]
)

module.exports = {
  data: new SlashCommandBuilder()
    .setName( 'blockcheck' )
    .setDescription( `Checks if a user has been blocked.` )
    .addUserOption( o => o
      .setName( "user" )
      .setDescription( "User to check." )
      .setRequired( true )
    ),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client<true>} client 
   */
  async execute ( interaction, client )
  {

    if ( interaction.guild.members.cache.size < 150 ) return await interaction.editReply( { content: `Sorry but this command cannot be used for servers under 150 members.` } )

    if ( !interaction.member.roles.resolve( staffRoleId ) )
    {
      const staffRole = await interaction.guild.roles.fetch( `${ staffRoleId }`, { force: false, cache: true } );
      return await interaction.editReply( { content: `This command is reserved for ${ staffRole } only.` } )
    }

    const user = interaction.options.getUser( "user", true )

    const previousBlocks = ( await BlockLogs.findAll( { where: { usrID: user.id } } ) ).reverse()

    if ( previousBlocks.length < 1 ) return await interaction.editReply( { content: `There is no block record for ${ user }` } )

    let embeds = []

    previousBlocks.forEach( ( block ) =>
    {
      const embed = new MessageEmbed().setTitle( block.action.toUpperCase() ).setColor( block.action === "block" ? "RED" : "YELLOW" )
        .addFields( [
          { name: "Moderator:", value: `<@${ block.modID }>`, inline: true },
          { name: "Reason:", value: `${ block.reason }`, inline: true },
          { name: "Time", value: `<t:${ Math.trunc( Date.parse( block.createdAt ) / 1000 ) }:F>` }
        ] )
      embeds.push( embed )
    } )

    const reply = await interaction.editReply( { content: `Found the following logs:`, embeds: embeds.slice( 0, 5 ), components: embeds.length > 5 ? [ row ] : [] } )

    if ( embeds.length > 5 )
    {
      let index = 0;

      const collector = new InteractionCollector( interaction.client, { componentType: "BUTTON", message: reply, time: 900_000 } )

      collector.on( "collect", ( collected ) =>
      {
        if ( !collected.isButton() ) return

        if ( collected.customId === "next" )
        {
          if ( index + 5 > embeds.length ) return collected.reply( { content: `No more pages left!`, ephemeral: true } )
          index += 5
          collected.update( { embeds: embeds.slice( index, index + 5 ) } )
        } else if ( collected.customId === "previous" )
        {
          if ( index - 5 < 0 ) return collected.reply( { content: `No pages behind this!`, ephemeral: true } )
          index -= 5
          collected.update( { embeds: embeds.slice( index, index + 5 ) } )
        }
      } )
    }
  },
}; 5