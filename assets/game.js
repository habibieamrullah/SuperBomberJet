var canvas = document.getElementById("canvas");
canvas.addEventListener("mouseup", gameMouseUp, false);
var screenw = window.innerWidth;
var screenh = window.innerHeight;
canvas.width = screenw;
canvas.height = screenh;
var ctx = canvas.getContext("2d");
ctx.font = "20px Tahoma";

//Game Variables
var gameEvent = "loading";
var currentMission = "0";
var unlockedMission = "0";
var singleMission = false;
var nextExplosionFrame = true;
var title, bombDropSpeed, ground, cloud, cloudX, cloudY, sky, activeMark, tempMissionNumber, game, objective, gamePaused, playerBombs, playerCollectedBombs, bombId, bombCount, bombDropped, bomReloader, bombEmpty, explosion, enemy, enemies, enemyCount, enemyImage, building, buttonPlay, buttonSelectMission, buttonRetry, buttonNext, buttonMainMenu, buttonCredit, buttonPause, buttonBomb, prev, next, player, playerX, playerSpeed, bomb, bombX, bombY, bombSpeed, smoke, smokeId, smokeFrame, smokes;
//end of Game Variables

prepareAssets();

var zklogo = new Image();
zklogo.src = "zofiakreasi.png";
//first time game started
zklogo.onload = function(){
	ctx.beginPath();
	ctx.rect(0, 0, screenw, screenh);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.drawImage(zklogo, (screenw/2)-(this.width/2), (screenh/2)-(this.height/2));
	setTimeout(function(){
		//check unlocked missions
		checkUnlockedMission();
		startMainMenu();
	}, 2000);
}

function randomX(){
	var randomXPos = Math.floor(Math.random() * screenw-200) + 200;
	return randomXPos;
}

function gameMouseUp(event){
	var clicked_x = event.pageX;
	var clicked_y = event.pageY;
	switch (gameEvent){
		case "mainmenu":
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2) && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)) {
				playSound("click");
				startTheGame();
			}
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+35 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+35){
				playSound("click");
				tempMissionNumber = parseInt(unlockedMission);
				selectMission();
			}
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+70 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+70){
				playSound("click");
				credit();
			}
			break;
		case "loading":
			break;
		case "game" :
            if ( clicked_y > screenh-95 && clicked_x < 60+buttonBomb.width && !gamePaused){
				playSound("drop");
                dropBomb();
            }
			if ( clicked_y > screenh-60 && clicked_x > screenw-60 ){
				playSound("click");
				pauseGame();
			}
			break;
		case "failed":
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2) && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)){
				if(!singleMission){
					playSound("click");
					startTheGame();
				}
				else{
					playSound("click");
					currentMission = tempMissionNumber.toString();
					startSelectedMission();
				}
			}
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+35 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+35) {
				playSound("click");
				startMainMenu();
			}
			break;
		case "accomplished":
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2) && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)){
				if(!singleMission){
					playSound("click");
					startTheGame();
				}
				else{
					playSound("click");
					tempMissionNumber++;
					currentMission = tempMissionNumber.toString();
					startSelectedMission();
				}
			}
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+35 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+35) {
				playSound("click");
				startMainMenu();
			}
			break;
		case "selectMission" :
			if(clicked_x < 50){
				playSound("click");
				if(tempMissionNumber > 0){
					tempMissionNumber--;
					selectMission();
				}
				else if(tempMissionNumber == 0){
					tempMissionNumber = parseInt(unlockedMission);
					selectMission();
				}
			}
            if(clicked_x > screenw-50){
				playSound("click");
                if(tempMissionNumber < parseInt(unlockedMission)){
					tempMissionNumber++;
					selectMission();
				}else if(tempMissionNumber == parseInt(unlockedMission)){
					tempMissionNumber = 0;
					selectMission();
				}
            }
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-((buttonPlay.height/2)+100) && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+((buttonPlay.height/2)+100)) {
				playSound("click");
				currentMission = tempMissionNumber.toString();
				startSelectedMission();
			}
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+135 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+135) {
				playSound("click");
				startMainMenu();
			}
			break;
		case "paused" :
			playSound("click");
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+35 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+35){
				playSound("click");
				gamePaused = false;
				startMainMenu();
			}
			if ( clicked_y > screenh-60 && clicked_x > screenw-60 ){
				playSound("click");
				pauseGame();
			}
		case "credit" :
			playSound("click");
			if (clicked_x > (screenw/2)-(buttonPlay.width/2) && 
			clicked_y > (screenh/2)-(buttonPlay.height/2)+135 && 
			clicked_x < (screenw/2)+(buttonPlay.width/2) && 
			clicked_y < (screenh/2)+(buttonPlay.height/2)+135) {
				playSound("click");
				startMainMenu();
			}
	}
}

