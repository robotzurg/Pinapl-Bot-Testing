module.exports = {
	name: 'ping',
	type: 'Bot',
    description: 'Ping pong!',
	usage: false,
	execute(message) {
        message.channel.send('Ping!');
	},
};