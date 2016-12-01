var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {

    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);
    // TODO: render the characters
    //querySelector te da todos los atributos que tienen las entidades y dentro del for estamos
 	//escribiendo en el HTML todos los atributos(hp y mp) de los personajes y con el .party
	

 	//nos lo escribe en la columna a la que pertenecen.
    var list = Object.keys (this._charactersById);
 	var lchara = document.querySelectorAll('.character-list');
 	var render;
	var personaje;
	//ponemos lo valores lchara como vacios para escribir sobre ellos sin que escriba todo el historial de personajes
	lchara[0].innerHTML = "";
	lchara[1].innerHTML = "";
 	for (var i in list){
     	personaje = this._charactersById[list[i]];
     	render = '<li data-chara- id="' + list[i] + '">' + personaje.name + '(HP: <strong>' + personaje.hp
     	+ '</strong>/' + personaje.maxHp + ', MP: <strong>' + personaje.mp + '</strong>/' + personaje.maxMp +') </li>';

     	if (personaje.party === 'heroes')
        	lchara[0].innerHTML += render;
  
     	else 
         	lchara[1].innerHTML += render;

	
  
 	}
    // TODO: highlight current character
    var pactive = document.getElementById(data.activeCharacterId);
    if(personaje._hp === 0)
  	pactive.classList.add('dead');
  	pactive.classList.add('active');
  	console.log(personaje);
  	

console.log(personaje);
    // TODO: show battle actions form
    //mostramos las opciones con el boton de select action
 	

    actionForm.style.display = 'inline';
    var listOptions = this.options.current._group;
    var actions = actionForm.querySelector('.choices');
    
    actions.innerHTML = "";
    for(var i in listOptions){
    	render =  '<li><label><input type="radio" name="option" value="' + i + '"required>' + i + '</label></li>';
    	actions.innerHTML += render;

    }
    
    //vista de los targets disponibles
    targetForm.style.display = 'none';
    var listTargets = this._charactersById;
    var targets = targetForm.querySelector('.choices');
    targets.innerHTML = "";
    for(var i in listTargets){
    	render =  '<li><label><input type="radio" name="target" value="' + i + '"required>' + i + '</label></li>';
    	targets.innerHTML += render;
    }

    //vista de los hechizos disponibles
    spellForm.style.display = 'none';
 	var listSpells = this._grimoires[this._activeCharacter.party];
 	
 	var spells = spellForm.querySelector('.choices');
 	spells.innerHTML = "";
 	for(var i in listSpells){
 		render =  '<li><label><input type="radio" name="spell" value="' + i + '"required>' + i + '</label></li>';
 		spells.innerHTML += render;
 		
 	}


    if(spellForm.elements.spell === undefined){
           document.getElementById('b').disabled = true;
        }
    else {
            document.getElementById('b').disabled = false;
    }



});

battle.on('info', function (data) {
    console.log('INFO', data);

    var effectsTxt = prettifyEffect(data.effect || {});

    if(data.action === 'attack' && data.success)
       infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " " + data.action + "ed" + " " +  '<strong>' + data.targetId + '</strong>' + "  and caused " + effectsTxt + "."  ;

   else if(data.action === 'attack' && !data.success)
   		infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " has failed.";

   	else if(data.action === 'defend' && data.success)
   		infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " " + data.action + "ed, new defense is " + data.newDefense + ".";

   	 else if(data.action === 'defend' && !data.success)
   		infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " has failed.";

   	else if(data.action === 'cast' && data.success)
       infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " " + data.action + "ed" + " " + data.scrollName + " on " +'<strong>' + data.targetId + '</strong>' + "  and caused " + effectsTxt + "."  ;

    else if(data.action === 'cast' && !data.success)
    	infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " has failed.";


//	var effectsTxt = document.getElementById('battle-info');
//	effectsTxt = '<p id="battle-info"> Holaaaaaaaa!!!!</p>';
//console.log(infoPanel);
    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);
	infoPanel.innerHTML = "Battle is over! Winners were: " +'<strong>' + data.winner + '</strong>';
    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});


window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    
    infoPanel = document.querySelector('#battle-info');


    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
        var action = actionForm.elements['option'].value;
		battle.options.select(action);

        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu

        
        if(action === 'attack'){
        	actionForm.style.display = 'none';
        	targetForm.style.display = 'block';
        }
        else if (action === 'cast'){
        	actionForm.style.display = 'none';
        	spellForm.style.display = 'block';
        }

    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var chosenTarget = targetForm.elements['target'].value;
        battle.options.select(chosenTarget);
        
        // TODO: hide this menu
        targetForm.style.display = 'none';
        actionForm.style.display = 'block';
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        	battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display = 'none';
        // TODO: go to select action menu
         actionForm.style.display = 'block';
    });


    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        

        // TODO: select the spell chosen by the player
        var chosenSpell = spellForm.elements['spell'].value;
		console.log (spellForm.elements);
        //console.log(chosenSpell);
        battle.options.select(chosenSpell);
        // TODO: hide this menu
        spellForm.style.display = 'none';
        
        // TODO: go to select target menu
        targetForm.style.display = 'block';
        battle.options.select(chosenTarget);
        targetForm.style.display = 'none';
        actionForm.style.display = 'block';

      
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        spellForm.style.display = 'none';
        // TODO: go to select action menu
         actionForm.style.display = 'block';
    });

    

    battle.start();
};
