const db = require("../db");
const { bloodbathEvents, miscEvents, attackEvents, injuryEvents, itemEvents, nightEvents } = require("../arrays.json");

module.exports = {
	name: 'testscenario',
    aliases: ['testscenario', 'ts'],
	type: 'Games',
    description: 'Test a scenario.',
    args: true,
	usage: '<type>',
	execute(message, args) {

        if (message.author.id === '122568101995872256' || message.author.id === '145267507844874241') {
            // Set up variables used later
            const type = args[0].toLowerCase();
            
            let typeArray = false;
            let tributeArray;
            let tribute = [false, false]; //Tributes 1 and 2

            let tribInv;
            let airdropInv;
            let item = false;

            let action = false;
            let actTribNum;
            let killNum;
            let dmgNum;
            let tribHealth;

            // Figure out which array type we are using
            switch (type) {
                case 'bb': typeArray = bloodbathEvents; break;
                case 'misc': typeArray = miscEvents; break;
                case 'attack': typeArray = attackEvents; break;
                case 'injury': typeArray = injuryEvents; break;
                case 'item': typeArray = itemEvents; break;
                case 'night': typeArray = nightEvents; break;
                default: typeArray = false;
            }
            if (typeArray === false) return message.channel.send('Invalid event type.');

            // Pick an event
            let pickedEvent = typeArray[Math.floor(Math.random() * typeArray.length)];

            // Replace (Tribute 1) with our mention name
            tributeArray = db.tributes.keyArray();
            tributeArray = tributeArray.filter(key => key != 'Dead');
            tributeArray = tributeArray.filter(key => key != 'Alive');
            tributeArray = tributeArray.filter(key => db.tributes.get(key, 'status') === 'Alive');
            tribute[0] = tributeArray[Math.floor(Math.random() * tributeArray.length)];
            pickedEvent = pickedEvent.replace('(Tribute 1)', `<@${tribute[0]}>`);

            // If there is a second tribute
            if (pickedEvent.includes('(Tribute 2)')) {
                while (tribute[0] === tribute[1] || tribute[1] === false) {
                    tribute[1] = tributeArray[Math.floor(Math.random() * tributeArray.length)];
                }
                pickedEvent = pickedEvent.replace('(Tribute 2)', `<@${tribute[1]}>`);
            }

            // Handle Items
            if (pickedEvent.includes('{Item-G}')) { // Gaining an item

                airdropInv = db.airdrop.keyArray();
                item = airdropInv[Math.floor(Math.random() * airdropInv.length)];
                db.airdrop.delete(item);
                db.tributes.push(tribute[0], item, 'inventory');
                pickedEvent = pickedEvent.replace('{Item-G}', `${item}`);

            } else if (pickedEvent.includes('{Item-L}')) { // Loss of an item

                tribInv = db.tributes.get(tribute[0], 'inventory');
                item = tribInv[Math.floor(Math.random() * tribInv.length)];
                tribInv = tribInv.filter(key => key != item);
                db.tributes.set(tribute[0], tribInv, 'inventory');
                pickedEvent = pickedEvent.replace('{Item-L}', `${item}`);

            } else if (pickedEvent.includes('{Item-U}')) { // Using an item (does nothing to stats)

                tribInv = db.tributes.get(tribute[0], 'inventory');
                item = tribInv[Math.floor(Math.random() * tribInv.length)];
                pickedEvent = pickedEvent.replace('{Item-U}', `${item}`);

            }

            // Handle Actions
            if (pickedEvent.includes('[')) {
                action = [pickedEvent.split('[')[1]];
                action[0] = action[0].replace(']', '');
                if (action[0].includes(',')) {
                    action[0] = action[0].split(', ');
                    action = action.flat(1);
                }

                //Begin action checks
                for (let i = 0; i < action.length; i++) {
                    if (action[i].includes('D')) { //D = Death

                        actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
                        db.tributes.set(`${tribute[actTribNum]}`, 'Dead', 'status');
                        tributeArray = tributeArray.filter(key => key != tribute[actTribNum]);
                        db.tributes.set(`Alive`, tributeArray);
                        db.tributes.push(`Dead`, `${tribute[actTribNum]}`);

                    } else if (action[i].includes('K')) { //K = Kill
                        
                        actTribNum = parseInt(action[i].split('U')[1].slice(0, -3)) - 1;
                        killNum = parseInt(action[i].split('K')[1]);
                        db.tributes.math(tribute[actTribNum], '+', killNum, 'kill_num');

                    } else if (action[i].includes('G')) { //G = Gone (from the Cornucopia)

                        actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
                        db.tributes.set(tribute[actTribNum], false, 'in_corn');

                    } else { // Just taking Damage
                        
                        actTribNum = parseInt(action[i].split('U')[1].slice(0, -2)) - 1;
                        dmgNum = parseInt(action[i].split('-')[1]);
                        tribHealth = db.tributes.get(tribute[actTribNum], 'health');
                        tribHealth -= dmgNum;
                        
                        if (tribHealth <= 0) { // We dead
                            db.tributes.set(`${tribute[actTribNum]}`, 'Dead', 'status');
                            tributeArray = tributeArray.filter(key => key != tribute[actTribNum]);
                            db.tributes.set(`Alive`, tributeArray);
                            db.tributes.push(`Dead`, `${tribute[actTribNum]}`);
                        } else { // We not dead
                            db.tributes.set(tribute[actTribNum], tribHealth, 'health');
                        }

                    }
                }

                if (action.length === 1) {
                    pickedEvent = pickedEvent.slice(0, -6);
                } else {
                    pickedEvent = pickedEvent.slice(0, -13);
                }

            }

            message.channel.send(pickedEvent);
        }   
	},
};