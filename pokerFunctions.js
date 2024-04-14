
const RANKS = Array('2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A');
//H: HEARTS, D: DIAMONDS, S: SPADES, C: CLUBS
const SUITS = Array('H', 'D', 'S', 'C');

//gibt den index des Ranges aus der Karte zurück  zb.: H5 Index wäre 4 da 5 auf dem 4.Index Steht
function getRanksIndex(card){
    return RANKS.indexOf(card.substring(1));
}

//gibt den index der farbe aus der Karte zurück  zb.: H2 Index wäre 0 da H auf dem 0.Index Steht
function getSuitsIndex(card){
    return SUITS.indexOf(card.charAt(0));
}

//sortiert das Karten Array zb.: ['H2', 'CQ'] nach index des constanten Arrays RANKS
function sortCardsHighToLow(cardsArray){
    for(i = 0; i < cardsArray.length; i++){
        for(j = 0; j < cardsArray.length-1; j++){
            if(getRanksIndex(cardsArray[j]) < getRanksIndex(cardsArray[j+1])){
                temp = cardsArray[j];
                cardsArray[j] = cardsArray[j+1];
                cardsArray[j+1] = temp;
            }
        }
    }
}

//zählte wie oft ein Rang im Karten Array vor kommt und gibt ein Array mit häufigkeiten pro index zurück
function countRanks(cardsArray){
    listOfRankCounts = new Array(RANKS.length).fill(0);
    for(i = 0; i < cardsArray.length; i++){
        listOfRankCounts[getRanksIndex(cardsArray[i])]++
    }
    return listOfRankCounts;
}

//zählte wie oft eine farbe im Karten Array vor kommt und gibt ein Array mit häufigkeiten pro index zurück
function countSuits(cardsArray){
    listOfSuitsCounts = new Array(SUITS.length).fill(0);
    for(i = 0; i < cardsArray.length; i++){
        listOfSuitsCounts[getSuitsIndex(cardsArray[i])]++;
    }
    return listOfSuitsCounts;
}

//Gibt den Score (Summe von 5 höchsten karten des Flushes) zurück 
function getScoreOfHighestFiveCardsOfFlush(cardsArray, targetSuit){
    score = 0;
    if(cardsArray.length > 4){
        sortCardsHighToLow(cardsArray);
        cardsArray.filter((card) => getSuitsIndex(card) == SUITS.indexOf(targetSuit)).slice(0, 5)
            .forEach((card) => score += card.search(targetSuit) == -1 ? 0 : (getRanksIndex(card)+1));
    }
    return score;
}

//Gibt score und liste der 2 höchsten Paare zurueck

//TODO Dokumentation

function getPairAndTwoPairScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    score = 0;
    pairNumbers = new Array();
    rankCounts = countRanks(cardsArray).reverse();
    for(i = 0; i < 2; i++){
        pairRankIdx = rankCounts.length-1 - rankCounts.indexOf(2); //Nach 2 von hinten suchen um den hohen rang zu erhalten
        if (pairRankIdx != -1){
            pairNumbers.push(RANKS[pairRankIdx]);
            if (i == 1){
                score += (pairRankIdx+1) * 100 + 2000;
            }else{
                score += (pairRankIdx+1) * 100;
            }
        }
        rankCounts[rankCounts.length - 1 - pairRankIdx] = 0;
    }
    return [score, pairNumbers];
}

//Gibt score und liste des höchsten Drillings zurueck
function getPairScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    score = 0;
    threeNumbers = new Array();
    rankCounts = countRanks(cardsArray);
    pairRankIdx = rankCounts.length-1 - rankCounts.reverse().indexOf(2);    //Nach 3 von hinten suchen um den hohen rang zu erhalten
    if (pairRankIdx != -1){
        score = (pairRankIdx+1) * 100;
        threeNumbers.push(RANKS[pairRankIdx]);
    }
    return [score, threeNumbers];
}

