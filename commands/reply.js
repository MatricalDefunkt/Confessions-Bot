const { SlashCommandBuilder } = require( '@discordjs/builders' )
const { MessageEmbed, CommandInteraction, Client, MessageActionRow, MessageButton, Message } = require( 'discord.js' );
const { BlockLogs, Confessions } = require( '../database/database' );
const { confessId, guildId } = require( '../config.json' );

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'confessreply' )
        .setDescription( 'Input an appropriate link, or message ID, and reply to the message using the bot!' )
        .addStringOption( o => o
            .setName( `type` )
            .setDescription( `Please provide a type of confession:` )
            .setRequired( true )
            .addChoice( `Anonymous`, `1` )
            .addChoice( `Signed`, `2` )
        )
        .addStringOption( o => o
            .setName( 'reply' )
            .setDescription( 'The reply you would like to give to the confession.' )
            .setRequired( true )
        )
        .addStringOption( o => o
            .setName( 'link-or-id' )
            .setDescription( 'A link (or an ID) of the message you would like to reply to' )
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

        const replyText = interaction.options.getString( "reply", true )

        if ( action === "unblock" || !action )
        {

            const linkOrId = interaction.options.getString( "link-or-id" )
            let link;
            let replyId;

            if ( linkOrId.length === 18 )
            {
                replyId = linkOrId;
                link = `https://discord.com/channels/${ guildId }/${ confessId }/${ linkOrId }`;
            } else
            {
                replyId = linkOrId.substring( 67, 85 )
                link = linkOrId
            }

            if ( link.length !== 85 || replyId.length !== 18 ) return interaction.editReply( { content: `Please check the link or ID you have provided. Here is your reply for your reference:\n----------------\n${ replyText }` } )

            const confession = await confessChannel.messages.fetch( replyId, { force: false, cache: true } )

            if ( confession.embeds.length < 0 || ( confession.embeds[ 0 ]?.title !== "Reply:" && confession.embeds[ 0 ]?.title !== "Confession:" ) || confession.author?.id !== client.user.id || !confession ) return interaction.editReply( {
                content: `Please make sure that the link or ID you have provided is of a confession or a confession-reply. Here is your reply for your reference:\n----------------\n${ replyText }`
            } )

            const embed = new MessageEmbed()
                .setColor( 'RANDOM' )
                .setDescription( `\n\n${ replyText }\n` )
                .setTimestamp()
                .setTitle( 'Reply:' );

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
            const reply = await interaction.editReply( { content: `You are about to reply to [this message](${ link }). Send it? You have 60 seconds to decide.`, embeds: [ embed ], components: [ row ] } )
            reply.awaitMessageComponent( {
                filter,
                time: 60000,
                componentType: 'BUTTON'
            } ).then( async ( collected ) =>
            {
                const confType = interaction.options.getString( "type", true )
                if ( collected.customId === 'sendconfirm' )
                {
                    try
                    {
                        if ( !confession ) return interaction.editReply( { content: `Please check the message link or ID you have provided.` } )

                        if ( confType === '1' )
                        {
                            embed.setAuthor( { name: `Anon#0000`, iconURL: `${ client.user.avatarURL() }` } );
                            confession.reply( { embeds: [ embed ] } ).then( msg => newReply( msg ) );
                            return collected.update( {
                                content: `Your reply has been sent! Please open a ticket in <#812700884256686110> if there are any issues!\n
													    We hope that this helps you in feeling better!`, embeds: [], components: []
                            } )
                        } else if ( confType === '2' )
                        {
                            embed.setAuthor( { name: `${ interaction.user.tag }`, iconURL: `${ interaction.user.displayAvatarURL( { dynamic: true } ) }` } ).setFooter( { text: `Please note that even though this reply was not anonymous, it does not allow anyone to send nasty stuff to ${ interaction.user.username }. Read rule#2.` } );
                            confession.reply( { embeds: [ embed ] } ).then( msg => newReply( msg ) );
                            return collected.update( {
                                content: `Your reply has been sent! Please open a ticket in <#812700884256686110> if there are any issues.\n
													    We hope that this helps you in feeling better!`, embeds: [], components: []
                            } );
                        }
                    } catch ( error )
                    {
                        if ( error.code === 10008 ) return collected.update( { content: `The message is not from the confessions channel.`, embeds: [], components: [] } )
                        else console.error( error )
                    }
                } else
                {
                    return collected.update( { content: `The reply was not sent. For your reference, here is your reply:\n----------------\n${ replyText }`, embeds: [], components: [] } )
                }
            } ).catch( async ( err ) =>
            {
                console.error( err )
                interaction.editReply( { content: `You did not click the buttons in time. If you wish to try again, here is your reply:\n----------------\n${ replyText }`, embeds: [], components: [] } )
            } )

            /**
             * 
             * @param {Message} msg 
             */
            async function newReply ( msg )
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
    }
}