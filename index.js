const { Client, Intents, Collection } = require( 'discord.js' );
const { token, errGuildId, errChannelId } = require( './config.json' );
const fs = require( 'fs' );


const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );
const contextFiles = fs.readdirSync( './contextmenus' ).filter( file => file.endsWith( '.js' ) );
const buttonFiles = fs.readdirSync( './buttons' ).filter( file => file.endsWith( '.js' ) );

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ], failIfNotExists: false, } );

client.commands = new Collection();

for ( const file of commandFiles )
{
	const command = require( `./commands/${ file }` );
	client.commands.set( command.data.name, command );
}

client.buttons = new Collection();

for ( const file of buttonFiles )
{
	const button = require( `./buttons/${ file }` );
	client.buttons.set( button.customId, button );
}

client.contextMenus = new Collection();

for ( const file of contextFiles )
{
	const contextMenu = require( `./contextmenus/${ file }` );
	client.contextMenus.set( contextMenu.data.name, contextMenu );
}

client.once( 'ready', () =>
{
	console.log( 'Ready!' );
	const members = client.guilds.cache.reduce( ( acc, guild ) => acc + guild.memberCount, 0 );
	client.user.setPresence( { status: `online` } );
	client.user.setActivity( { name: `/confess for ${ members } users!`, type: 3 } );
} );

let errGuildToFetch;
let errChannelToFetch;

const getErrChannel = async () =>
{

	errGuildToFetch = await client.guilds.fetch( { guild: errGuildId, force: false, cache: true } );
	errChannelToFetch = await errGuildToFetch.channels.fetch( `${ errChannelId }`, { force: false, cache: true } );
	return { errChannelToFetch, errGuildToFetch };

};

client.on( 'interactionCreate', async interaction =>
{

	const { errChannelToFetch: errChannel } = await getErrChannel( errGuildToFetch, errChannelToFetch );

	if ( interaction.isCommand() )
	{

		const command = client.commands.get( interaction.commandName );
		if ( !command ) return;

		try
		{

			await interaction.deferReply( { ephemeral: true } );
			await command.execute( interaction, client );

		} catch ( error )
		{

			console.error( error );
			errChannel.send( { content: `An error was caught: \n\`\`\`js\n${ error.stack }\`\`\`` } );

		}

	}

	if ( interaction.isContextMenu() )
	{

		try
		{

			await interaction.deferReply( { ephemeral: true } );
			const contextMenu = client.contextMenus.get( interaction.commandName );
			if ( contextMenu ) contextMenu.execute( interaction, client );

		} catch ( error )
		{

			console.error( error );
			errChannel.send( { content: `An error was caught: \n\`\`\`js\n${ error.stack }\`\`\`` } );

		}
	}

	if ( interaction.isButton() )
	{

		const button = client.buttons.get( interaction.customId );
		if ( !button ) return;

		try
		{

			await button.execute( interaction, client );

		} catch ( error )
		{

			console.error( error );
			errChannel.send( { content: `An error was caught: \n\`\`\`js\n${ error.stack }\`\`\`` } );

		}

	}

} );

client.on( 'messageCreate', async ( msg ) =>
{

	if ( msg.author.bot ) return;
	if ( msg.content.startsWith( '!eval' ) )
	{

		if ( msg.author.id != 714473790939332679n ) return;

		let msgContent = msg.content.substring( 6 );
		try
		{

			let evalReply = eval( msgContent );
			if ( evalReply )
			{
				msg.reply( { content: `${ evalReply }` } );
			} else
			{
				msg.reply( { content: `Check console.` } );
			}

		} catch ( error )
		{

			console.error( error );
			msg.reply( { content: `There was an error: \`\`\`js\n${ error }\n${ error.stack }\`\`\`` } );

		}
	}

} );

client.login( token );

setInterval( () =>
{
	console.log( 'Ready!' );
	const members = client.guilds.cache.reduce( ( acc, guild ) => acc + guild.memberCount, 0 );
	client.user.setPresence( { status: `online` } );
	client.user.setActivity( { name: `/confess for ${ members } users!`, type: 3 } );
}, 3600000 );
