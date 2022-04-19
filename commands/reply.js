const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');
const { airtable_API } = require('../config.json');
const { airtableBase } = require('../config.json');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base(airtableBase);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confessreply')
        .setDescription('Input an appropriate link, or message ID, and reply to the message using the bot!')
        .addStringOption(o => o
			.setName(`type`)
			.setDescription(`Please provide a type of confession:`)
			.setRequired(true)
			.addChoice(`Anonymous`, `1`)
			.addChoice(`Signed`, `2`)
			)
        .addStringOption(o => o
            .setName('reply')
            .setDescription('The reply you would like to give to the confession.')
            .setRequired(true)
            )
        .addStringOption(o => o
            .setName('link-or-id')
            .setDescription('A link (or an ID) of the message you would like to reply to')
            .setRequired(true)
        ),
    async execute(interaction, client) {

        base('Blocks').select({
			filterByFormula: `BlkID = ${interaction.user.id}`	
		}).eachPage(function page(records, fetchNextPage) {

                try{
                    if (records[0]) {return interaction.editReply({content: `Sorry, but you have been blocked by staff from using this bot. Don't worry, nobody knows anything about the confession which you made, your privacy has been ensured.\nPlease go to <#812700884256686110> and create a ticket to get help.`})}
                    fetchNextPage();
                } catch (err) {
                    console.error(err)
                }
            }, async function done(error){

            const linkOrId = interaction.options.getString('link-or-id')
            const baseLink = 'https://discord.com/channels/793202043703001098/955300269162385418'

            if (linkOrId.startsWith(baseLink)) {
                
                const msgId = linkOrId.substring(baseLink.length)

                try {

                    const channel = await interaction.guild.channels.fetch("955300269162385418");
                    const confession = await channel.messages.fetch(msgId);
                    if (confession.author !== client.user) return interaction.editReply({content: `The author of this message is not ${client.user}, so I cannot reply to it.`});

                    createdNewReply(confession, interaction, client);

                } catch (error) {

                    console.error(error)
                    interaction.editReply({content: `There was an error. It could be that the link was invalid.`})

                }
            } else if (BigInt(linkOrId)) {

                try {
                    
                    const channel = await interaction.guild.channels.fetch("955300269162385418");
                    const confession = await channel.messages.fetch(linkOrId);
                    if (confession.author !== client.user) return interaction.editReply({content: `The author of this message is not ${client.user}, so I cannot reply to it.`});

                    createdNewReply(confession, interaction, client);

                } catch (error) {
                    
                    console.error(error)
                    interaction.editReply({ content: `Please input a valid 'link-or-id'. Here is your reply content:\n${interaction.options.getString('reply')}`})

                }
            } else {
                interaction.editReply({ content: `Please input a valid 'link-or-id'. Here is your reply content:\n${interaction.options.getString('reply')}`})
            }
		})
    }       
}

const createdNewReply = (confession, interaction, client) => {
    const confType = interaction.options.getString('type');
    const reply = interaction.options.getString('reply');
    const icon = interaction.user.displayAvatarURL({dynamic: true});

    let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`\n\n${reply}\n`)
        .setTimestamp()
        .setTitle('Reply:');

    if (confType === '1') {

        embed.setAuthor({name: `Anon#0000`, iconURL: `${client.user.avatarURL()}`});
        confession.reply({embeds: [embed]}).then(msg => newReply(msg));
        return interaction.editReply({content: `Your reply has been sent! Please open a ticket in <#812700884256686110> if there are any issues!`})

    } else if (confType === '2') {

        embed.setAuthor({name: `${interaction.user.tag}`, iconURL: `${icon}`}).setFooter({text: `Please note that even though this confession was not anonymous, it does not allow anyone to send nasty stuff to ${interaction.user.username}. Read rule#2.`});
        confession.reply({embeds: [embed]}).then(msg => newReply(msg));
        return interaction.editReply({content: `Your confession has been sent! Please open a ticket in <#812700884256686110> if there are any issues!`});

    }

    async function newReply(msg){
        base('Confessions').create([
            {
            "fields": {
                "UsrID": `${interaction.user.id}`,
                "MsgID": `${msg.id}`
            }
            }
        ], function(err, records) {
            if (err) {
            console.error(err);
            return;
            }
        })
    }
}