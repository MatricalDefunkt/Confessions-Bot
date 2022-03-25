const { airtable_API } = require('../config.json');
const { airtableBase } = require('../config.json');
var Airtable = require('airtable');
var base = new Airtable({apiKey: `${airtable_API}`}).base(airtableBase);

module.exports = {
    customId: 'yes',

    async execute(interaction, client) {

        let record
        url = interaction.message.embeds[0].url
        msg = await interaction.channel.messages.fetch(`${url.substring(67)}`)
        if (msg.embeds.length === 0) return interaction.update({content: '```diff\n- The selected message is not a confession!```', embeds:[], components: []});
        desc = msg.embeds[0].title
        if (desc.startsWith('Confession:')||desc.startsWith('Reply:')) {

            await interaction.update({content: '```diff\n- Blocking...```', embeds:[], components:[]})

            base('Confessions').select({
                filterByFormula: `MsgID = ${msg.id}`,
            }).eachPage(function page(records, fetchNextPage) {
                
                try{
                    fetchedID = records[0].fields.UsrID
                    rcrdID = records[0].id
                    fetchNextPage();
                } catch (err) {
                    console.error(err)
                }

            }, function done(error) {

                base('Blocks').select({
                    filterByFormula: `BlkID = ${fetchedID}`,
                }).eachPage(function page(records, fetchNextPage) {
                    try{
                        if (records[0]) {interaction.editReply({content: `User was blocked previously!`}); msg.delete(); return}
                        fetchNextPage();
                    } catch (err){
                        console.error(err)
                    }
    
                }, function done(error) { 

                    base('Blocks').create([
                        {
                            "fields": {
                                "BlkID": `${fetchedID}`,
                                "Blocked?": `true`
                            }
                        }
                    ], function(err, records) {
                        if (err) {
                        console.error(err);
                        return;
                        }
                    })

                    base('Confessions').destroy([`${rcrdID}`], function(err, deletedRecords) {
                        if (err) {
                        console.error(err);
                        return;
                        }
                    });
                }

            )});

            msg.delete()
            interaction.followUp({content: '```diff\n+ Blocked!```', ephemeral: true})

        } else return interaction.update({content: '```diff\n- The selected message is not a confession!```', embeds:[], components: []});
        
    }
}