//credit screen
function credit(){
	gameEvent = "credit";
	ctx.clearRect(0, 0, screenw, screenh);
	drawbg();
	ctx.drawImage(zklogo, (screenw/2)-(zklogo.width/2), (screenh/2)-(zklogo.height/2));
	ctx.textAlign = "center";
	ctx.font = "13px Tahoma";
	ctx.fillText("Developed by habibie@zofiakreasi.com", screenw/2, (screenh/2)-(buttonMainMenu.height/2)+100);
	ctx.font = "20px Tahoma";
	ctx.drawImage(buttonMainMenu, (screenw/2)-(buttonMainMenu.width/2), (screenh/2)-(buttonMainMenu.height/2)+135);
}

//select mission/level
function selectMission(){	
	gameEvent = "selectMission";
	ctx.clearRect(0, 0, screenw, screenh);
	drawbg();
	ctx.textAlign = "center";
	ctx.fillText("Select Unlocked Missions", screenw/2, screenh/4);
	ctx.font = "114px Tahoma";
	ctx.fillText(tempMissionNumber, screenw/2, screenh/2)
	ctx.font = "20px Tahoma";
	ctx.drawImage(prev, 20, (screenh-prev.height)/2);
	ctx.drawImage(next, screenw-(20+next.width), (screenh-next.height)/2);
	ctx.drawImage(buttonPlay, (screenw/2)-(buttonPlay.width/2), (screenh/2)-(buttonPlay.height/2)+100);
	ctx.drawImage(buttonMainMenu, (screenw/2)-(buttonMainMenu.width/2), (screenh/2)-(buttonMainMenu.height/2)+135);
}

function prepareAssets(){
	prev = new Image();
	prev.src = "prev.png";
	next = new Image();
	next.src = "next.png";
	buttonPlay = new Image();
	buttonPlay.src = "start.png";
	buttonSelectMission = new Image();
	buttonSelectMission.src = "selectmission.png";
	buttonRetry = new Image();
	buttonRetry.src = "retry.png";
	buttonNext = new Image();
	buttonNext.src = "nextmission.png";
	buttonMainMenu = new Image();
	buttonMainMenu.src = "mainmenu.png";
	buttonCredit = new Image();
	buttonCredit.src = "credit.png";
	player = new Image();
	player.src = "boomber1.png";
	buttonPause = new Image();
	buttonPause.src = "pausebutton.png";
	bomb = new Image();
	bomb.src = "bomb.png";
	buttonBomb = new Image();
	buttonBomb.src = "bombbutton.png";
	explosion = new Image();
	explosion.src = "explosions.png";
	smoke = new Image();
	smoke.src = "smoke.png";
	activeMark = new Image();
	activeMark.src = "activeweapon.png";
	sky = new Image();
	sky.src = "sky.png";
	cloud = new Image();
	cloud.src = "cloud.png";
	ground = new Image();
	ground.src = "ground.png";
	title = new Image();
	title.src = "title.png";
	
	/*
	enemy images guide
	0 = building1
	1 = building2
	2 = humvee
	3 = truck
	4 = tank
	*/
	
	enemyImage = [];
	enemyImage[0] = new Image();
	enemyImage[0].src = "building1.png";
	enemyImage[1] = new Image();
	enemyImage[1].src = "building2.png";
	enemyImage[2] = new Image();
	enemyImage[2].src = "humvee.png";
	enemyImage[3] = new Image();
	enemyImage[3].src = "truck.png";
	enemyImage[4] = new Image();
	enemyImage[4].src = "tank.png";
}

