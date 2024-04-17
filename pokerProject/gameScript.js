const DEFAULT_IMG = "default_player.svg";
blindIdx = 1;
pot = 0;
input = "";
inputAmount = 0;
globalBet = 0;

function sleep(milis){
    return new Promise(resolve => setTimeout(resolve, milis));
}

class player{
    #hand = Array(null, null);
    #money = 0;
    #imgUrl = DEFAULT_IMG;
    #name = "-1";
    #idx = 0;
    #htmlId = '';
    constructor(money, idx, name = null, img = null){
        if(name !== null){
            this.#name = name;
        }
        if(img !== null){
            this.#imgUrl = img;
        }
        this.#idx = idx;
        this.#money = money;
    }
    setBlind(button){
        const playButtonElement = document.getElementById(this.#htmlId).getElementsByClassName('playButton')[0];
        playButtonElement.innerHTML = button;
        switch(button){
            case '':
                playButtonElement.classList.remove('big');
                playButtonElement.classList.remove('small');
                break;
            case 'BB':
                playButtonElement.classList.add('big');
                break;
            case 'SB':
                playButtonElement.classList.add('small');
                break;
        }

    }
    setHTMLID(htmlId){
        this.#htmlId = htmlId;
    }
    getHTMLID(){
        return this.#htmlId;
    }
    getHand(){
        return this.#hand;
    }
    getMoney(){
        return this.#money;
    }
    removeMoney(amount){
        this.#money -= amount;
    }
    addMoney(amount){
        this.#money += amount;
    }
    getImgUrl(){
        return this.#imgUrl;
    }
    getName(){
        return this.#name;
    }
    setIndex(idx){
        this.#idx = idx;
    }
    getIndex(){
        return this.#idx;
    }

}

function errorFunction(){
    console.log("Couldnt get Enemy Count");
    document.body.innerHTML = "Konnte Gegner Menge nicht erhalten";
}

function buildPage(enemies, player){
    for(i = 0; i < enemies.length; i++){
        drawEnemy(enemies[i], i, enemies.length);
    }
    drawPlayer(player);
    
}

function drawEnemy(enemy, i, enemCount){
    if(enemy.getName() == "-1"){
        enemName = "Bot#" + (i + 1);
    }else{
        enemName = enemy.getName();
    }

    document.getElementById('players').innerHTML += 
        "<div id='enemy" + i + "' class='enemy entity'>" + 
        "<img src='"+ enemy.getImgUrl() + "'>\n" + 
        "<span>" + enemName + "</span>\n" +
        "<span class='money'>" + enemy.getMoney() + "</span>"+
        "<div class='cards'></div>" +
        "<div class='playButton'></div>" +
        "</div>";
    
    htmlElement = document.getElementById('enemy' + i);
    if(i >= 4){
        htmlElement.style.offsetDistance = 100/10*(i+1)+18.5 + "%";
    }else{
        htmlElement.style.offsetDistance = 100/10*i+18.5 + "%";
    }
    enemy.setHTMLID('enemy' + i);
}

function drawPlayer(player){
    document.getElementById('players').innerHTML += "<div id='player' class='player entity'>" + 
        "<img src='"+ player.getImgUrl() + "'>\n" + 
        "<span>" + player.getName() + "</span>\n" +
        "<span class='money'>" + player.getMoney() + "</span>"+
        "<div class='cards'></div>" +
        "<div class='playButton'></div>" +
        "</div>";
    htmlElement = document.getElementById('player');
    htmlElement.style.offsetDistance = 100/10*4+18.5 + "%";
    player.setHTMLID('player');
}

function createBots(enemCount){
    enemies = Array();
    if(enemCount !== null){
        for(i = 1; i <= enemCount; i++){
            if(i >= 5){
                enemies.push(new player(1000, i+1));
            }else{
                enemies.push(new player(1000, i));
            }
        }
    }else{
        return null;
    }
    return enemies;
}

function sortByEntityIdx(entityList){
    for(i = 0; i < entityList.length; i++){
        for(j = 0; j < entityList.length-1; j++){
            if(entityList[j].getIndex() > entityList[j+1].getIndex()){
                temp = entityList[j];
                entityList[j] = entityList[j+1];
                entityList[j+1] = temp;
            }
        }
    }
}

function setEntityBlinds(entityList){
    for(i=0; i < entityList.length; i++){
        entityList[i].setBlind('');
    }
    entityList[blindIdx%entityList.length].setBlind('BB');
    entityList[(blindIdx-1)%entityList.length].setBlind('SB');
}

function showTurn(turn){
    turnElement = document.getElementById('turn')
    switch(turn){
        case 0:
            turnElement.innerHTML = "Hole Cards";
            break;
        case 1:
            turnElement.innerHTML = "Flop";
            break;
        case 2:
            turnElement.innerHTML = "Turn";
            break;
        case 3:
            turnElement.innerHTML = "River";
            break;
        case 4:
            turnElement.innerHTML = "Showdown"
            break;
    }
}


function toggleActionButton(button = null){
    actionButtons = document.getElementsByClassName('actionButton');
    if(button != null && button.classList.contains('active')){
        button = null;
    }
    for(j = 0; j < actionButtons.length; j++){
        if(actionButtons[j].classList.contains('active')){
            actionButtons[j].classList.replace('active', 'unactive');
        }
    }
    if(button == null){
        input = '';
        return;
    }
    if(button.classList.contains('unactive')){
        if(button.id == 'raise'){
            toggleRaiseBar();
        }
        input = button.id;
        button.classList.replace('unactive', 'active');
    }
}

function processAction(entity){
    return ['fold', 0];
}

function setTurn(entity, isTurn){
    htmlElement = document.getElementById(entity.getHTMLID());
    if(isTurn){
        htmlElement.classList.add('onTurn');
    }else{
        htmlElement.classList.remove('onTurn');
    }
}

async function getAction(resolve, entity, betTime){
    action = ['fold', 0];
    setTurn(entity, true);
    timer = 0;
    if(entity.getName() == '-1'){
        action = processAction(entity);
        await sleep(1000);
    }else{
        while(input == '' && timer <= betTime*1000){
            await sleep(10);
            timer+=10;
        }
        action = [input, inputAmount];
        toggleActionButton();
    }
    setTurn(entity, false);
    resolve(action);
}



async function game(resolve, entityList, blind){
    turn = 0;
    bet = blind;
    globalBet = bet;
    sortByEntityIdx(entityList);
    setEntityBlinds(entityList);
    while(turn < 5){
        lastBetIdx = 0;
        showTurn(turn);
        for(i = blindIdx; i < entityList.length+blindIdx+lastBetIdx; i++){
            currAction = new Promise(resolve => getAction(resolve, entityList[(i+1)%entityList.length], 5));
            action = await currAction.then(function(out){ return out});
            if(action[0] == 'raise'){
                lastBetIdx = i;
                bet = action[1];
                globalBet = bet;
            }
        }
        turn++;
        bet = 0;
    }
    resolve();
}

function toggleRaiseBar(){
    raiseBar = document.getElementById('raiseBar');
    if(raiseBar.style.visibility == 'hidden'){
        raiseBar.style.visibility = 'visible';
    }else{
        raiseBar.style.visibility = 'hidden';
    }
}

function addListeners(){
    actionButtons = document.getElementsByClassName('actionButton');
    for(i = 0; i < actionButtons.length; i++){
        actionButtons[i].addEventListener('click', function(){
            toggleActionButton(this);
        })
    }
    raiseRange = document.getElementById('raiseRange');
    raiseText = document.getElementById('raiseAmount');
    raiseText.innerHTML = raiseRange.value;
    raiseRange.addEventListener('input', function(){
        raiseRange.style.setProperty('--amount', raiseRange.value/raiseRange.getAttribute('max')*100 + "%");
        raiseText.innerHTML = raiseRange.value;
    })
    raiseConfirm = document.getElementById('raiseConfirm');
    raiseConfirm.addEventListener('click', function(){
        inputAmount = raiseRange.value;
        toggleRaiseBar();
    })

}

addEventListener('DOMContentLoaded', function(){
    const params = new URLSearchParams(window.location.search);
    enemies = createBots(parseInt(params.get('enemCount')));
    self = new player(1000, 5, 'Paul'); 
    if(enemies == null){
        errorFunction();
        return;
    }
    entityList = enemies.concat(self);
    buildPage(enemies, self);
    addListeners();
    document.getElementById('start').addEventListener('click',async function(){
        this.parentElement.removeChild(this);
        while(true){
            blind = 50;
            currGame = new Promise(resolve => game(resolve, entityList, blind));
            await currGame
            blindIdx = (blindIdx)%entityList.length+1;
            await sleep(1000);
        }
    })
})