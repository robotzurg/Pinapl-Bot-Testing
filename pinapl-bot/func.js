const Discord = require('discord.js');
const db = require('./db.js');

module.exports = {
    test: function() {
        console.log('Test');
    },

    // The main reason this function exists is to provide a easier in-code solution for error handling Unknown Message errors.
    msg_delete_timeout: function(msg, dur, content = false) {
        if (content === false) {
            msg.delete({ timeout: dur }).catch(error => {
                if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                    console.error('Failed to delete the message:', error);
                }
            });
        } else {
            msg.channel.send(content).then(m => {
                m.delete({ timeout: dur }).catch(error => {
                    if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                        console.error('Failed to delete the message:', error);
                    }
                });
            });
        }
    },

    add_role: function(msg, user, role_id) {
        const added_role = msg.guild.roles.cache.find(role => role.id === role_id);
        msg.guild.members.fetch(user).then(a => a.roles.add(added_role));
    },

    remove_role: function(msg, user, role_id) {
        const removed_role = msg.guild.roles.cache.find(role => role.id === role_id);
        msg.guild.members.fetch(user).then(a => a.roles.remove(removed_role));
    },

    updateUserStatus: function(message) {
        const channeltoSearch = message.guild.channels.cache.get('833921630010212382');
        const statusPanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current Status of the Game')
        .setDescription(`**Game Status:** ${db.stats.get('Game Status')}\n**Day:** ${db.stats.get('Day')}\n**In-Game Time:** ${db.stats.get('Time')}\n` + 
        `**Players Left:** ${db.stats.get('Players Left')}`);        

        (channeltoSearch.messages.fetch('833930096720740372')).then((msg) => {
            msg.edit(statusPanel);
        });
    },

    updateGameStatus: function(message) {
        const channeltoSearch = message.guild.channels.cache.get('833921630010212382');
        const alivePanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current Status of the Players in the Game');

        let playerList = db.tributes.keyArray();
        playerList = playerList.filter(s => s !== 'Alive' && s !== 'Dead');
        playerList = playerList.map(tribute => `<@${tribute}>\n**Status:** ${db.tributes.get(tribute, 'status')}` + 
        `\n**Health:** ${db.tributes.get(tribute, 'health')}\n**Has Done Action:** ${db.tributes.get(tribute, 'action')}\n**Number of Kills:** ${db.tributes.get(tribute, 'kill_num')}\n`);
        alivePanel.setDescription(playerList);

        (channeltoSearch.messages.fetch('833930097466933248')).then((msg) => {
            msg.edit(alivePanel);
        });
    },

    updateSponsorList: function(message) {
        const channeltoSearch = message.guild.channels.cache.get('833921630010212382'); 
        const sponsorPanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current list of sponsors')
        .setDescription(`**Daily:**\n${db.priority_airdrop.keyArray().join('\n')}\n**Cornucopia:**\n${db.airdrop.keyArray().join('\n')}`);

        (channeltoSearch.messages.fetch('833930098130288660')).then((msg) => {
            msg.edit(sponsorPanel);
        });
    },

};