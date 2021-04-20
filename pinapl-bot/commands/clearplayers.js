const db = require('../db.js');
const { updateGameStatus, updateUserStatus } = require('../func.js');

module.exports = {
	name: 'clearplayers',
	type: 'Games',
    description: 'Clear all the players out of the games.',
	execute(message) {
		let tributeArray = db.tributes.keyArray();
        tributeArray = tributeArray.filter(key => key != 'Alive');
        tributeArray = tributeArray.filter(key => key != 'Dead');

		for (let i = 0; i < tributeArray.length; i++) {
            db.tributes.delete(tributeArray[i]);
		}

        db.tributes.set('Alive', []);
        db.stats.set('Players Left', 0);

		updateGameStatus(message);
		updateUserStatus(message);

		return message.channel.send('Players cleared.');
	},
};