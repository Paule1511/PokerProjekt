
const RANKS = Array('2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A');
//H: HEARTS, D: DIAMONDS, S: SPADES, C: CLUBS
const SUITS = Array('H', 'D', 'S', 'C');


//Max Funktionen zur erhaltung der Max werte jedes hand ranges
function getFlushMax(){
    var [score, comb] = getFlushScore(['HA', 'HK', 'HQ', 'HJ', 'HT']);
    return score;
}

//mischt Array durch !!!NICHT EIGENER Algorithmus. aus internet entnommen und geändert
function shuffle(deck){
    for(var i = 0; i < deck.length; i++){
        var j = Math.floor(Math.random() * (i+1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getHandMin(){
    var [score, comb] = getHandScore(['C2', 'H3']);
    return score;
}

function getHandMax(){
   var [score, comb] = getHandScore(['HA', 'CK']);
   return score;
}

//erstellt neues Deck
function getNewDeck(){
    var deck = new Array();
    for(var i = 0; i < RANKS.length; i++){
        for(var j = 0; j < SUITS.length; j++){
            var card = SUITS[j] + RANKS[i];
            deck.push(card);
        }
    }
    shuffle(deck);
    return deck;
}

function getPairMax(){
    var [score, comb] = getPairScore(['HA', 'SA']);
    return score;
}

function getTwoPairMax(){
    var [score, comb] = getTwoPairScore(['HA', 'SA', 'CK', 'DK']);
    return score;
}

function getFullHouseMax(){
    var [score, comb] = getFullHouseScore(['HA', 'SA', 'CA', 'SK', 'CK']);
    return score;
}

function getStraightMax(){
    var [score, comb] = getStraightScore(['HA', 'HK', 'HQ', 'HJ', 'HT']);
    return score;
}

function getThreeMax(){
    var [score, comb] = getThreeScore(['HA', 'SA', 'CA']);
    return score;
}

function getQuadsMax(){
    var [score, comb] = getQuadsScore(['HA', 'CA', 'SA', 'DA']);
    return score;
}

function getRoyalStraightFlushMax(){
    var [score, comb] = getStraightFlushScore(['HA', 'HK', 'HQ', 'HJ', 'HT']);
    return score;
}

function getStraightFlushMax(){
    var [score, comb] = getStraightFlushScore(['HK', 'HQ', 'HJ', 'HT', 'H9']);
    return score;
}

//Min Funktionen zur erhaltung des minimal möglichsten Scores

function getFlushMin(){
    var [score, comb] = getFlushScore(['HA', 'H2', 'H3', 'H4', 'H5']);
    return score;
}

function getPairMin(){
    var [score, comb] = getPairScore(['H2', 'S2']);
    return score;
}

function getTwoPairMin(){
    var [score, comb] = getTwoPairScore(['H2', 'S2', 'C3', 'D3']);
    return score;
}

function getFullHouseMin(){
    var [score, comb] = getFullHouseScore(['H2', 'S2', 'C2', 'S3', 'C3']);
    return score;
}

function getStraightMin(){
    var [score, comb] = getStraightScore(['HA', 'H2', 'H3', 'H4', 'H5']);
    return score;
}

function getThreeMin(){
    var [score, comb] = getThreeScore(['H2', 'S2', 'C2']);
    return score;
}

function getQuadsMin(){
    var [score, comb] = getQuadsScore(['H2', 'C2', 'S2', 'D2']);
    return score;
}

function getStraightFlushMin(){
    var [score, comb] = getStraightFlushScore(['HA', 'H2', 'H3', 'H4', 'H5']);
    return score;
}

//gibt den index des Ranges aus der Karte zurück  zb.: H5 Index wäre 4 da 5 auf dem 4.Index Steht
function getRanksIndex(card){
    return RANKS.indexOf(card.substring(1));
}

//gibt den index der farbe aus der Karte zurück  zb.: H2 Index wäre 0 da H auf dem 0.Index Steht
function getSuitsIndex(card){
    return SUITS.indexOf(card.charAt(0));
}


//zählte wie oft ein Rang im Karten Array vor kommt und gibt ein Array mit häufigkeiten pro index zurück
function countRanks(cardsArray){
    var listOfRankCounts = new Array(RANKS.length).fill(0);
    for(var i = 0; i < cardsArray.length; i++){
        listOfRankCounts[getRanksIndex(cardsArray[i])]++
    }
    return listOfRankCounts;
}

//zählte wie oft eine farbe im Karten Array vor kommt und gibt ein Array mit häufigkeiten pro index zurück
function countSuits(cardsArray){
    var listOfSuitsCounts = new Array(SUITS.length).fill(0);
    for(var i = 0; i < cardsArray.length; i++){
        listOfSuitsCounts[getSuitsIndex(cardsArray[i])]++;
    }
    return listOfSuitsCounts;
}

//Gibt den Score (Summe von 5 höchsten karten des Flushes) zurück 
function getScoreOfHighestFiveCardsOfFlush(cardsArray, targetSuit){
    var score = 0;
    if(cardsArray.length > 4){
        sortCardsHighToLow(cardsArray);
        cardsArray.filter((card) => getSuitsIndex(card) == SUITS.indexOf(targetSuit)).slice(0, 5)
            .forEach((card) => score += card.search(targetSuit) == -1 ? 0 : (getRanksIndex(card)+1));
    }
    return score;
}
    
//sortiert das Karten Array zb.: ['H2', 'CQ'] nach index des constanten Arrays RANKS
function sortCardsHighToLow(cardsArray){
    for(var i = 0; i < cardsArray.length; i++){
        for(var j = 0; j < cardsArray.length-1; j++){
            if(getRanksIndex(cardsArray[j]) < getRanksIndex(cardsArray[j+1])){
                var temp = cardsArray[j];
                cardsArray[j] = cardsArray[j+1];
                cardsArray[j+1] = temp;
            }
        }
    }
}



function getHandScore(hand){
    sortCardsHighToLow(hand);
    return [(getRanksIndex(hand[0])*15) + getRanksIndex(hand[1]), hand];
}

    //Gibt score und liste der 2 höchsten Paare zurueck
    
    //TODO Dokumentation

function getTwoPairScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var score = 0;
    var pairNumbers = new Array();
    var rankCounts = countRanks(cardsArray).reverse();
    for(var i = 0; i < 2; i++){
        var pairRankIdx = rankCounts.indexOf(2); //Nach 2 von hinten suchen um den hohen rang zu erhalten
        if (pairRankIdx != -1){
            pairRankIdx = rankCounts.length - 1 - pairRankIdx;
            pairNumbers.push(RANKS[pairRankIdx]);
            if (i == 1){
                score += (pairRankIdx+1) * 100 + getPairMax();
            }else{
                score += (pairRankIdx+1) * 100;
            }
        }
        rankCounts[rankCounts.length - 1 -pairRankIdx] = 0;
    }
    if(pairNumbers.length < 2){
        return[0, []];
    }
    return [score, pairNumbers];
}

//Gibt score und liste des höchsten Drillings zurueck
function getPairScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var score = 0;
    var pairNumbers = new Array();
    var rankCounts = countRanks(cardsArray);
    var pairRankIdx = rankCounts.reverse().indexOf(2);    //Nach 3 von hinten suchen um den hohen rang zu erhalten
    if (pairRankIdx != -1){
        pairRankIdx = rankCounts.length - 1 - pairRankIdx;
        score = (pairRankIdx+1) * 100;
        pairNumbers.push(RANKS[pairRankIdx]);
    }
    return [score, pairNumbers];
}

//Gibt score und liste des höchsten Drillings zurueck
function getThreeScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var score = 0;
    var threeNumbers = new Array();
    var rankCounts = countRanks(cardsArray);
    var pairRankIdx = rankCounts.reverse().indexOf(3);    //Nach 3 von hinten suchen um den hohen rang zu erhalten
    if (pairRankIdx != -1){
        pairRankIdx = rankCounts.length - 1 - pairRankIdx;
        score = (pairRankIdx+1) * 100 + getTwoPairMax();
        threeNumbers.push(RANKS[pairRankIdx]);
    }
    return [score, threeNumbers];
}

//Gibt score und liste des Vierlings zurueck
function getQuadsScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var score = 0;
    var quadNumbers = new Array();
    var rankCounts = countRanks(cardsArray);
    var pairRankIdx = rankCounts.indexOf(4);    //egal ob von hinten oder vorne. Man kann nur ein Vierling haben
    if (pairRankIdx != -1){
        score = (pairRankIdx+1) * 100 + getFullHouseMax();
        quadNumbers.push(RANKS[pairRankIdx]);
    }
    return [score, quadNumbers];
}

