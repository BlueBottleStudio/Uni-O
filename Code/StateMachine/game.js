const SIZE = 35; 

var GameInterval = null;

var person = { x: 0, y: 0, image: null };
var persons = {img:null, x:320, y:320, dir:1, idle:true};
var speed = 10;

var grid = [];
var gameBackground = new Image();
gameBackground.src = "../backgrounds/Game.png";
var cricle = new Image();
var collided;

var gameWidth = 540;
var gameHeight = 640;
var playerBulletImage = new Image();
playerBulletImage.src = "../Sprites/bullets/player shots/ball_dot.png";

var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var spacePress =false;
var jPressed = false;
var kPressed = false;
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

//Player Variables

var lives = 5;
var bulletArray = [];
var playerBulletFreq = 6;
var playerBulletDelay = 7;
var deathInvincibility = 100;
var invincibilityTimer = 0;
var canDie = true;

//Enemy Variables

var enemyimage = new Image();
enemyimage.src = "../img/enemyOne.png";

var enemyBullet = new Image();
enemyBullet.src = "../img/fireball.png";


var allEnemies = [];
var allEnemyBullets = [];
var id = 0;

//Temporary spawning
var spawnFreq = 0;
var spawnDelay = 15;

//Kill counter is a milestone variable for unlocked skills.
var killCounter = 0;

//Skills
var currentSkill = 1;
var totalSkills = 5;

//UI
var uiBackgroundImage = new Image();

function setGameToStart()
{    
	stage.style.backgroundColor = "yellow";
	stage.style.backgroundImage = null;
	
	person.image = new Image();
	person.image.src = "../backgrounds/player/Jono/Movements.png";
	person.x = 280;
	person.y = 560;
	canvas.width = 800;
	canvas.height = 640;
	canvas.style = "position: absolute; top:8px; left: 560px;";
	console.log("Entered game state, initializing..");
	GameInterval = setInterval(gameUpdate, 25.34);
}

function gameUpdate()
{
	checkInput();
	moveBullets();
	rendergame();
    spawnRandomEnemies();
	updateSkills();
    updateEnemies();
    deleteEnemies();
    updateBullets();
    deleteBullets();
    checkCollision();
}

function onKeyDown(event)
{
	switch(event.keyCode)
	{
		case 37:
		case 65:
			if (leftPressed == false)
				leftPressed = true;
			break;
		case 39:
		case 68:
			if (rightPressed == false)
				rightPressed = true;
			break
		case 38:
		case 87:
			if (upPressed == false) 
				upPressed = true;
			break
		case 40:
		case 83:
			if (downPressed == false) 
				downPressed = true;
			break
		case 74 :
			if (jPressed == false)
				jPressed = true;
			break
		case 75 :
			if (kPressed == false)
				kPressed = true;
			speed = 5;
			break;   
		case 80 :
			    allEnemies.push(new Enemy(id, enemyimage, 100, 100, Math.floor((Math.random() * 3) + 1), Math.floor((Math.random() * 3) + 1), 30, 30, 0, 5));
			    id++;
			    break;
				
	}
}
function onKeyUp(event)
{
	switch(event.keyCode)
	{
		case 37:
		case 65:
			leftPressed = false; break;
		case 39:
		case 68:
			rightPressed = false; break;
		case 38:
		case 87:
			upPressed = false; break;
		case 40:
		case 83: 
			downPressed = false; break;
		case 74 :
		{
			jPressed = false;
		}break;
		case 75 :
			kPressed =false;
			speed = 10;
			break;
	}
}

function checkInput()
{

	if (leftPressed == true && person.x > 0)
	{
		person.x = person.x - speed;
	}
	if (rightPressed == true && person.x < gameWidth - SIZE)
	{
		person.x = person.x + speed;
	}
	if (upPressed == true && person.y > 0)
	{
		person.y = person.y - speed;
	}
	if (downPressed == true && person.y < gameHeight - SIZE)
	{
		person.y = person.y + speed;
	}
	if (jPressed == true) {
	    if (playerBulletFreq == playerBulletDelay) {
	        spawnBullet();
	        playerBulletFreq = 0;
	    }
	    else
	        playerBulletFreq++;
	}
}

function spawnRandomEnemies()
{
    if (spawnFreq == spawnDelay) {
        allEnemies.push(new Enemy(id, enemyimage, (gameWidth / 2) - (enemyimage.width/2), Math.floor((Math.random() * 50) + 1), Math.floor((Math.random() * 7) - 3), Math.floor((Math.random() * 4) + 1), 30, 30, 0, 5));
        id++;
        spawnFreq = 0;
    }
    else
        spawnFreq++;
}


