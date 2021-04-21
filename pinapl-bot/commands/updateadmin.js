const { updateGameStatus, updateSponsorList, updateUserStatus } = require("../func");

module.exports = {
	name: 'updateadmin',
	type: 'Admin',
    description: 'Update\'s the admin panel.',
	usage: false,
	execute(message) {
        updateGameStatus(message);
        updateSponsorList(message);
        updateUserStatus(message);

        message.channel.send('Successfully updated.');
	},
};