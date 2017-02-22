const SIZE = 64; 
const ROWS = 10;
const COLS = 11;
const BULLETSPEED = 15;


var person = { x: 0, y: 0, image: null };
person.image = new Image();
person.image.src = "../backgrounds/player/Jono/Movements.png";
var persons = {img:null, x:320, y:320, dir:1, idle:true};
var speed = 10;

var canvas = document.querySelector("canvas");
canvas.width = 640;
canvas.height = 640;
 canvas.style = "position: absolute; top:15px; left: 475px;";
person.x = 300;
person.y = 560;
var surface = canvas.getContext("2d");
var grid = [];
var cricle = new Image();
var collided;

var bulletArray = [];

var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var spacePress =false;
var jPressed = false;
var kPressed = false;
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);



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
				spawnBullet();
			break
		case 75 :
			if (kPressed == false)
				kPressed = true;
			speed = 5;
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
			jPressed = false;break;
		case 75 :
			kPressed =false;
			speed = 10;
			break;
	}
}

for (var row = 0; row < ROWS; row++)
{
	grid[row] = [];
	for (var col = 0; col < COLS; col++)
	{
		var tile = {};
		tile.x = col * SIZE;
		tile.y = row * SIZE;
		tile.img = cricle;
		grid[row][col] = tile;
	}
}

setInterval(update, 25.34);


function update()
{
	checkInput();
	moveBullets();
	render();
}

function spawnBullet()
{
	var tempBullet = {x:person.x+SIZE/3.6, y:person.y+SIZE/2};
	bulletArray.push(tempBullet);
}

function moveBullets()
{
	var i = 0;
	while (bulletArray[i] != undefined)
	{
		if (bulletArray[i].y < COLS*SIZE+5)
			bulletArray[i++].y -= BULLETSPEED;
		else
			bulletArray.splice(i,-1);
	}
}

function checkInput()
{

	if (leftPressed == true && person.x > 0)
	{
		person.x = person.x - speed;
	}
	if (rightPressed == true && person.x < 630 - SIZE)
	{
		person.x = person.x + speed;
	}
	if (upPressed == true && person.y > 0)
	{
		person.y = person.y - speed;
	}
	if (downPressed == true && person.y < 630 - SIZE)
	{
		person.y = person.y + speed;
	}
	if (jPressed == true){
		spawnBullet();
	}
}

function render()
{
	surface.clearRect(0,0,canvas.width,canvas.height);
	for (var row = 0; row < ROWS; row++)
	{
		for (var col = 0; col < COLS; col++)
		{
			surface.drawImage(grid[row][col].img, 
							  grid[row][col].x,
							  grid[row][col].y);
		}
	}
		surface.drawImage(person.image, person.x, person.y);
	for (var i = 0; i < bulletArray.length; i++)
	{
		surface.beginPath();
		surface.arc(bulletArray[i].x,
			bulletArray[i].y,
			4, 0, 2*Math.PI);
		surface.fillStyle = "white";
		surface.fill();
		surface.lineWidth = 2;
		surface.strokeStyle = "red";
		surface.stroke();
		surface.closePath();
	}
}

