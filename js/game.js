// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
// <body><canvas id = "micanvas" width = "512" height = "512">asfasdas</canvas>

// Cargamos todas las imagenes de la misma forma -- ready cuando tengamos un load sobre ese objeto
// Background image
var bgReady = false; // las imagenes no estan descargadas
var bgImage = new Image(); // cargamos
bgImage.onload = function () { // cuando hay un load sobre imagen llama a la funcion. / /backgroundReady esta en true
	bgReady = true;
};
// cuando tenemos las imagenes en remoto -- va a tardar mas en obtenerse
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone images
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster images
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";
// heart image
var heartReady = false;
var heartImage = new Image();
heartImage.onload = function () {
    heartReady = true;
};
heartImage.src = "images/heart.png";
// orange image
var orangeReady = false;
var orangeImage = new Image();
orangeImage.onload = function () {
    orangeReady = true;
};
orangeImage.src = "images/naranja.png";

// Game objects -- guardamos los valores del juego
var nivel0 = 0;
// hero
var hero = {
	speed: 256 // movement in pixels per second
};
var heroLifes = 3;

// princess
var princess = {};
var princessesCaught = 0;
var princessForNextLevel = 5;

// Stone
var arrayStone = [];
var numStone = 1;
// monster
var monsterspeed	= 30;
var monster={};
var monster={
		speed : monsterspeed
};

var arrayMonster = [];
var numMonster = 0;
//naranja
var naranja = {};
//storage
var princessesCaught = localStorage.getItem('princessesCaught');

function getprincessesForNext(){
	if(localStorage.getItem('princessForNextLevel')!=undefined){
		return localStorage.getItem('princessForNextLevel');
	}else{
		return princessForNextLevel	;
	}
}
function getnivel(){
		if(localStorage.getItem('nivel')!=0){
			return localStorage.getItem('nivel');
		}else{
			return nivel0;
		}
}

function getheroLifes(){
	if(localStorage.getItem('heroLifes')!=null){
		return localStorage.getItem('heroLifes');
	}else{
		return heroLifes;
	}
}

function getstone(){
	if(localStorage.getItem('numStone')!=null){
		return localStorage.getItem('numStone');
	}else{
		return numStone;
	}
}

function getmonsters(){
	if(localStorage.getItem('numMonster')!=null){
		return localStorage.getItem('numMonster');
	}else{
		return numMonster;
	}
}
/*
function getarrayMonster(){
	if(localStorage.getItem('arrayMonster')!=0){
		return localStorage.getItem('arrayMonster');
	}else{
		return arrayMonster;
	}
}*/
var nivel = getnivel();
var heroLifes = getheroLifes();
var numStone = getstone();
//var arrayMonster = getarrayStone();
var numMonster = getmonsters();
//var arrayMonster = getarrayMonster();
var princessForNextLevel = getprincessesForNext();

// Handle keyboard controls -- Datos asociados

var keysDown = {}; // diccionario de teclas presionandose

