module.exports = {
	name: 'ping',
	type: 'Bot',
    description: 'Ping pong!',
	usage: false,
	execute(message) {
        message.channel.send('Ping!');
		console.log(new Date().toISOString().split('T')[1].slice(0, -8));
	},
};