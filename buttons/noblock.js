module.exports = {
    customId: 'no',

    async execute(interaction, client) {

        interaction.update({content: '```diff\n+ Okay! Block has been cancelled!```', embeds:[], components:[]})

    }
}