function updateSkills()
{
if (killCounter >= (currentSkill*10) && currentSkill < totalSkills)
	{
	killCounter=0;
	currentSkill++;
	if (currentSkill == 1)
		playerBulletDelay = 7;
	else if (currentSkill == 2)
		playerBulletDelay = 5;
	else if (currentSkill == 4)
		playerBulletDelay = 3;
	
	playerBulletFreq = playerBulletDelay-1;
	}
}

function spawnBullet()
{
	if (currentSkill == 1 || currentSkill == 2)
	{
    var tempBullet = new PlayerBullet(person.x + 9, person.y-5, 0, 15);
    bulletArray.push(tempBullet);
	}
	else if (currentSkill == 3 || currentSkill == 4)
	{
    var tempBullet = new PlayerBullet(person.x + 9, person.y-5, 1, 15);
    bulletArray.push(tempBullet);
    var tempBullet = new PlayerBullet(person.x + 9, person.y-5, -1, 15);
    bulletArray.push(tempBullet);
	}
	else if (currentSkill == 5)
	{
    var tempBullet = new PlayerBullet(person.x + 9, person.y-5, 0, 15);
    bulletArray.push(tempBullet);
    var tempBullet = new PlayerBullet(person.x + 9, person.y-5, 3, 15);
    bulletArray.push(tempBullet);
    var tempBullet = new PlayerBullet(person.x + 9, person.y-5, -3, 15);
    bulletArray.push(tempBullet);
	}
}

function moveBullets()
{
    for (var bullet = 0; bullet < bulletArray.length;bullet++)
    {
        if (bulletArray[bullet].y > 0)
            bulletArray[bullet].move();
        else
            bulletArray.splice(bullet, 1);
    }
}

function PlayerBullet(x, y,diretionX,diretionY) {
    this.x = x;
    this.y = y;
    this.diretionX = diretionX;
    this.diretionY = diretionY;
    this.move = function()
    {
        this.y = this.y - this.diretionY;
        this.x = this.x - this.diretionX;
    }
}


//Enemy


function Enemy(enemyID, enemyImage, xLocation, yLocation, xMove, yMove, bulletFrequency, currentFrequency, xBullet, yBullet) {
    this.enemyID = enemyID;
    this.enemyImage = enemyImage;
    this.xLocation = xLocation;
    this.yLocation = yLocation;
    this.xMove = xMove;
    this.yMove = yMove;
    this.bulletFrequency = bulletFrequency;
    this.currentFrequency = currentFrequency;
    this.xBullet = xBullet;
    this.yBullet = yBullet;

    //Default moving function.
    this.move = function () {
        this.xLocation = this.xLocation + this.xMove;
        this.yLocation = this.yLocation + this.yMove;
    }

    //Changing where the enemy moves while it's still alive.
    this.changeMove = function (xMove, yMove) {
        this.xMove = xMove;
        this.yMove = yMove;
    }

    //Spawns Enemy Bullets
    this.shoot = function () {
        allEnemyBullets.push(new EnemyBullet(enemyBullet, this.xLocation + (this.enemyImage.width / 2), this.yLocation + this.enemyImage.height, xBullet, yBullet));
    }

    //Frequency at which the enemy shoots bullets
    this.updateFrequency = function () {
        if (this.currentFrequency > 0) {
            this.currentFrequency--;
        }
        else {
            this.currentFrequency = this.bulletFrequency;
            this.shoot();
        }

    }
}

//Changes enemy poisitioning and updates shooting
function updateEnemies() {

    if (allEnemies.length > 0) {
        for (var enemy = 0 ; enemy < allEnemies.length; enemy++) {
            allEnemies[enemy].move();
            allEnemies[enemy].updateFrequency();

        }

    }
}

//Deletes Monsters if they are out of play field range
function deleteEnemies() {
    for (var enemy = 0 ; enemy < allEnemies.length; enemy++) {
        if (allEnemies[enemy].xLocation + allEnemies[enemy].enemyImage.width < 0)
            allEnemies.splice(enemy, 1);
        else if (allEnemies[enemy].xLocation > gameWidth)
            allEnemies.splice(enemy, 1);
        else if (allEnemies[enemy].yLocation + allEnemies[enemy].enemyImage.height < 0)
            allEnemies.splice(enemy, 1);
        else if (allEnemies[enemy].yLocation > gameHeight)
            allEnemies.splice(enemy, 1);
    }
}

//Enemy Bullets