//Gibt score und liste des höchsten Drillings zurueck
function getThreeScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    score = 0;
    threeNumbers = new Array();
    rankCounts = countRanks(cardsArray);
    pairRankIdx = rankCounts.length-1 - rankCounts.reverse().indexOf(3);    //Nach 3 von hinten suchen um den hohen rang zu erhalten
    if (pairRankIdx != -1){
        score = (pairRankIdx+1) * 100 + 5000;
        threeNumbers.push(RANKS[pairRankIdx]);
    }
    return [score, threeNumbers];
}

//Gibt score und liste des Vierlings zurueck
function getQuadsScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    score = 0;
    quadNumbers = new Array();
    rankCounts = countRanks(cardsArray);
    pairRankIdx = rankCounts.indexOf(4);    //egal ob von hinten oder vorne. Man kann nur ein Vierling haben
    if (pairRankIdx != -1){
        score = (pairRankIdx+1) * 100 + 116000;
        quadNumbers.push(RANKS[pairRankIdx]);
    }
    return [score, quadNumbers];
}

//Gubt score und Farbe des Flushes zurück
function getFlushScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    score = 0;
    flushCards = new Array();
    suitsCounts = countSuits(cardsArray);
    flashSuitsIdx = suitsCounts.findIndex((suitCount) => suitCount > 4);
    if(flashSuitsIdx != -1){
        flushCards.push(SUITS[flashSuitsIdx]);
        score += getScoreOfHighestFiveCardsOfFlush(cardsArray, SUITS[flashSuitsIdx]) * 100 + 12500;
    }
    return [score, flushCards];
}

//Gibt Score und Karten des Full Houses zurück
function getFullHouseScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    [score1, arr1] = getThreeScore(cardsArray);
    [score2, arr2] = getPairScore(cardsArray);
    if (score1 > 0 && score2 > 0){
        arr1.push(arr2[0]);
        return [score1*15 + score2 + 18000, arr1];
    }
    return [0, []]
}

//gibt score der Straße zurück

//TODO Tiefere Erklärung
function getStraightScore(cardsArray){
    sortCardsHighToLow(cardsArray);
    straight = new Array();
    score = 0;
    for (i = RANKS.length-1; i > 0; i--){
        score = 0
        straight = [];
        if (cardsArray.findIndex((card) => card.indexOf(RANKS[i])) != -1 && i > 2){
            straight.push(RANKS[i]);
            score += i+1;
            for (j = i-1; j > i-5; j--){
                if(!cardsArray.findIndex((card) => card.indexOf(RANKS[j]) != -1) && j!=-1){
                    break;
                }
                score += j+1;
                straight.push(RANKS[j]);
            }
            if(straight.length > 4){
                break;
            }
        }
    }
    if (score > 0){
        return [(score*100) + 7000, straight];
    }
    return [0, []];
}

//Gibt den Score für einen Straight Flush zurück
function getStraightFlushScore(cardsArray){
    cardArrOut = new Array();
    [score, straightArr] = getStraightScore(cardsArray);
    if( score > 0){
        straightArr2 = new Array();
        for(i = 0; i < straightArr.length; i++){ //erstellt eine neue liste der straßen ausgabe die die farben der karten enhält
            straightArr2.push(...cardsArray.filter((card) => card.indexOf(straightArr[i]) != -1));
        }
        [score2, flushArr] = getFlushScore(straightArr2);
        if( score2 > 0){
            for(i = 0; i < straightArr.length; i++){
                cardArrOut.push(...cardsArray.filter((card) => card.indexOf(straightArr[i]) != -1 
                    && card.indexOf(flushArr[0]) != -1));
            }
            return [(score*20+score2+118000), cardArrOut];
        }
    }
    return [0, []];
}

const cardArray = new Array('S10', 'S9', 'SK', 'SQ', 'SJ', 'H10', 'S2');

// console.log(getScoreOfHighestFiveCardsOfFlush(cardArray, 'S'));
[test, test2] = getStraightFlushScore(cardArray);
console.log(test + "  " + test2);