addEventListener("keydown", function (e) { // pulsas la tecla del teclado. Realiza un evento(Funcion(evento))
	keysDown[e.keyCode] = true; // saber que tecla ha pulsado
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	//localStorage.clear(); //-- RESET EN LAS PRUEBAS
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	// Throw the princess somewhere on the screen randomly
	princess.x = 48 + (Math.random() * (canvas.width - 96));
	princess.y = 48 + (Math.random() * (canvas.height - 96));

	// para que la princesa no empiece en la misma posicion que el monstruo
	if (hero.x <= (princess.x + 16)
	 		&& princess.x <= (hero.x + 16)
			&& hero.y <= (princess.y + 16)
			&& princess.y <= (hero.y + 32))
	{
			princess.x = 48 + (Math.random() * (canvas.width - 96));
			princess.y = 48 + (Math.random() * (canvas.height - 96));
	}

	// monster
	arrayMonster = [];
	var introMonster = 0; // añadir
	while(introMonster < numMonster){
		monster = {speed : 35};
		monster.x = 48 + (Math.random() * (canvas.width - 96));
		monster.y = 48 + (Math.random() * (canvas.height - 96));
		introMonster++;
		// para que no se toquen
		if (hero.x <= (monster.x + 16)
				&& monster.x <= (hero.x + 16)
				&& hero.y <= (monster.y + 16)
				&& monster.y <= (hero.y + 32)
				||monster.x <= (princess.x + 16)
				&& princess.x <= (monster.x + 16)
				&& monster.y <= (princess.y + 16)
				&& princess.y <= (monster.y + 32))
		{
			introMonster--;
		}else{
			arrayMonster.push(monster);
		//	localStorage.setItem('arrayMonster',arrayMonster);

		}
	}
	// Stone
	arrayStone = [];
	var introStone = 0;
  while(introStone < numStone){
		var stone={};
		stone.x = 48 + (Math.random() * (canvas.width - 96));
		stone.y = 48 + (Math.random() * (canvas.height - 96));
		introStone++;
		if (hero.x <= (stone.x + 16)
				&& stone.x <= (hero.x + 16)
				&& hero.y <= (stone.y + 16)
				&& stone.y <= (hero.y + 32)
				||stone.x <= (princess.x + 16)
				&& princess.x <= (stone.x + 16)
				&& stone.y <= (princess.y + 16)
				&& princess.y <= (stone.y + 32)
				||monster.x <= (stone.x + 16)
				&& stone.x <= (monster.x + 16)
				&& monster.y <= (stone.y + 16)
				&& stone.y <= (monster.y + 32))

		{
			introStone--;
		}else{
			arrayStone.push(stone);
		//	localStorage.setItem('arrayStone',arrayStone)

		}
	}

};

// mover monstruo
var monstermove = function(modifier){
	for (var i = 0; i < arrayMonster.length;i++){
		if(touchStone(arrayMonster[i])){
				arrayMonster[i].x = arrayMonster[i].x - 3;
				arrayMonster[i].y = arrayMonster[i].y - 3;
		}else{//Movimientos del monstruo
			x = arrayMonster[i].x - hero.x;
			y = arrayMonster[i].y - hero.y;
			if(x > 0){
				arrayMonster[i].x -= arrayMonster[i].speed * modifier;
			}else if(x < 0){
				arrayMonster[i].x += arrayMonster[i].speed * modifier;
			}
			if(y > 0){
				arrayMonster[i].y -= arrayMonster[i].speed * modifier;
			}else if(y < 0){
				arrayMonster[i].y += arrayMonster[i].speed * modifier;
			}
		}
	}

};
// coger naranja
var touchNaranja = function(hero){
	if(hero.x <= (naranja.x + 16 )
		&& naranja.x <= (hero.x + 16)
		&& hero.y <= (naranja.y + 16)
 		&& naranja.y <= (hero.y + 16))
		{
			 return true; // se tocan
		}
	return false; // no se tocan
};
// tocar monstruo
var touchMonster = function(hero){
	for(var i = 0; i < arrayMonster.length ; i++){
		if(arrayMonster[i].x <= (hero.x + 16 )
			 && hero.x <= (arrayMonster[i].x + 16)
			 && arrayMonster[i].y <= (hero.y + 16)
 			 && hero.y <= (arrayMonster[i].y + 16))
			 {
				 return true; // se tocan
			 }
	}
	return false; // no se tocan
};
// tocar una piedra
var touchStone = function(Aux){
	for(var i = 0; i < arrayStone.length ; i++){
		if(arrayStone[i].x <= (Aux.x + 16 )
			 && Aux.x <= (arrayStone[i].x + 16)
			 && arrayStone[i].y <= (Aux.y + 16)
 			 && Aux.y <= (arrayStone[i].y + 16)){
				 return true; // se tocan
			 }
	}
	return false; // no se tocan
};

// Update game objects
var update = function (modifier) {
	var Aux = {};
	if (38 in keysDown) { // Player holding up // el 38 en mi diccionario -- el 38 Arriba
		if(touchStone(hero)){
			hero.y = hero.y + 16;
			hero.x = hero.x;
		}else{
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(touchStone(hero)){
			hero.y = hero.y - 16;
			hero.x = hero.x;
		}else{
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(touchStone(hero)){
			hero.x = hero.x + 16;
			hero.y = hero.y;
		}else{
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(touchStone(hero)){
			hero.x = hero.x  - 16;
			hero.y = hero.y;
		}else{
			hero.x += hero.speed * modifier;
		}
	}
	// para que no se salga de los margenes
	if (hero.y <= 32){
		hero.y = 32;
	}
	if(hero.x <= 32){
		hero.x = 32;
	}
	if (hero.y >= 480-64){
		hero.y = 480-64;
	}
	if(hero.x >= 512-64){
		hero.x = 512-64;
	}

	// Are they touching?
	if (hero.x <= (princess.x + 16)
			&& princess.x <= (hero.x + 16)
			&& hero.y <= (princess.y + 16)
			&& princess.y <= (hero.y + 32))
		{
				++princessesCaught;
				localStorage.setItem('princessesCaught',princessesCaught)
				if (princessesCaught < 4){
					nivel = 1;
					localStorage.setItem('nivel',nivel)
				}
				if (princessesCaught == princessForNextLevel){
					++nivel;
					princessForNextLevel = parseInt(princessForNextLevel) + parseInt(5);
					localStorage.setItem('princessForNextLevel',princessForNextLevel)
					++numStone;
					++numMonster;
					monsterspeed +=10;
				}
				localStorage.setItem('nivel',nivel)
				localStorage.setItem('numStone',numStone)
				localStorage.setItem('numMonster',numMonster)
				reset();


		}
	if(touchNaranja(hero)){
		heroLifes = 1;
		localStorage.setItem('heroLifes',heroLifes)
		orangeReady = false;
	}
	monstermove(modifier);
	// morir si toco un monstruo y como el primer "nivel"
	if(touchMonster(hero)){
		--heroLifes;
		localStorage.setItem('heroLifes',heroLifes);
		if(heroLifes == 1){
			naranja = {};
			naranja.x = 48 + (Math.random() * (canvas.width - 96));
			naranja.y = 48 + (Math.random() * (canvas.height - 96));
			if (hero.x <= (naranja.x + 16)
					&& naranja.x <= (hero.x + 16)
					&& hero.y <= (naranja.y + 16)
					&& naranja.y <= (hero.y + 32)
					||naranja.x <= (princess.x + 16)
					&& princess.x <= (naranja.x + 16)
					&& naranja.y <= (princess.y + 16)
					&& princess.y <= (naranja.y + 32))
			{
				naranja.x = 48 + (Math.random() * (canvas.width - 96));
				naranja.y = 48 + (Math.random() * (canvas.height - 96));
			}
		}else if(heroLifes == -1){
			if(alert('Game Over!')){
				//localStorage.clear();

			}else{
				window.location.reload();
			}
			heroLifes = 3;
			numStone = 1;
			numMonster = 1;
			princessesCaught = 0;
			nivel = 1;

			localStorage.clear();
			reset();
		}else{
			reset();
		}
		//localStorage.setItem('heroLifes',heroLifes)
	}

};

// Draw everything
var render = function () { // pintamos
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		for (var i = 0; i < arrayStone.length; i++) {
			ctx.drawImage(stoneImage,arrayStone[i].x, arrayStone[i].y);
		}
	}

	if (monsterReady) {
		for (var i = 0; i < arrayMonster.length; i++) {
			ctx.drawImage(monsterImage, arrayMonster[i].x, arrayMonster[i].y);
		}
	}
	if (orangeReady) {
		ctx.drawImage(orangeImage, naranja.x, naranja.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("  Lives:  ", 285, 32);
	if (heartReady){
			for(var i=0;i<heroLifes;i++){
					ctx.drawImage(heartImage, 375+i*32, 32);
			}
	}
	ctx.fillText("Level: " + nivel, 32, 420);
};

// The main game loop // bucle infinito donde cada milisegundo miramos si ambos se tocan
var main = function () {
	var now = Date.now();
	var delta = now - then; // variacion del tiempo

	update(delta / 1000); // me cambia la pos del protagonista
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible // (llama a main,cada "1" milisegundo)
