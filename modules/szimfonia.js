import {DiceSystem} from '../../dice-so-nice/api.js';
import {DieSzimfonia} from './die.js';

Hooks.once("init", async function () {
    CONFIG.Dice.terms["s"] = DieSzimfonia;
});

Hooks.on('diceSoNiceRollComplete', (chatMessageID) => {
    let message = game.messages.get(chatMessageID);
    if(message.isAuthor){
        let defense = 0;
        let focus = 0;
        let success = 0;
        let szRoll = false;
        message.rolls.forEach(roll => {
            roll.dice.forEach(dice => {
                if(dice instanceof DieSzimfonia){
                    szRoll = true;
                    dice.results.forEach(res => {
                        switch(res.result){
                            case 5:
                                defense++;
                                break;
                            case 4:
                                focus+=2;
                                break;
                            case 1:
                                success++;
                                break;
                            case 2:
                                success+=2;
                                break;
                            case 3:
                                focus++;
                                break;
                            case 6:
                                defense++;
                                break;
                        }
                    });
                }
            });
        });
        
        if(szRoll){
            ChatMessage.create({
                content: `<b>Defense:</b> ${defense}<br><b>Success:</b> ${success}<br><b>Focus:</b> ${focus}`,
                author: message.author,
                blind: message.blind
            });
        }
    }
});

Hooks.once('diceSoNiceReady', (dice3d) => {
    const system = new DiceSystem("szimfonia", "Szimfonia", "default");
    dice3d.addSystem(system);
    dice3d.addDicePreset({
      type:"ds",
      labels:[
        'modules/szimfonia-dice-roller/images/S1.png', 
        'modules/szimfonia-dice-roller/images/S2.png', 
        'modules/szimfonia-dice-roller/images/F1.png',
		'modules/szimfonia-dice-roller/images/F2.png', 
        'modules/szimfonia-dice-roller/images/D1_bg.png', 		
        'modules/szimfonia-dice-roller/images/D1_bg.png'
      ],
      bumpMaps:[
        'modules/szimfonia-dice-roller/images/S1_bump.png', 
        'modules/szimfonia-dice-roller/images/S2_bump.png', 
        'modules/szimfonia-dice-roller/images/F1_bump.png',
        'modules/szimfonia-dice-roller/images/F2_bump.png',		
        'modules/szimfonia-dice-roller/images/D1_bump.png',
		'modules/szimfonia-dice-roller/images/D1_bump.png'
      ],
      system:"szimfonia"
    });
});