function startMainMenu(){
	playMusic("menu");
	gameEvent = "mainmenu";
	ctx.clearRect(0, 0, screenw, screenh);
	drawbg();
	ctx.drawImage(buttonPlay, (screenw/2)-(buttonPlay.width/2), (screenh/2)-(buttonPlay.height/2));
	ctx.drawImage(buttonSelectMission, (screenw/2)-(buttonSelectMission.width/2), (screenh/2)-(buttonSelectMission.height/2)+35);
	ctx.drawImage(buttonCredit, (screenw/2)-(buttonSelectMission.width/2), (screenh/2)-(buttonSelectMission.height/2)+70);
}

function checkUnlockedMission(){
	if(localStorage.getItem("unlockedMission") === null){
		localStorage.setItem("unlockedMission", "0");
		unlockedMission = "0";
	}
	if(localStorage.getItem("currentMission") === null){
		localStorage.setItem("currentMission", "0");
		currentMission = "0";
	}
	if(localStorage.getItem("playerCollectedBombs") === null) localStorage.setItem("playerCollectedBombs","2");
	currentMission = localStorage.getItem("currentMission");
	unlockedMission = localStorage.getItem("unlockedMission");
	playerCollectedBombs = localStorage.getItem("playerCollectedBombs");
}

function startTheGame(){
	//start last mision
	singleMission = false;
	startMission(unlockedMission);
}

function startSelectedMission(){
	//start selected mission
	if(currentMission == unlockedMission) singleMission = false;
	else singleMission = true;
	startMission(currentMission);
}

