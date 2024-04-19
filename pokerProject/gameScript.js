const DEFAULT_IMG = "default_player.svg";
//globale Variablen die ohner probleme geändert werden können
input = "";
inputAmount = 0;
globalBet = 0;
globalMoney = 0;

//liste der Scoring Funktionen
const scoreFunctions = new Array(getStraightFlushScore, getQuadsScore, getFullHouseScore,
    getFlushScore, getStraightScore, getThreeScore, getTwoPairScore, getPairScore, getHandScore);


//mudolo um auch negative zahlen rest rechnen zukönnen
function mudolo(x, y){
    return ((x+y)%y);
}

//sleep funktion die dem programm ablauf warten lässt
function sleep(milis){
    return new Promise(resolve => setTimeout(resolve, milis));
}

//convertiert Karten texte (zb.: "HA") zu bild texte (zb.: "AH")
function cardToImgNameConv(card){
    return card.split('').reverse().join('');
}

//Player Klasse für hand habung der atributte wie geld, einsatz, score, und status(dead, all in, usw.)
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
    getKicker(){
        return getHandScore(this.#hand);
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
        if(this.#state == 'fold' || this.#state == 'dead'){
            return;
        }
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
    otherFolded(){
        this.#winType = 'fold';
    }
    getState(){
        return this.#state;
    }
    backIn(){
        if(this.#state != 'dead'){
            this.#state = 'in';
            document.getElementById(this.#htmlId).style.background = 'rgba(0,0,0,0.35)';
        }else{
            this.score = 0;
            document.getElementById(this.#htmlId).style.background = '#a00';
        }
    }
    isSelf(){
        return this.#isSelf;
    }
    resetHand(){
        this.#hand = new Array();
    }
    getBlind(){
        return this.#blind;
    }
    getBet(){
        return this.#bet;
    }
    setBet(bet){
        if(bet >= this.#money){
            this.#state = 'allIn';
            this.#bet = this.#money;
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
    kill(){
        this.#state = 'dead';
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

//aus hand und community Karten den Score berechnen
function getCardsScore(hand, community){
    var cards = hand.concat(community);
    var winComb = new Array();
    var winType = '';
    var score = 0;
    for(var i = 0; i < scoreFunctions.length && score < 1; i++){
        [score, winComb] = scoreFunctions[i](cards);
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
    if(score <= getFlushMax() && score >= getFlushMin()){
        winType = 'flush';
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

//erstelle entitys auf bild
function drawEntitys(enemies, player){
    for(var i = 0; i < enemies.length; i++){
        drawEnemy(enemies[i], i);
    }
    drawPlayer(player);
}

//zeigt gegner an
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

//zeigt spieler an
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
    htmlElement.style.offsetDistance = (100/10*4+18.5) + "%";
    player.setHTMLID('player');
}

//erstellt die bots. index 5 wird übersprungen da dort der player sitzt
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

//sortiert die Players bei deren tisch Indexen welche als attribut in der klasse sind
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

//Zähl die zu überspringenden spieler damit der blind button nicht auf einem "toten" spieler gelangt
function countSkippedBlinds(entityList, blindIdx){
    var tempIdx = 0;
    var entLen = entityList.length;

    for(var i=0; i < entLen; i++){
        if(entityList[mudolo(blindIdx+i, entLen)].getState() == 'dead'){
            continue;
        }
        tempIdx = mudolo(blindIdx+i, entLen);
        break;
    }
    return tempIdx;
}

//setzt die Blind buttons auf die Spieler
function setEntityBlinds(entityList, blindIdx){
    var tempIdx = 0;
    var entLen = entityList.length;

    for(var i=0; i < entLen; i++){
        entityList[i].setBlind('');
    }

    for(var i=0; i < entLen; i++){
        if(entityList[mudolo(blindIdx+i, entLen)].getState() == 'dead'){
            continue;
        }
        tempIdx = mudolo(blindIdx+i, entLen);
        entityList[mudolo(blindIdx+i, entLen)].setBlind('BB');
        break;
    }

    for(var i=0; i < entLen; i++){
        if(entityList[mudolo(tempIdx-i-1, entLen)].getState() == 'dead'){
            continue;
        }
        entityList[mudolo(tempIdx-i-1, entLen)].setBlind('SB');
        break;
    }

    return tempIdx;

}

function addComCard(communityCards, i){
    var card = deck.shift(0);
    communityCards.push(card);
    document.getElementById('communityCards').innerHTML += '<div id="com' + i + '"class="community">' +
        '<img src="./cardsSVGs/' + cardToImgNameConv(card) + '.svg" alt="' + card + '">'+
        '</div>';
}

//zeigt den "game Turn" an und fügt community karten hinzu 
function doTurn(turn, communityCards){
    var turnElement = document.getElementById('tableText')
    switch(turn){
        case 0:
            turnElement.innerHTML = "Pre-Flop";
            break;
        case 1:
            for(var j = 0; j < 3; j++){
                addComCard(communityCards, j);
            }
            turnElement.innerHTML = "Flop";
            break;
        case 2:
            addComCard(communityCards, 3);
            turnElement.innerHTML = "Turn";
            break;
        case 3:
            addComCard(communityCards, 4);
            turnElement.innerHTML = "River";
            break;
        case 4:
            doShowdown();
            turnElement.innerHTML = "Showdown"
            break;
    }
}

//schaltet angegebenen aktions knopf ein. wenn nichts übergeben werden alle zurückgesetzt
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

//bildliche anzeige das spieler oder gegner am zug ist
function setTurn(entity, isTurn){
    var htmlElement = document.getElementById(entity.getHTMLID());
    if(isTurn){
        htmlElement.classList.add('onTurn');
    }else{
        htmlElement.classList.remove('onTurn');
    }
}

//berechnet die action der bots
function calculateAction(entity, communityCards, bet){
    entity.updateScoreAndComb(communityCards);
    var prob = ((50/entity.getScore())**0.9 / (entity.getMoney()/bet*0.1));
    if(bet == 0){
        prob = 0;
    }

    if(prob > Math.random()){
        return['fold', 0];
    }

    prob =  1-500/((entity.getScore())**0.9);
    if(bet > 0){
        prob /= bet**0.3;
    }

    if(prob > Math.random()){
        var betable = entity.getMoney()-(bet*2)
        var input = ((prob*2*betable**0.7))+bet*2;
        console.log(input, entity.getScore());
        return ['raise', Math.round(input)]
    }
    return ['call', 0];
}

//zeigt die Karten des spielers oder bots an, canSee wird genutzt um zu sagen ob karten gesehen werden können oder nicht
function drawPlayerCards(entity, canSee){
    if(canSee){
        var cards = entity.getHand();
    }else{
        var cards = ['B1', 'B1'];
    }
    if(cards[0] != null && cards[1] != null){
        htmlElement = document.getElementById(entity.getHTMLID()).getElementsByClassName('cards')[0];
        htmlElement.style.setProperty('--cardImg1', 'url(./cardsSVGs/' + cardToImgNameConv(cards[0]) + '.svg)');
        htmlElement.style.setProperty('--cardImg2', 'url(./cardsSVGs/' + cardToImgNameConv(cards[1]) + '.svg)');
    }else{
        htmlElement = document.getElementById(entity.getHTMLID()).getElementsByClassName('cards')[0];
        htmlElement.style.setProperty('--cardImg1', 'none');
        htmlElement.style.setProperty('--cardImg2', 'none');
    }
    htmlElement.style.setProperty('--cardBright1', '1');
    htmlElement.style.setProperty('--cardBright1', '1');
}

//hollt Aktion des Spielers/Bots
//Async nötig für die sleep funktion
async function getAction(resolve, entity, betTime, communityCards, bet){
    betTime *= 1000;
    var action = ['fold', 0];
    setTurn(entity, true);
    var timer = 0;
    if(entity.getName() == '-1'){
        action = calculateAction(entity, communityCards, bet);
        await sleep(1000);
    }else{
        while(input == '' && timer <= betTime){
            await sleep(10);
            timer+=10;
            document.getElementById(entity.getHTMLID())
            .style.setProperty('--countdown', (timer/betTime*100) + "%");
        }
        action = [input, parseInt(inputAmount)];
        toggleActionButton();
    }
    setTurn(entity, false);
    resolve(action);
}

//updated die anzeige der einsätze
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

//updated geld anzeigen
function updateMoney(entityList){
    for(var i = 0; i < entityList.length; i++){
        var htmlElement = document.getElementById(entityList[i].getHTMLID());
        htmlElement.getElementsByClassName('money')[0].innerHTML = entityList[i].getMoney();
    }
}

//updated Entity Elemente
function updateEntitys(entityList){
    updateMoney(entityList);
    updateBets(entityList);
}

//verarbeitung der Aktionen aus GetAction()
function processAction(entity, action, bet){
    switch(action[0]){
        case 'fold': case '':
            entity.fold();
            break;
        case 'call':
            if(entity.getBet() <= bet){
                entity.addMoney(entity.getBet());
            }
            entity.setBet(bet);
            break;
        case 'raise':
            entity.setBet(action[1] - entity.getBet());
            break;
    }
    return entity.getBet();
}

//updated HTML Element des Pots
function updatePot(pot){
    document.getElementById('potAmount').innerHTML = pot;
}

//updated/säubert den tisch (einsätze, entitys und den Pot)
function updateTable(entityList, pot){
    for(var j = 0; j < entityList.length; j++){
        entityList[j].setBet(0);
    }
    updateEntitys(entityList);
    updatePot(pot);
}

//löscht alle hand Karten vom bildschirm da Communitykarten im main Loop Gelöscht werden
function removeAllCards(entityList){
    for(var j = 0; j < entityList.length; j++){
        if(entityList[j].getState() == 'dead'){
            entityList[j].resetHand();
            continue;
        }
        htmlElement = document.getElementById(entityList[j].getHTMLID());
        htmlElement.style.setProperty('--cardImg1', '');
        htmlElement.style.setProperty('--cardImg2', '');
    }
}

//nimmt Karte vom deck und gibt/zeigt sie dem Entity an
function giveCards(deck, entityList, handIdx){
    for(var i = 0; i < entityList.length; i++){
        if(entityList[i].getState() == 'dead'){
            continue;
        }
        entityList[i].setHand(handIdx, deck.shift());
    }
}

//reseted die Community Karten ??mit ins removeAllCards setzen??
function resetComCards(){
    document.getElementById('communityCards').innerHTML = '';
}

//gibt den string für den Tisch zurück
function getWinnerText(entity){
    var winType = entity.getWinType()
    switch(winType){
        case 'fold':
            return 'Folds';
        case 'pair':
            return 'Pair';
        case 'twoPair':
            return 'Two Pairs';
        case 'three':
            return 'Threes';
        case 'straight':
            return 'Straight';
        case 'flush':
            return 'Flush';
        case 'fullHouse':
            return 'Full House';
        case 'quads':
            return 'Quads';
        case 'straightFlush':
            return 'Straight Flush';
        case 'royal':
            return 'ROYAL STRAIGHT FLUSH';
    }
}

//verdunkelt nicht zur gewinn Kombo genutzen karten
function focusWinCards(entity, communityCards){
    var winComb = entity.getWinComb();
    var hand = entity.getHand()
    htmlElement = document.getElementById(entity.getHTMLID()).getElementsByClassName('cards')[0];
    
    for(var i = 0; i < hand.length; i++){
        if(winComb.filter((card) => hand[i].includes(card)).length <= 0){
            htmlElement.style.setProperty('--cardBright'+(i+1), '0.5');
        }
    }
    for(var i = 0; i < communityCards.length; i++){
        if(winComb.filter((card) => communityCards[i].includes(card)).length <= 0){
            document.getElementById('com' + i).classList.add('unfocus');
        }
    }
}

//Setzt den Gewinner
function setWinner(entity, pot, communityCards){
    var htmlElement = document.getElementById(entity.getHTMLID());
    document.getElementById('tableText').innerHTML = getWinnerText(entity);
    focusWinCards(entity, communityCards);
    htmlElement.style.background = '#0f0';
    entity.addMoney(pot);
}

//zählt die spieler die nicht "dead" oder "fold" sind
function getInCount(entityList){
    return entityList.filter((entity) => entity.getState() == 'in' || entity.getState() == 'allIn').length;
}

//gibt lisste der Gewinner zurück
function getWinner(entityList){
    var winEntitys = new Array();
    var tempEntitys = new Array();
    var winScore = 0;
    for(var i = 0; i < entityList.length; i++){
        if(entityList[i].getState() == 'fold' || entityList[i].getState() == 'dead'){
            continue;
        }
        entityList[i].updateScoreAndComb(communityCards);
        entScore = entityList[i].getScore(); 
        if(entScore > winScore){
            tempEntitys = new Array(entityList[i]);
            winScore = entScore;
        }else if(entScore == winScore){
            tempEntitys.push(entityList[i]);
        }
    }
    winScore = 0;
    if(tempEntitys.length > 1){
        for(var i = 0; i < tempEntitys.length; i++){
            if(tempEntitys[i].getKicker()[0] > winScore){
                winEntitys = new Array(tempEntitys[i]);
            }else if(tempEntitys[i].getKicker()[0] == winScore){
                winEntitys.push(tempEntitys[i]);
            }
        }
    }else{
        winEntitys = tempEntitys;
    }
    return winEntitys;
}

//schalltet den raise Hebel ein
function toggleRaiseBar(on){
    var raiseBar = document.getElementById('raiseBar');
    var raiseRange = document.getElementById('raiseRange');
    raiseRange.min = globalBet*2;
    raiseRange.value = globalBet*2;
    raiseRange.max = globalMoney;
    raiseRange.step = (raiseRange.max-raiseRange.min)/50
    setRaiseRange();
    if(on){
        raiseBar.style.visibility = 'visible';
    }else{
        raiseBar.style.visibility = 'hidden';
    }
}

//updated den raise min-max
function setRaiseRange(){
    var raiseRange = document.getElementById('raiseRange');
    var raiseText = document.getElementById('raiseAmount');
    raiseText.innerHTML = raiseRange.value;
    raiseRange.style.setProperty('--amount', (raiseRange.value-raiseRange.min)/(raiseRange.max-raiseRange.min)*100 + "%");
}

//fügt eventListener für knöpfe hinzu
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
        setRaiseRange();
    })
    var raiseConfirm = document.getElementById('raiseConfirm');
    raiseConfirm.addEventListener('click', function(){
        inputAmount = raiseRange.value;
        input = 'raise'
        toggleRaiseBar(false);
    })
}

//"fold" Entitys werden "in"
//wenn "allIn" Entitys kein neues geld haben werden sie "dead"
function backIntoGame(entityList){
    for(var j = 0; j < entityList.length; j++){
        if(entityList[j].getState() == 'allIn'){
            if(entityList[j].getMoney() > 0){
                entityList[j].backIn();
                continue;
            }else{
                entityList[j].kill();
                continue;
            }
        }
        entityList[j].backIn();
    }
}

//setzt spiel zurück !!Nicht Entitys!!
function resetGame(entityList){
    backIntoGame(entityList);
    resetComCards();
    removeAllCards(entityList);
}


//Main funktion für den spiel ablauf
async function game(resolve, entityList, blind, blindIdx){
    //Variablen initializieren
    communityCards = new Array();
    var pot = 0;
    var turn = 0;
    var bet = blind;
    var lastBetIdx = blindIdx+1;
    var startIdx = blindIdx+1;
    var entitysIn = getInCount(entityList);
    globalBet = bet;
    entityList.map(function(entity){if(entity.isSelf()){globalMoney = entity.getMoney()}});

    //erstell start scenario des spiels (blinds, Hole-Cards...)
    updateTable(entityList, pot);
    sortByEntityIdx(entityList);
    setEntityBlinds(entityList, blindIdx);
    for(var i = 0; i < entityList.length; i++){
        if(entityList[i].getBlind() == 'BB'){
            entityList[i].setBet(blind);
            pot += blind;
            entityList[i].removeMoney(entityList[i].getBet());
        }else if(entityList[i].getBlind() == 'SB'){
            entityList[i].setBet(blind/2);
            pot += blind/2;
            entityList[i].removeMoney(entityList[i].getBet());
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
    //geht setz runden durch
    while(turn < 4){
        doTurn(turn, communityCards);
        //alle spieler durchgehen bis keiner mehr setzt
        for(var i = startIdx; i < entityList.length+lastBetIdx; i++){
            //wenn keine entitys mehr "in" sind wird die schleife unterbrochen
            entitysIn = getInCount(entityList);
            if(entitysIn < 2){
                entityList[mudolo(i, entityList.length)].otherFolded();
                break;
            }

            updateEntitys(entityList);

            var entity = entityList[mudolo(i, entityList.length)];
            if(entity.isSelf()){
                globalMoney = entity.getMoney();
            }

            //überspringt spieler die nicht "in" sind
            var state = entity.getState();
            if(state != 'in'){
                continue;
            }

            //fragt Aktion des Spielers/Bots ab
            var currAction = new Promise(resolve => getAction(resolve, entity, 10, communityCards, bet));
            var action = await currAction.then(function(out){ return out});
            //AktionsListe = [AktionsTyp, SetzMenge] setz menge nur für raise nötig
            
            if(action[0] == 'raise'){
                lastBetIdx = i;
                bet = action[1];
                globalBet = bet;
            }

            //fügt pot die setzmänge hinzu und entfernt diese vom Entity
            pot += processAction(entity, action, bet);
            entity.removeMoney(entity.getBet());
        }
        //räumt setz runde auf
        entitysIn = getInCount(entityList)
        updateTable(entityList, pot);
        bet = 0;
        startIdx = 0;
        lastBetIdx = 0;
        turn++;
        if(entitysIn < 2){
            break;
        }
    }
    //Kontrolliert gewinner und wenn alle "fold" sind wird letzer "in" gewinner
    winEntitys = getWinner(entityList);
    if(entitysIn < 2){
        winEntitys[0].otherFolded();
    }

    //wenn winner liste > 1 dann wird der Pot gesplitted
    if(winEntitys.length > 1){
        pot /= winEntitys.length;
        for(var i = 0; i < winEntitys.length; i++){
            setWinner(entityList[i], pot, communityCards)
        }
    }else{
        setWinner(winEntitys[0], pot, communityCards);
    }

    updateTable(entityList, pot);
    resolve();
}

//wenn seite fertig geladen
addEventListener('DOMContentLoaded', function(){
    //erstellt Standart variablen für spiel
    const params = new URLSearchParams(window.location.search);
    var enemies = createBots(parseInt(params.get('enemCount')));
    var blind = 50;
    var blindIdx = 1;
    var self = new player(1000, 5, 'Paul', null, true);
    var entityList = enemies.concat(self);

    drawEntitys(enemies, self);
    addListeners();

    document.getElementById('start').addEventListener('click',async function(){
        this.parentElement.removeChild(this);
        while(true){
            //erstellt Deck
            deck = getNewDeck();
            //started eine Spiel runde
            var currGame = new Promise(resolve => game(resolve, entityList, blind, blindIdx));
            await currGame;
            //zählt blinds eins hoch
            blindIdx = mudolo(countSkippedBlinds(entityList, blindIdx), entityList.length)+1;
            await sleep(5000);
            //setzt Spiel zurück
            resetGame(entityList);
        }
    })
})