const DEFAULT_IMG = "default_player.png";

console.log(location.hostname == '')

class player{
    #hand = Array(null, null);
    #money = 0;
    #imgUrl = DEFAULT_IMG;
    #name = "-1";
    constructor(money, name = null, img = null){
        if(name !== null){
            this.#name = name;
        }
        if(img !== null){
            this.#imgUrl = img;
        }
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

}

function errorFunction(){
    console.log("Couldnt get Enemy Count");
    document.body.innerHTML = "Konnte Gegner Menge nicht erhalten";
}

function buildPage(enemies, player){
    for(i = 0; i < enemies.length; i++){
        drawEnemy(enemies[i], i, enemies.length);
    }
}

function drawEnemy(enemy, i){
    if(enemy.getName() == "-1"){
        console.log("draw")
        enemName = "Bot#" + (i + 1);
    }else{
        enemName = enemy.getName();
    }
    document.getElementById('players').innerHTML += "<div id='enemy" + i + "' class='enemy'></div>";
    document.getElementById('enemy'+i).innerHTML = 
        "<img src='"+ enemy.getImgUrl() + "'>\n" + 
        "<span>" + enemName + "</span>\n" +
        "<span class='money'>" + enemy.getMoney() + "</span>";
}

function createBots(enemCount){
    enemies = Array();
    if(enemCount !== null){
        console.log("create enem")
        for(i = 0; i < enemCount; i++){
            enemies.push(new player(1000));
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
    self = new player(1000); 
    if(enemies == null){
        errorFunction();
        return;
    }
    buildPage(enemies, self);
})