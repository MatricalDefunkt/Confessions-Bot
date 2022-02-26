wait(1000);

			console.log(`here3`)
			console.log(`here4`)

			for (let u = 0; u < IDs.length; u++) {
				const uid = IDs[u].uid;
				const mid = IDs[u].mid;
				embed = new MessageEmbed()
				console.log(`inloop`)
				embed.setDescription(
				`UID: ${uid}
				MID: ${mid}`
				);

				interaction.channel.send({embeds: [embed]});
			};
