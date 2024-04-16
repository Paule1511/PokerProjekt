
function openRules(){
    window.open('https://bulletscards.de/pages/poker-regeln', '_BLANK')
}

function play(){
    enemCount = document.getElementById('enemCount').value;
    if(enemCount < 1 || enemCount > 8){
        document.getElementById('error-text').innerHTML = "Bitte geben sie die gegner menge im bereich (1-8) an.";
        return;
    }else{
        document.getElementById('error-text').innerHTML = "";
    }
    window.location = "./game.html?enemCount=" + enemCount;
}