const db = require('../db.js')

module.exports = {
	name: 'ping',
	type: 'Bot',
    description: 'Ping pong!',
	usage: false,
	execute(message) {
        message.channel.send('Ping!');
		db.stats.set('Game Status', 'Corn Sponsors')
		console.log(new Date().toISOString().split('T')[1].slice(0, -8));
	},
};