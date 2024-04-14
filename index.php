<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
</head>
<body>
    <div id='header'>
        <div id='balance'>d</div>
        <div><h1> POKER NAME PLACHOLDER</h1></div>
        <div>Login</div>
    </div>
    <div id="description" class="main-text">
        <p>
            Dies ist mein Poker Projekt fuer das Javascript modul in der GPB.<br />
            In diesem Poker spiel wird kein echtes geld/vermögen verwettet oder genutzt.<br />
            <br /> DISCLAIMER <br />
            Glücksspiel kann süchtig machen. ich übernehme keine haftung für sach und/oder personen Schäden.<br />
            Ich übernehme auch keine haftung für Echsenmenschen, Marsiana oder JavaScript Fans. <br /><br />
            Bei neben wirkungen Fragen sie ihren Artzt oder Apotheka<br /> 
        </p>
    </div>
    <div id="know-how">
        <p class="main-text"> <br><br><br>
            Die Regeln sind Simpel. GEWINNEN!!. <br />
            Nein im ernst. <br />
        </p>
        <div class="main-text"><button id="regelButton" onclick="openRules()"> REGELN</button></div><br />
        <p class="main-text">
            Wenn du bereit Bist dann wähle aus wie viele gegner du willst und Viel Spass.
        </p>
    </div>
    <div id="toPlay">
        <input id="enemCount" type="number" value="0">
        <button id="play" onclick="play()">Spielen</button>
        <div id="error-text" class="error"></div>
    </div>
</body>
</html>