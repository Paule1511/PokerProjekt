const DEFAULT_IMG = "default_player.svg";
turn = 0;
blindIdx = 0;
pot = 0;

class player{
    #hand = Array(null, null);
    #money = 0;
    #imgUrl = DEFAULT_IMG;
    #name = "-1";
    #idx = 0;
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
        if(i == 4){
            drawPlayer(player);
            drawEnemy(enemies[i], i, enemies.length);
            continue;
        }
        drawEnemy(enemies[i], i, enemies.length);
    }
    
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
    
    enemHtml = document.getElementById('enemy' + i);
    if(i >= 4){
        enemHtml.style.offsetDistance = 100/10*(i+1)+18.5 + "%";
    }else{
        enemHtml.style.offsetDistance = 100/10*i+18.5 + "%";
    }
    
}

function drawPlayer(player){
    document.getElementById('players').innerHTML += "<div id='player' class='player entity'>" + 
        "<img src='"+ player.getImgUrl() + "'>\n" + 
        "<span>" + player.getName() + "</span>\n" +
        "<span class='money'>" + player.getMoney() + "</span>"+
        "<div class='cards'></div>" +
        "<div class='playButton'></div>" +
        "</div>";
    enemHtml = document.getElementById('player');
    enemHtml.style.offsetDistance = 100/10*4+18.5 + "%";
}

function createBots(enemCount){
    enemies = Array();
    if(enemCount !== null){
        for(i = 0; i < enemCount; i++){
            enemies.push(new player(1000, i));
        }
    }else{
        return null;
    }
    return enemies;
}

addEventListener('DOMContentLoaded', function(){
    console.log("start on load")
    const params = new URLSearchParams(window.location.search);
    enemies = createBots(parseInt(params.get('enemCount')));
    self = new player(1000, enemies.length, 'Paul'); 
    if(enemies == null){
        errorFunction();
        return;
    }
    buildPage(enemies, self);
})