function startMission(current){
	playerCollectedBombs = parseInt(localStorage.getItem("playerCollectedBombs"));
	currentMission = current;
    playerBombs = [];
	enemies = [];
    bombId = 0;
    groundY = 100;
	smokeFrame = 1;
	smokeId = 0;
	smokes = [];
	cloudX = Math.random()*(screenw/3);
	cloudY = Math.random()*(screenh/10);
	switch(currentMission){
		case "0" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 7;
			bombCount = 5 + playerCollectedBombs;
			//create enemies
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			objective = "Learn to drop a bomb";
			startLoop();
			break;
		case "1" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 7;
			bombCount = 4 + playerCollectedBombs;
			//create enemies
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(2, 1, randomX() , false);
			objective = "Moving Enemy"
			startLoop();
			break;
		case "2" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 7;
			bombCount = 5 + playerCollectedBombs;
			//create enemies
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(2, 1.2, randomX() , false);
			objective = "You Are The Destroyer"
			startLoop();
			break;
		case "3" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 7;
			bombCount = 7 + playerCollectedBombs;
			//create enemies
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(3, 1.5, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(4, 2, randomX() , false);
			objective = "Tank and Truck"
			startLoop();
			break;
		case "4" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 10 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(3, 1.5, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(4, 1.4, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(4, 2, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(2, 3, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(3, 2.6, randomX() , false);
			objective = "Destroy Them"
			startLoop();
			break;
		case "5" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 10 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(3, 1.5, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(4, 1.4, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(4, 2, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(2, 3, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(3, 2.6, randomX() , false);
			objective = "You Are Faster"
			startLoop();
			break;
		case "6" :
			bombDropSpeed = 5;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 16 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(3, 1.5, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(4, 1.4, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(4, 2, randomX() , false);
			enemies.push("8");
			enemies["8"] = new playerEnemy(2, 3, randomX() , false);
			enemies.push("9");
			enemies["9"] = new playerEnemy(3, 2.6, randomX() , false);
			enemies.push("10");
			enemies["10"] = new playerEnemy(4, 1.4, randomX() , false);
			enemies.push("11");
			enemies["11"] = new playerEnemy(4, 2, randomX() , false);
			objective = "More Enemies"
			startLoop();
			break;
		case "7" :
			bombDropSpeed = 10;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 16 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(3, 1.5, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(4, 1.4, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(4, 2, randomX() , false);
			enemies.push("8");
			enemies["8"] = new playerEnemy(2, 3, randomX() , false);
			enemies.push("9");
			enemies["9"] = new playerEnemy(3, 2.6, randomX() , false);
			enemies.push("10");
			enemies["10"] = new playerEnemy(4, 1.4, randomX() , false);
			enemies.push("11");
			enemies["11"] = new playerEnemy(4, 2, randomX() , false);
			objective = "Faster Bomb Drop";
			startLoop();
			break;
		case "8" :
			bombDropSpeed = 10;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 16 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(3, 4.5, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(4, 3.4, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(4, 3.7, randomX() , false);
			enemies.push("8");
			enemies["8"] = new playerEnemy(2, 4, randomX() , false);
			enemies.push("9");
			enemies["9"] = new playerEnemy(3, 3.6, randomX() , false);
			enemies.push("10");
			enemies["10"] = new playerEnemy(4, 2.4, randomX() , false);
			enemies.push("11");
			enemies["11"] = new playerEnemy(4, 3.1, randomX() , false);
			objective = "Faster Enemies";
			startLoop();
			break;
		case "9" :
			bombDropSpeed = 20;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 25 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(1, 0, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(0, 0, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(3, 4.5, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(4, 3.4, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(4, 3.7, randomX() , false);
			enemies.push("8");
			enemies["8"] = new playerEnemy(2, 4, randomX() , false);
			enemies.push("9");
			enemies["9"] = new playerEnemy(3, 3.6, randomX() , false);
			enemies.push("10");
			enemies["10"] = new playerEnemy(4, 2.4, randomX() , false);
			enemies.push("11");
			enemies["11"] = new playerEnemy(4, 3.1, randomX() , false);
			enemies.push("12");
			enemies["12"] = new playerEnemy(4, 4.4, randomX() , false);
			enemies.push("13");
			enemies["13"] = new playerEnemy(4, 3.5, randomX() , false);
			enemies.push("14");
			enemies["14"] = new playerEnemy(2, 4.4, randomX() , false);
			enemies.push("15");
			enemies["15"] = new playerEnemy(3, 3.2, randomX() , false);
			enemies.push("16");
			enemies["16"] = new playerEnemy(4, 2.7, randomX() , false);
			enemies.push("17");
			enemies["17"] = new playerEnemy(4, 3.9, randomX() , false);
			objective = "Super Fast Bombs";
			startLoop();
			break;
		case "10" :
			bombDropSpeed = 25;
			playerX = -100;
			playerSpeed = 10;
			bombCount = 20 + playerCollectedBombs;
			enemies.push("0");
			enemies["0"] = new playerEnemy(3, 6.2, randomX() , false);
			enemies.push("1");
			enemies["1"] = new playerEnemy(3, 5.7, randomX() , false);
			enemies.push("2");
			enemies["2"] = new playerEnemy(4, 6.6, randomX() , false);
			enemies.push("3");
			enemies["3"] = new playerEnemy(4, 4.5, randomX() , false);
			enemies.push("4");
			enemies["4"] = new playerEnemy(2, 6.7, randomX() , false);
			enemies.push("5");
			enemies["5"] = new playerEnemy(2, 4.5, randomX() , false);
			enemies.push("6");
			enemies["6"] = new playerEnemy(4, 7.4, randomX() , false);
			enemies.push("7");
			enemies["7"] = new playerEnemy(4, 7.7, randomX() , false);
			enemies.push("8");
			enemies["8"] = new playerEnemy(2, 8, randomX() , false);
			enemies.push("9");
			enemies["9"] = new playerEnemy(3, 7.6, randomX() , false);
			enemies.push("10");
			enemies["10"] = new playerEnemy(4, 6.4, randomX() , false);
			enemies.push("11");
			enemies["11"] = new playerEnemy(4, 7.1, randomX() , false);
			enemies.push("12");
			enemies["12"] = new playerEnemy(4, 7.4, randomX() , false);
			enemies.push("13");
			enemies["13"] = new playerEnemy(4, 9.5, randomX() , false);
			enemies.push("14");
			enemies["14"] = new playerEnemy(2, 7.4, randomX() , false);
			enemies.push("15");
			enemies["15"] = new playerEnemy(3, 6.2, randomX() , false);
			enemies.push("16");
			enemies["16"] = new playerEnemy(4, 7.7, randomX() , false);
			enemies.push("17");
			enemies["17"] = new playerEnemy(4, 6.9, randomX() , false);
			objective = "Last Mission";
			startLoop();
			break;
		default :
			missionLocked();
	}
}

function startLoop(){
	gameEvent = "game";
	playMusic("game");
	gamePaused = false;
	enemyCount = enemies.length;
	game = setInterval(gameLoop, 1000/30);
}

function playerEnemy(enemyType, speedX, enemyX, isDestroyed){
    this.enemyType = enemyType;
	this.speedX = speedX;
    this.x = enemyX;
    this.isDestroyed = isDestroyed;
}

function playerBomb(bombId){
    this.id = bombId;
    this.x = (playerX + player.width / 2) - (bomb.width/2);
    this.y = 120 - (bomb.height/2);
    this.speed = bombDropSpeed;
    this.exploded = false;
    this.explosionFrameNum = 0;
}

function smokeObject(smokeId, x, y){
	this.id = smokeId;
	this.x = x;
	this.y = y;
}

function drawSmoke(){
	//loop for smokes and draw each smoke
	if(smokes.length > 0){
		for(smokeIndex = 0; smokeIndex < smokes.length; smokeIndex++){
			ctx.drawImage(smoke, 0, ((smokeFrame*(1950/30))-(1950/30)), 50, 1950/30, smokes[smokeIndex].x, smokes[smokeIndex].y-50, 50, 1950/30);
		}
		smokeFrame++;
		if(smokeFrame > 30) smokeFrame = 1;
	}
}

function dropBomb(){
    if(!bombEmpty && bombCount > 0){
		playSound("drop");
        playerBombs.push(bombId.toString());
        playerBombs[bombId.toString()] = new playerBomb(bombId);
        bombDropped = true;
        bombId++;
        bombCount--;
		
    }
}

function drawbg(){
	ctx.rect(0, 0, screenw, screenh);
	ctx.fillStyle = "#d8ebff";
	ctx.fillRect(0, 0, screenw, screenh);
	ctx.fillStyle = "#000000";
	//draw sky
	var skyparts = (screenw/sky.width)+1;
	for(skycount = 0; skycount < skyparts; skycount++){
		ctx.drawImage(sky, skycount*sky.width, screenh-sky.height);
	}
	//draw clouds
	ctx.drawImage(cloud, cloudX, cloudY);
	//draw ground
	var groundparts = (screenw/ground.width);
	for(groundcount = 0; groundcount < groundparts; groundcount++){
		ctx.drawImage(ground, groundcount*ground.width, screenh-200);
	}
	if(gameEvent == "mainmenu") ctx.drawImage(title, (screenw/2)-(title.width/2), 50);
}

function gameLoop(){
	ctx.clearRect(0, 0, screenw, screenh);
	//drawbg
	drawbg();
	//texts
	ctx.textAlign = "center";
	ctx.fillText("Mission: " + currentMission,screenw/2,screenh-60);
	ctx.fillText("" + objective, screenw/2, screenh-30);
	drawSmoke();
	for(i = 0; i < enemies.length; i++){
		if(!enemies[i].isDestroyed)ctx.drawImage(enemyImage[enemies[i].enemyType], 0, 0, enemyImage[enemies[i].enemyType].width/2, enemyImage[enemies[i].enemyType].height, enemies[i].x, screenh-(groundY+enemyImage[enemies[i].enemyType].height), enemyImage[enemies[i].enemyType].width/2, enemyImage[enemies[i].enemyType].height);
		else {
			ctx.drawImage(enemyImage[enemies[i].enemyType], enemyImage[enemies[i].enemyType].width/2, 0, enemyImage[enemies[i].enemyType].width/2, enemyImage[enemies[i].enemyType].height, enemies[i].x, screenh-(groundY+enemyImage[enemies[i].enemyType].height), enemyImage[enemies[i].enemyType].width/2, enemyImage[enemies[i].enemyType].height);
			
		}
		enemies[i].x -= enemies[i].speedX;
		if(enemies[i].x < - 100) enemies[i].x = screenw + 100;
		if(playerBombs.length > 0){
			for(ii = 0; ii < playerBombs.length; ii++){
				if(playerBombs[ii].y < screenh-groundY && !playerBombs[ii].exploded){
					ctx.drawImage(bomb, playerBombs[ii].x-10, playerBombs[ii].y-10);
					playerBombs[ii].x += ((playerBombs[ii].speed / 2)/enemies.length);
					playerBombs[ii].y += ((playerBombs[ii].speed)/enemies.length);
					if(playerBombs[ii].x > screenw) playerBombs[ii].x = -10;
					if(playerBombs[ii].x > enemies[i].x && playerBombs[ii].x < enemies[i].x + enemyImage[enemies[i].enemyType].width/2 && playerBombs[ii].y > screenh - (groundY+enemyImage[enemies[i].enemyType].height) && !playerBombs[ii].exploded && !enemies[i].isDestroyed){
						playerBombs[ii].exploded = true;
						enemies[i].isDestroyed = true;
						enemies[i].speedX = 0;
						enemyCount--;
						//generate smoke
						smokes.push(smokeId.toString());
						smokes[smokeId.toString()] = new smokeObject(smokeId, enemies[i].x, screenh-(groundY+enemyImage[enemies[i].enemyType].height));
						smokeId++;
					}
				}else{
					playerBombs[ii].exploded = true;
					if(playerBombs[ii].explosionFrameNum < 5){
						if(nextExplosionFrame){
							blast(playerBombs[ii].x, playerBombs[ii].y, playerBombs[ii].explosionFrameNum);
							playerBombs[ii].explosionFrameNum++;
							nextExplosionFrame = false;
						}
					}
				}
			}
		}
	}
	nextExplosionFrame = true;
	if(!bombEmpty && bombCount > 0){
		ctx.drawImage(activeMark, 20, screenh-95);
		ctx.textAlign = "center";
		ctx.fillText(bombCount, ((60-buttonBomb.width)+(buttonBomb.width/2)), screenh-70);
		ctx.drawImage(buttonBomb, 60-buttonBomb.width, screenh-60);
	}
	if(bombDropped){
		bombDropped = false;
		bombEmpty = true;
		bombReloader = setInterval(function(){
			bombEmpty = false; 
			clearInterval(bombReloader);
		},500);
	}
    ctx.drawImage(player, playerX, 60);
	ctx.drawImage(buttonPause, screenw-60, screenh-60);
	if(playerX > screenw) playerX = -200;
	else playerX += playerSpeed;
	
	//all enemies destroyed = mission accomplished
	if(enemyCount == 0){
		if(bombCount == 0)localStorage.setItem("playerCollectedBombs","0");
		else localStorage.setItem("playerCollectedBombs",bombCount.toString());
		setTimeout(function(){
			clearInterval(game);
			missionAccomplished();
		},180);
	}
	
	//if bomb empty & enemy still remain = mission failed
	if(bombCount == 0 && enemyCount > 0 && playerBombs[playerBombs.length-1].exploded){
		localStorage.setItem("playerCollectedBombs","0");
		setTimeout(function(){
			clearInterval(game)
			game = null;
			missionFailed();
		}, 180)
	}
}

//play blast explosion animation
function blast(x, y, exFN){
	playSound("explode");
    ctx.drawImage(explosion, exFN*100, 0, 100, 100, x-((explosion.width/6)/2)+10, y-(explosion.height/2)+10, 100, 100);
}

//pause the game
function pauseGame(){
	if(gameEvent == "game" || gameEvent == "paused"){
		pauseMusic();
		if(!gamePaused){
			clearInterval(game);
			gamePaused = true;
			ctx.clearRect(0, 0, screenw, screenh);
			drawbg();
			ctx.textAlign = "center";
			ctx.fillText("Game Paused", screenw/2, screenh/2);
			ctx.drawImage(buttonPause, screenw-60, screenh-60);
			ctx.drawImage(buttonMainMenu, (screenw/2)-(buttonMainMenu.width/2), (screenh/2)-(buttonMainMenu.height/2)+35);
			gameEvent = "paused";
			return;
		}else if(gamePaused){
			game = setInterval(gameLoop, 1000/30);
			gamePaused = false;
			gameEvent = "game";
			return;
		}
	}
}

//retry mission
function missionFailed(){
	//Android.showIntFromJs();
	ctx.clearRect(0, 0, screenw, screenh);
	drawbg();
	ctx.textAlign = "center";
	ctx.fillText("Mission failed!", screenw/2, screenh/3);
	gameEvent = "failed";
	ctx.drawImage(buttonRetry, (screenw/2)-(buttonRetry.width/2), (screenh/2)-(buttonRetry.height/2));
	ctx.drawImage(buttonMainMenu, (screenw/2)-(buttonMainMenu.width/2), (screenh/2)-(buttonMainMenu.height/2)+35);
}

//mission accomplished
function missionAccomplished(){
	//Android.showIntFromJs();
	clearInterval(game);
	ctx.clearRect(0, 0, screenw, screenh);	
	drawbg();
	ctx.textAlign = "center";
	ctx.fillText("Mission accomplished!", screenw/2, screenh/3);
	ctx.drawImage(buttonNext, (screenw/2)-(buttonNext.width/2), (screenh/2)-(buttonNext.height/2));
	ctx.drawImage(buttonMainMenu, (screenw/2)-(buttonMainMenu.width/2), (screenh/2)-(buttonMainMenu.height/2)+35);
	if(!singleMission){
		switch(currentMission){
			case "0" : unlockedMission = "1";
			break;
			case "1" : unlockedMission = "2";
			break;
			case "2" : unlockedMission = "3";
			break;
			case "3" : unlockedMission = "4";
			break;
			case "4" : unlockedMission = "5";
			break;
			case "5" : unlockedMission = "6";
			break;
			case "6" : unlockedMission = "7";
			break;
			case "7" : unlockedMission = "8";
			break;
			case "8" : unlockedMission = "9";
			break;
			case "9" : unlockedMission = "10";
			break;
			case "10" : unlockedMission = "10";
			break;
		}
		localStorage.setItem("unlockedMission", unlockedMission);
		localStorage.setItem("currentMission", unlockedMission);
	}
	gameEvent = "accomplished";
}

//mission is locked
function missionLocked(){
	ctx.clearRect(0, 0, screenw, screenh);
	drawbg();
	ctx.textAlign = "center";
	ctx.fillText("New mission is not available.", screenw/2, screenh/3);
	gameEvent = "accomplished";
	ctx.drawImage(buttonMainMenu, (screenw/2)-(buttonMainMenu.width/2), (screenh/2)-(buttonMainMenu.height/2)+35);
}

var soundfile;
function playSound(sound){
	switch(sound){
		case "click" :
		soundfile = new Audio("Click.mp3");
		soundfile.play();
		break;
		case "drop" :
		soundfile = new Audio("DropBomb.mp3");
		soundfile.play();
		break;
		case "explode" :
		soundfile = new Audio("Explosion.mp3");
		soundfile.play();
		break;
	}
}

var menumusic = new Audio("MainMenu.mp3");
var gamemusic = new Audio("Game.mp3");
function playMusic(music){
	musicfile = null;
	switch(music){
		case "menu" :
		gamemusic.pause();
		menumusic.play();
		break;
		case "game" :
		menumusic.pause();
		gamemusic.play();
	}
	/*
	musicfile.addEventListener("ended", function(){
		this.currentTime = 0;
		this.play();
	}, false);
	*/
}

function pauseMusic(){
	if(gamePaused){
		gamemusic.play();
		return;
	}else{
		gamemusic.pause();
		gamemusic.pause();
		return;
	}
}

//ref:
/*
context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
*/