//Gubt score und Farbe des Flushes zurück
function getFlushScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var score = 0;
    var flushCards = new Array();
    var suitsCounts = countSuits(cardsArray);
    var flashSuitsIdx = suitsCounts.findIndex((suitCount) => suitCount > 4);
    if(flashSuitsIdx != -1){
        flushCards.push(SUITS[flashSuitsIdx]);
        score += getScoreOfHighestFiveCardsOfFlush(cardsArray, SUITS[flashSuitsIdx]) * 100 + 12500;
    }
    return [score, flushCards];
}

//Gibt Score und Karten des Full Houses zurück
function getFullHouseScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var [score1, arr1] = getThreeScore(cardsArray);
    var [score2, arr2] = getPairScore(cardsArray);
    if (score1 > 0 && score2 > 0){
        arr1.push(arr2[0]);
        return [(score1*15 + score2 + getFlushMax()), arr1];
    }
    return [0, []]
}

//gibt score der Straße zurück

//TODO Tiefere Erklärung
function getStraightScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    var straight = new Array();
    var score = 0;
    for (var i = RANKS.length-1; i > -1; i--){
        score = 0
        var straight = [];
        if (cardsArray.findIndex((card) => card.indexOf(RANKS[i]) != -1) != -1 && i > 2){
            straight.push(RANKS[i]);
            score += i+1;
            for (var j = i-1; j > i-5; j--){
                if(j == -1){
                    var targetRank = RANKS[RANKS.length-1];
                }else{  
                    var targetRank = RANKS[j];
                }
                if(!(cardsArray.findIndex((card) => card.indexOf(targetRank) != -1) != -1)){
                    break;
                }
                score += j+1;
                straight.push(targetRank);
            }
            if(straight.length > 4){
                break;
            }
        }
    }
    if (score > 0){
        return [((score*100) + getThreeMax()), straight];
    }
    return [0, []];
}

