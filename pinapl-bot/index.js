const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');
const db = require("./db.js");
const cron = require("node-cron");

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

// Command Collections
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

let crateUsrID;
let intervalTime = randomNumber(4.32e+7, 1.008e+8);
console.log(intervalTime);

client.once('ready', () => {
	console.log('Ready!');
	const date = new Date().toLocaleTimeString().replace("/.*(d{2}:d{2}:d{2}).*/", "$1");
    console.log(date);
});
	
const myFunction = function() {
	const channel = client.channels.cache.get('771373426664275980');
	(channel.send('📦 PINAPL CRATE 📦\n*React first to claim!*'));
	intervalTime = randomNumber(4.32e+7, 1.008e+8);
	setTimeout(myFunction, intervalTime);
	console.log(intervalTime);
};
setTimeout(myFunction, intervalTime);

// Send the workers a message at 10am PST
cron.schedule('00 11 * * *', () => { 
	const workchannel = client.channels.cache.get('809854279552598016');
	workchannel.send('Rise and shine employees of Citrus Inc.! Another day has passed, and now you can all work.\nDon\'t forget, you can use `!work` to work!');
	db.workList.set('workerList', []);
}, {
    scheduled: true,
});

//Listen for people joining
client.on('guildMemberAdd', (guildMember) => {
	db.balances.set(guildMember.id, 0);
});

// Listen for messages
client.on('message', async message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();

    if (args.length > 1) {
        args = message.content.slice(prefix.length).trim().split(/ \| +/);
        const firstargs = args[0].split(/ +/);
        commandName = firstargs.shift().toLowerCase();  
        args[0] = args[0].slice(commandName.length + 1).trim(); 
    }

	if (message.content.includes('📦 PINAPL CRATE 📦\n*React first to claim!*')) {
		message.react('🔑');

		const filter = (reaction, user) => {
			crateUsrID = user.id;
			return ['🔑'].includes(reaction.emoji.name) && (user.id != message.author.id);
		};
		const otherCh = client.channels.cache.get('803720772946100275');
		message.awaitReactions(filter, { max: 1 })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '🔑') {
					let crateAmt = randomNumber(1, 30);
					otherCh.send(`<@145267507844874241>, <@${crateUsrID}> found ${crateAmt} <:pp:772971222119612416>!`);
					message.channel.send(`<@${crateUsrID}> has claimed the crate.\nYou find **${crateAmt}** <:pp:772971222119612416>! Congratulations!`);
					db.balances.math(crateUsrID, '+', crateAmt);
				}
			});
	}	

	if (message.content === '!collect' || message.content === '!work') {
		if (db.workList.get('workerList').includes(message.author.id)) return message.channel.send('You feel pretty tired... You won\'t be able to work for a while.');
		message.channel.send('You work diligently and get 15 <:pp:772971222119612416> for your hard work. Good job!\nYou won\'t be able to mine for a while.');
		db.balances.math(message.author.id, '+', 15);
		db.workList.push('workerList', parseInt(message.author.id));
	}

	const command = client.commands.get(commandName) ||	client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`!${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);	
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.name}\` command.`);
        }

    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`There was an error trying to execute that command!\nMessage sent: \`${message.content}\``);
    }

});

// login to Discord
client.login(token);