function EnemyBullet(bulletImage, xLocation, yLocation, xMove, yMove) {
    this.bulletImage = bulletImage;
    this.xLocation = xLocation;
    this.yLocation = yLocation;
    this.xMove = xMove;
    this.yMove = yMove;

    this.travel = function () {
        this.xLocation = this.xLocation + this.xMove;
        this.yLocation = this.yLocation + this.yMove;
    }
}

//Changes location of bullets
function updateBullets() {
    if (allEnemyBullets.length > 0) {
        for (var bullet = 0 ; bullet < allEnemyBullets.length; bullet++) {
            allEnemyBullets[bullet].travel();

        }
    }
}

//Deletes Bullets if it is out of the playfield.
function deleteBullets() {
    for (var bullet = 0 ; bullet < allEnemyBullets.length; bullet++) {
        if (allEnemyBullets[bullet].xLocation + allEnemyBullets[bullet].bulletImage.width < 0)
            allEnemyBullets.splice(bullet, 1);
        else if (allEnemyBullets[bullet].xLocation - allEnemyBullets[bullet].bulletImage.width > gameWidth)
            allEnemyBullets.splice(bullet, 1);
        else if (allEnemyBullets[bullet].yLocation + allEnemyBullets[bullet].bulletImage.height < 0)
            allEnemyBullets.splice(bullet, 1);
        else if (allEnemyBullets[bullet].yLocation - allEnemyBullets[bullet].bulletImage.height > gameHeight)
            allEnemyBullets.splice(bullet, 1);
    }
}

function checkCollision() {

	//Collision with player and enemy bullets.
	if (allEnemyBullets.length > 0 && canDie == true)
	for (var bullet = 0 ; bullet < allEnemyBullets.length; bullet++)
	{
	
	if (allEnemyBullets[bullet].xLocation > person.x-5 &&
		allEnemyBullets[bullet].xLocation < (person.x-5 + person.image.width) &&
		allEnemyBullets[bullet].yLocation > person.y &&
		allEnemyBullets[bullet].yLocation < (person.y + person.image.height))
		{
		console.log("Die");
		person.x = 280;
		person.y = 560;
		lives--;
		canDie = false;
		}
	}
	else if (canDie == false)
	{
	if (invincibilityTimer == deathInvincibility)
	{
	console.log("Can Die Again");
		canDie = true;
		invincibilityTimer = 0;
	}
	else
		invincibilityTimer ++;
	}
	
	//Collision with enemy and player bullets.
    if (bulletArray.length > 0 && allEnemies.length > 0)
        for (var bullet = 0 ; bullet < bulletArray.length; bullet++) {
            for (var enemy = 0; enemy < allEnemies.length; enemy++) {
                if (bulletArray[bullet].x > allEnemies[enemy].xLocation &&
                    bulletArray[bullet].x < (allEnemies[enemy].xLocation + allEnemies[enemy].enemyImage.width) &&
                    bulletArray[bullet].y > allEnemies[enemy].yLocation &&
                    bulletArray[bullet].y < (allEnemies[enemy].yLocation + allEnemies[enemy].enemyImage.height)) {
                    bulletArray.splice(bullet, 1);
                    allEnemies.splice(enemy, 1);
					killCounter++;
                }
            }
        }
}

function rendergame()
{
	RenderActiveButtons();
	surface.clearRect(0,0,gameWidth,canvas.height);
	
		surface.drawImage(gameBackground,0,0);
		surface.drawImage(person.image, person.x, person.y);
		if (bulletArray.length > 0) {
			    for (var i = 0; i < bulletArray.length; i++) {
			        surface.drawImage(playerBulletImage, bulletArray[i].x, bulletArray[i]. y);
			    }
			}
			
			for (var bullet = 0 ; bullet < allEnemyBullets.length; bullet++) {
			surface.drawImage(allEnemyBullets[bullet].bulletImage, allEnemyBullets[bullet].xLocation, allEnemyBullets[bullet].yLocation);
			}
			
			for (var enemy = 0 ; enemy < allEnemies.length; enemy++) {
			    surface.drawImage(allEnemies[enemy].enemyImage, allEnemies[enemy].xLocation, allEnemies[enemy].yLocation);

			}
				
			//This is the right side of the game (the UI)
			
		surface.drawImage(gameBackground,540,0);
		//console.log ("CurrentSkill : " + currentSkill + "   /  Kills : " + killCounter);
		console.log ("Lives : " + lives);
		//console.log (person.image.width + "/" + person.image.height);
		//console.log (person.x + "/" + person.y);
		//console.log (playerBulletDelay);
		//console.log (playerBulletFreq);
}