//Gibt den Score für einen Straight Flush zurück
function getStraightFlushScore(cardsArray){
    var cardArrOut = new Array();
    var [score, straightArr] = getStraightScore(cardsArray);
    if( score > 0){
        var straightArr2 = new Array();
        for(var i = 0; i < straightArr.length; i++){ //erstellt eine neue liste der straßen ausgabe die die farben der karten enhält
            straightArr2.push(...cardsArray.filter((card) => card.indexOf(straightArr[i]) != -1));
        }
        var [score2, flushArr] = getFlushScore(straightArr2);
        if( score2 > 0){
            for(var i = 0; i < straightArr.length; i++){
                cardArrOut.push(...cardsArray.filter((card) => card.indexOf(straightArr[i]) != -1 
                    && card.indexOf(flushArr[0]) != -1));
            }
            return [(score*20+score2+getQuadsMax()), cardArrOut];
        }
    }
    return [0, []];
}

function testMinMax(){
    max = getHandMax();
    min = getHandMin();
    console.log("Hand Range: ", min, " - ", max);
    max = getPairMax();
    min = getPairMin();
    console.log("Pair Range: ", min , " - " , max);
    max = getTwoPairMax();
    min = getTwoPairMin();
    console.log("Two Pair Range: ", min , " - " , max);
    max = getThreeMax();
    min = getThreeMin();
    console.log("Three Range: ", min , " - " , max);
    max = getStraightMax()
    min = getStraightMin();
    console.log("Straigt Range: ", min , " - " , max);
    max = getFlushMax()
    min = getFlushMin();
    console.log("Flush Range: ", min , " - " , max);
    max = getFullHouseMax()
    min = getFullHouseMin();
    console.log("Full House Range: ", min , " - " , max);
    max = getQuadsMax()
    min = getQuadsMin();
    console.log("Quads Range: ", min , " - " , max);
    max = getStraightFlushMax();
    min = getStraightFlushMin();
    console.log("Straig Flush Range: ", min , " - " , max);
    score = getRoyalStraightFlushMax();
    console.log("Royal Score: ", score)
}

const comb = ['HA', 'S4', 'C3', 'D2', 'H9', 'HK', 'C5']

// console.log(getStraightScore(comb));