const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const client = new Discord.Client();
let crateID;
let crateUsrID;
let intervalTime = getRandomInt(4.32e+7, 1.008e+8)
console.log(intervalTime);

client.once('ready', () => {
	console.log('Ready!');
});
	
const myFunction = function() {
	const channel = client.channels.cache.get('771373426664275980');
	(channel.send('📦 PINAPL CRATE 📦\n*React first to claim!*')).then((msg) => {
		crateID = msg.id;
	});
	intervalTime = getRandomInt(4.32e+7, 1.008e+8);
	setTimeout(myFunction, intervalTime);
	console.log(intervalTime);
}
setTimeout(myFunction, intervalTime);

client.on('message', async message => {

	if (message.content.includes('📦 PINAPL CRATE 📦\n*React first to claim!*')) {
		message.react('🔑');

		const filter = (reaction, user) => {
			crateUsrID = user.id;
			return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id)
		};
		const otherCh = client.channels.cache.get('803720772946100275');
		message.awaitReactions(filter, { max: 1 })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '🔑') {
					let crateAmt = getRandomInt(1, 30)
					otherCh.send(`<@145267507844874241>, <@${crateUsrID}> found ${crateAmt} <:pp:772971222119612416>!`)
					message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
				}
			});
	}	
		
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}

	if (message.content === '!pong') {
		message.channel.send('Ping.');
	}
});


client.login(token);