const DEFAULT_IMG = "default_player.svg";
blindIdx = 1;
input = "";
inputAmount = 0;
globalBet = 0;
const scoreFunctions = new Array(getStraightFlushScore, getQuadsScore, getFullHouseScore,
    getFlushScore, getStraightScore, getThreeScore, getTwoPairScore, getPairScore, getHandScore);

function sleep(milis){
    return new Promise(resolve => setTimeout(resolve, milis));
}

function cardToImgNameConv(card){
    return card.split('').reverse().join('');
}

class player{
    #hand = Array(0,0);
    #money = 0;
    #imgUrl = DEFAULT_IMG;
    #isSelf = false;
    #name = "-1";
    #idx = 0;
    #htmlId = '';
    #blind = '';
    #bet = 0;
    #state = 'in';
    #score = 0;
    #winComb = new Array();
    #winType = '';
    constructor(money, idx, name = null, img = null, isSelf = false){
        if(name !== null){
            this.#name = name;
        }
        if(img !== null){
            this.#imgUrl = img;
        }
        this.#isSelf = isSelf;
        this.#idx = idx;
        this.#money = money;
    }
    setBlind(button){
        const playButtonElement = document.getElementById(this.#htmlId).getElementsByClassName('playButton')[0];
        playButtonElement.innerHTML = button;
        this.#blind = button;
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
    updateScoreAndComb(communityCards){
        [this.#score, this.#winComb, this.#winType] = getCardsScore(this.#hand, communityCards);
    }
    getWinComb(){
        return this.#winComb;
    }
    getWinType(){
        return this.#winType;
    }
    fold(){
        this.#state = 'fold';
        this.score = 0;
        document.getElementById(this.#htmlId).style.background = '#a00';
    }
    getState(){
        return this.#state;
    }
    backIn(){
        this.#state = 'in';
        document.getElementById(this.#htmlId).style.background = 'rgba(0,0,0,0.35)';
    }
    isSelf(){
        return this.#isSelf;
    }
    getBlind(){
        return this.#blind;
    }
    getBet(){
        return this.#bet;
    }
    setBet(bet){
        if(bet > this.#money){
            this.#state = 'allIn';
            this.#bet = this.money;
            return;
        }
        this.#bet = bet;
    }
    getScore(){
        return this.#score;
    }
    setHTMLID(htmlId){
        this.#htmlId = htmlId;
    }
    getHTMLID(){
        return this.#htmlId;
    }
    setHand(idx, card){
        this.#hand[idx] = card;
    }
    getHand(){
        return this.#hand;
    }
    getMoney(){
        return this.#money;
    }
    removeMoney(amount){
        return this.#money -= amount;
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

function getCardsScore(hand, community){
    var cards = hand.concat(community);
    var winComb = new Array();
    var winType = '';
    var i = 0;
    var score = 0;
    while(true){
        [score, winComb] = scoreFunctions[i++](cards);
        if(score > 0){
            break;
        }
    }
    if(score == getRoyalStraightFlushMax()){
        winType = 'royal';
    }
    if(score <= getStraightFlushMax() && score >= getStraightFlushMin()){
        winType = 'straightFlush';
    }
    if(score <= getQuadsMax() && score >= getQuadsMin()){
        winType = 'quads';
    }
    if(score <= getFullHouseMax() && score >= getFullHouseMin()){
        winType = 'fullHouse';
    }
    if(score <= getStraightMax() && score >= getStraightMin()){
        winType = 'straight';
    }
    if(score <= getThreeMax() && score >= getThreeMin()){
        winType = 'three';
    }
    if(score <= getTwoPairMax() && score >= getTwoPairMin()){
        winType = 'twoPair';
    }
    if(score <= getPairMax() && score >= getPairMin()){
        winType = 'pair';
    }
    if(score <= getHandMax() && score >= getHandMin()){
        winType = 'hand';
    }
    return [score, winComb, winType];
}

function errorFunction(){
    document.body.innerHTML = "Konnte Gegner Menge nicht erhalten";
}

function buildPage(enemies, player){
    for(var i = 0; i < enemies.length; i++){
        drawEnemy(enemies[i], i);
    }
    drawPlayer(player);
    
}

function drawEnemy(enemy, i){
    if(enemy.getName() == "-1"){
        var enemName = "Bot#" + (i + 1);
    }else{
        var enemName = enemy.getName();
    }

    document.getElementById('players').innerHTML += 
        "<div id='enemy" + i + "' class='enemy entity'>" + 
        "<img src='"+ enemy.getImgUrl() + "'>\n" + 
        "<span>" + enemName + "</span>\n" +
        "<span class='money'>" + enemy.getMoney() + "</span>"+
        "<div class='cards'></div>" +
        "<div class='playButton'></div>" +
        "<div class='bet' style='visibility: hidden;'>"+
        "<span class='betText'></span>"+
        '<img src="jeton.svg" alt="jeton">' +
        "</div>" +
        "</div>";
    
    var htmlElement = document.getElementById('enemy' + i);
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
        "<div class='bet' style='visibility: hidden;'>"+
        "<span class='betText'></span>"+
        '<img src="jeton.svg" alt="jeton">' +
        "</div>" +
        "</div>";
    var htmlElement = document.getElementById('player');
    htmlElement.style.offsetDistance = 100/10*4+18.5 + "%";
    player.setHTMLID('player');
}

function createBots(enemCount){
    var enemies = new Array();
    if(enemCount !== null){
        for(var i = 1; i <= enemCount; i++){
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
    for(var i = 0; i < entityList.length; i++){
        for(var j = 0; j < entityList.length-1; j++){
            if(entityList[j].getIndex() > entityList[j+1].getIndex()){
                var temp = entityList[j];
                entityList[j] = entityList[j+1];
                entityList[j+1] = temp;
            }
        }
    }
}

function setEntityBlinds(entityList){
    for(var i=0; i < entityList.length; i++){
        entityList[i].setBlind('');
    }
    entityList[blindIdx%entityList.length].setBlind('BB');
    entityList[(blindIdx-1)%entityList.length].setBlind('SB');
}

function addComCard(){
    var card = deck.shift(0);
    communityCards.push(card);
    document.getElementById('communityCards').innerHTML += '<div class="community">' +
        '<img src="./cardsSVGs/' + cardToImgNameConv(card) + '.svg" alt="' + card + '">'+
        '</div>';
}

function doTurn(turn){
    var turnElement = document.getElementById('tableText')
    switch(turn){
        case 0:
            turnElement.innerHTML = "Pre-Flop";
            break;
        case 1:
            for(var j = 0; j < 3; j++){
                addComCard();
            }
            turnElement.innerHTML = "Flop";
            break;
        case 2:
            addComCard();
            turnElement.innerHTML = "Turn";
            break;
        case 3:
            addComCard();
            turnElement.innerHTML = "River";
            break;
        case 4:
            doShowdown();
            turnElement.innerHTML = "Showdown"
            break;
    }
}


function toggleActionButton(button = null){
    var actionButtons = document.getElementsByClassName('actionButton');
    if(button != null && button.classList.contains('active')){
        button = null;
    }
    for(var j = 0; j < actionButtons.length; j++){
        if(actionButtons[j].classList.contains('active')){
            actionButtons[j].classList.replace('active', 'unactive');
        }
    }

    if(button == null){
        input = '';
        toggleRaiseBar(false);
        return;
    }

    if(button.classList.contains('unactive')){
        if(button.id == 'raise'){
            toggleRaiseBar(true);
        }else{
            input = button.id;
        }
        button.classList.replace('unactive', 'active');
    }
}


function setTurn(entity, isTurn){
    var htmlElement = document.getElementById(entity.getHTMLID());
    if(isTurn){
        htmlElement.classList.add('onTurn');
    }else{
        htmlElement.classList.remove('onTurn');
    }
}

function calculateAction(entity){
    return ['call', 0];
}

function drawPlayerCards(entity, canSee){
    if(canSee){
        var cards = entity.getHand();
    }else{
        var cards = ['B1', 'B1'];
    }
    if(cards[0] != 0 && cards[1] != 0){
        htmlElement = document.getElementById(entity.getHTMLID()).getElementsByClassName('cards')[0];
        htmlElement.style.setProperty('--cardImg1', 'url(./cardsSVGs/' + cardToImgNameConv(cards[0]) + '.svg)');
        htmlElement.style.setProperty('--cardImg2', 'url(./cardsSVGs/' + cardToImgNameConv(cards[1]) + '.svg)');
    }
}

async function getAction(resolve, entity, betTime){
    var action = ['fold', 0];
    setTurn(entity, true);
    var timer = 0;
    if(entity.getName() == '-1'){
        action = calculateAction(entity);
        await sleep(100);
    }else{
        while(input == '' && timer <= betTime*1000){
            await sleep(10);
            timer+=10;
        }
        action = [input, parseInt(inputAmount)];
        toggleActionButton();
    }
    setTurn(entity, false);
    resolve(action);
}

function updateBets(entityList){
    for(var j = 0; j < entityList.length; j++){
        var htmlElement = document.getElementById(entityList[j].getHTMLID());
        htmlElement.getElementsByClassName('betText')[0].innerHTML = entityList[j].getBet();
        if(entityList[j].getBet() > 0){
            htmlElement.getElementsByClassName('bet')[0].style.visibility = 'visible';
        }else{
            htmlElement.getElementsByClassName('bet')[0].style.visibility = 'hidden';
        }
    }
}

function updateMoney(entityList){
    for(var i = 0; i < entityList.length; i++){
        var htmlElement = document.getElementById(entityList[i].getHTMLID());
        htmlElement.getElementsByClassName('money')[0].innerHTML = entityList[i].getMoney();
    }
}

function updateEntitys(entityList){
    updateMoney(entityList);
    updateBets(entityList);
}

function processAction(entity, action, bet){
    switch(action[0]){
        case 'fold', '':
            entity.fold();
            break;
        case 'call':
            entity.setBet(bet);
            break;
        case 'raise':
            entity.setBet(action[1]);
            break;
    }
    return entity.getBet();
}

function updatePot(pot){
    document.getElementById('potAmount').innerHTML = pot;
}

function updateTable(entityList, pot){
    for(var j = 0; j < entityList.length; j++){
        entityList[j].setBet(0);
    }
    updateEntitys(entityList);
    updatePot(pot);
}

function removeAllCards(entityList){
    for(var j = 0; j < entityList.length; j++){
        htmlElement = document.getElementById(entityList[j].getHTMLID());
        htmlElement.style.setProperty('--cardImg1', '');
        htmlElement.style.setProperty('--cardImg2', '');
    }
}

function giveCards(deck, entityList, handIdx){
    for(var i = 0; i < entityList.length; i++){
        entityList[i].setHand(handIdx, deck.shift());
    }
}

function resetComCards(){
    document.getElementById('communityCards').innerHTML = '';
}

function setWinner(entity, pot){
    console.log(entity.getScore())
    console.log(entity.getWinComb())
    var htmlElement = document.getElementById(entity.getHTMLID());
    document.getElementById('tableText').innerHTML = entity.getWinType();
    htmlElement.style.background = '#0f0';
    drawPlayerCards(entity, true);
    entity.addMoney(pot);
}

async function game(resolve, entityList, blind){
    communityCards = new Array();
    var pot = 0;
    var turn = 0;
    var bet = blind;
    globalBet = bet;
    sortByEntityIdx(entityList);
    setEntityBlinds(entityList);
    for(var i = 0; i < entityList.length; i++){
        if(entityList[i].getBlind() == 'BB'){
            entityList[i].setBet(blind);
        }else if(entityList[i].getBlind() == 'SB'){
            entityList[i].setBet(blind/2);
        }
    }
    giveCards(deck, entityList, 0);
    giveCards(deck, entityList, 1);
    for(var i = 0; i < entityList.length; i++){
        if(entityList[i].isSelf()){
            drawPlayerCards(entityList[i], true);
        }else{
            drawPlayerCards(entityList[i], false);
        }
    }
    var lastBetIdx = blindIdx+1;
    var startIdx = blindIdx+1;
    while(turn < 4){
        doTurn(turn);
        for(var i = startIdx; i < entityList.length+lastBetIdx; i++){
            var entity = entityList[i%entityList.length];
            updateEntitys(entityList);
            if(entity.getState() == 'fold'){
                continue;
            }
            var currAction = new Promise(resolve => getAction(resolve, entity, 5));
            var action = await currAction.then(function(out){ return out});
            
            if(action[0] == 'raise'){
                lastBetIdx = i;
                bet = action[1];
                globalBet = bet;
            }
            pot += processAction(entity, action, bet);
            entity.removeMoney(entity.getBet());
        }
        updateTable(entityList, pot);
        bet = 0;
        startIdx = 0;
        lastBetIdx = 0;
        turn++;
    }
    var winIdx = 0;
    for(var i = 0; i < entityList.length; i++){
        entityList[i].updateScoreAndComb(communityCards);
        if(entityList[i].getScore() > entityList[winIdx].getScore()){
            winIdx = i;
        }
    }
    setWinner(entityList[winIdx], pot);
    updateTable(entityList, 0);
    resolve();
}

function toggleRaiseBar(on){
    var raiseBar = document.getElementById('raiseBar');
    if(on){
        raiseBar.style.visibility = 'visible';
    }else{
        raiseBar.style.visibility = 'hidden';
    }
}

function addListeners(){
    var actionButtons = document.getElementsByClassName('actionButton');
    for(var i = 0; i < actionButtons.length; i++){
        actionButtons[i].addEventListener('click', function(){
            toggleActionButton(this);
        })
    }
    var raiseRange = document.getElementById('raiseRange');
    var raiseText = document.getElementById('raiseAmount');
    raiseText.innerHTML = raiseRange.value;
    raiseRange.addEventListener('input', function(){
        raiseRange.style.setProperty('--amount', raiseRange.value/raiseRange.getAttribute('max')*100 + "%");
        raiseText.innerHTML = raiseRange.value;
    })
    var raiseConfirm = document.getElementById('raiseConfirm');
    raiseConfirm.addEventListener('click', function(){
        inputAmount = raiseRange.value;
        input = 'raise'
        toggleRaiseBar(false);
    })
}

function cloneArray(arr){
    return arr.map((x) => x);
}

function backIntoGame(entityList){
    for(var j = 0; j < entityList.length; j++){
        entityList[j].backIn();
    }
}

addEventListener('DOMContentLoaded', function(){
    var blindIdx = 0;
    const params = new URLSearchParams(window.location.search);
    var enemies = createBots(parseInt(params.get('enemCount')));
    var self = new player(1000, 5, 'Paul', null, true); 
    if(enemies == null){
        errorFunction();
        return;
    }
    var entityList = enemies.concat(self);
    buildPage(enemies, self);
    addListeners();
    document.getElementById('start').addEventListener('click',async function(){
        this.parentElement.removeChild(this);
        while(true){
            deck = getNewDeck();
            var blind = 50;
            var currGame = new Promise(resolve => game(resolve, entityList, blind));
            await currGame
            blindIdx = (++blindIdx)%entityList.length;
            await sleep(10000);
            resetComCards();
            removeAllCards(entityList);
            backIntoGame(entityList);
        }
    })
})