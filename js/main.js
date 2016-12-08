var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;
//arrays para la creacion de parties aleatorias
var partyHeroes = [];
var partyMonsters = [];

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}

//crea un numero random entre un minimo y un maximo
function newRandom(min, max){
        var random = Math.floor(Math.random() * (max - min)) + min;
        return random;
};

//creamos la longitud del array y luego rellenamos de forma aleatoria las posiciones con heroes
partyHeroes.length = newRandom(2, 5);
    for(var i = 0; i < partyHeroes.length; i++){
        var random = newRandom(1, 3);
        if(random === 1){
            partyHeroes[i] = RPG.entities.characters.heroTank;
        }
        else{
            partyHeroes[i] = RPG.entities.characters.heroWizard;
        }
}

//creamos la longitud del array y luego rellenamos de forma aleatoria las posiciones con monstruos
partyMonsters.length = newRandom(4, 7);
    for(var i = 0; i < partyHeroes.length; i++){
        var random = newRandom(1, 4);
        if(random === 1){
            partyMonsters[i] = RPG.entities.characters.monsterSlime;
        }
        else if(random === 2){
            partyMonsters[i] = RPG.entities.characters.monsterBat;
        }
        else {
            partyMonsters[i] = RPG.entities.characters.monsterSkeleton;
        }

}

battle.setup({
    heroes: {
    	//igualamos los miembros de heroes al array partyHeroes para que sea aleatorio
        members: partyHeroes, /*[
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],*/
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    //igualamos los miembros de heroes al array partyMonsters para que sea aleatorio
    monsters: {
        members: partyMonsters,/*[
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]*/
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
       //si un personaje esta muerto se le añade la clase dead al renderizar sino se renderiza de manera normal
       if(personaje.hp <= 0){
            render = '<li data-chara- id="' + list[i] + '"class = "dead"' + '">' + personaje.name + '(HP: <strong>' + personaje.hp
            + '</strong>/' + personaje.maxHp + ', MP: <strong>' + personaje.mp + '</strong>/' + personaje.maxMp +') </li>';
       }
       else{
            render = '<li data-chara- id="' + list[i] + '">' + personaje.name + '(HP: <strong>' + personaje.hp
            + '</strong>/' + personaje.maxHp + ', MP: <strong>' + personaje.mp + '</strong>/' + personaje.maxMp +') </li>';
            
       }
     	
        //se renderiza en la seccion de heroes o en monsters
     	if (personaje.party === 'heroes'){
        	lchara[0].innerHTML += render;
        }

  
     	else {
         	lchara[1].innerHTML += render;
           
        }


    
 }
     
 	//se le añade la clase active al personaje en su turno
    var pactive = document.getElementById(data.activeCharacterId);
  	pactive.classList.add('active');



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
    	//si un target esta muerto no aparece en la lista de opciones puesto que no se le puede atacar
    	if(listTargets[i].party == 'heroes' && listTargets[i].hp !== 0){
    		render =  '<li><label class="heroes"><input type="radio" name="target" value="' + i + '"required>' + i + '</label></li>';
    		targets.innerHTML += render;
    	}
    	else if(listTargets[i].hp !== 0){
    		render =  '<li><label class="monsters"><input type="radio" name="target" value="' + i + '"required>' + i + '</label></li>';
    		targets.innerHTML += render;
    	}
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
   
 	//el boton para castear un hechizo se desactiva si no hay mana suficiente (el minimo es 10 para health) o si el personaje no lanza hechizos 
    if(this._activeCharacter._mp <= 10 || spellForm.elements.spell === undefined){
        document.getElementById('b').disabled = true;
    }
    else {
        document.getElementById('b').disabled = false;
    }
            

});

battle.on('info', function (data) {
    console.log('INFO', data);
    // TODO: display turn info in the #battle-info panel
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


});

battle.on('end', function (data) {
    console.log('END', data);
	
    // TODO: re-render the parties so the death of the last character gets reflected
    var list = Object.keys (this._charactersById);
    var lchara = document.querySelectorAll('.character-list');
    var render;
    var personaje;

    //ponemos lo valores lchara como vacios para escribir sobre ellos sin que escriba todo el historial de personajes
    lchara[0].innerHTML = "";
    lchara[1].innerHTML = "";
   
  
    for (var i in list){
        personaje = this._charactersById[list[i]];
       
       if(personaje.hp <= 0){
            render = '<li data-chara- id="' + list[i] + '"class = "dead"' + '">' + personaje.name + '(HP: <strong>' + personaje.hp
            + '</strong>/' + personaje.maxHp + ', MP: <strong>' + personaje.mp + '</strong>/' + personaje.maxMp +') </li>';
       }
       else{
            render = '<li data-chara- id="' + list[i] + '">' + personaje.name + '(HP: <strong>' + personaje.hp
            + '</strong>/' + personaje.maxHp + ', MP: <strong>' + personaje.mp + '</strong>/' + personaje.maxMp +') </li>';
       }
        
        
        if (personaje.party === 'heroes'){
            lchara[0].innerHTML += render;
        }

  
        else {
            lchara[1].innerHTML += render;
           
        }
    
 }
    // TODO: display 'end of battle' message, showing who won
    //tambien muestra un boton para volver a jugar
    infoPanel.innerHTML = "The battle is over! Winners are: " +'<strong>' + data.winner + ' </strong><button type="submit" onClick="history.go(0)">Play again!</button>';
    

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
