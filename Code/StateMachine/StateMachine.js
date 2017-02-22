var stage = document.getElementById("stage");
var canvas = document.getElementById("canvas");
var surface = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 640;

var renderMenu = true;

/* states is an array of objects where each object is a state with an enter, update and exit function. These
   functions get called in the changeState function. */
var states = [{enter: enterMenu, update: updateMenu, exit: exitMenu}, 	// Main menu state.
			  {enter: enterGame, update: updateGame, exit: exitGame}, 	// Game state.
			  {enter: enterHelp, update: updateHelp, exit: exitHelp}];	// Help state.
var lastState = -1; // These two variables should be indices for the states array.
var currState = -1;
// The buttons array stores information about all buttons for my simple UI that just changes states.
var buttons = [{img:"img/start_btn.png", imgO:"img/start_btn_hvr.png", x:300, y:300, w:200, h:50, over:false, click:onStartClick}, // Start button
			   {img:"img/help_btn.png", imgO:"img/help_btn_hvr.png", x:340, y:400, w:120, h:55, over:false, click:onHelpClick}, // Help button
			   {img:"img/quit_btn.png", imgO:"img/quit_btn_hvr.png", x:400, y:590 , w:200, h:50, over:false, click:onExitClick}]// Exit button
// The activeBtns array is set in each enter function for each state and holds the buttons currently on screen.
var activeBtns = [];
var numAssets = 6;
var assetsLoaded = 0;

var mouse = {x:0, y:0}; // Stores mouse position in canvas.

const fps = 30; // or 60. The game's set frame rate all update functions will run at.
const fpsMS = 1/fps*1000; // The frames per second as a millisecond interval.
var updateIval;

window.addEventListener("load", loadAssets);
canvas.addEventListener("mousemove", updateMouse);
canvas.addEventListener("click", onMouseClick);

// The loadAssets function currently only creates the Image objects for all the buttons.
function loadAssets(event)
{
	for (var i = 0; i < buttons.length; i++)
	{
		var tempBtn = new Image();
		tempBtn.src = buttons[i].img;
		tempBtn.addEventListener("load", onAssetLoad);
		buttons[i].img = tempBtn; // .img used to hold the path string, now it holds the actual image object.
		var tempBtnO = new Image();
		tempBtnO.src = buttons[i].imgO;
		tempBtnO.addEventListener("load", onAssetLoad);
		buttons[i].imgO = tempBtnO;
	}
}

function onAssetLoad(event)
{
	if (++assetsLoaded == numAssets)
		initGame();
}
			  
function initGame()
{
	// This function can be called to kick-off the game when all important main/menu assets are loaded.
	changeState(0); // Change to menu state.
}

function changeState(stateToRun)
{
	if (stateToRun >= 0 && stateToRun < states.length) // Just a check to see if the state to run is valid.
	{
		lastState = currState;
		currState = stateToRun;
		states[currState].enter(); // Will call the appropriate enter function of the current state. For initialization, etc.
		updateIval = setInterval(states[currState].update, fpsMS);
	}
	else
		console.log("Invalid stateToRun!");
}

function enterMenu()
{
    var stage = document.getElementById("stage");
    var canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 640;
    var surface = canvas.getContext("2d");
    console.log("Entering menu state.");
   stage.style.backgroundImage = "url('img/MainMenu.png')";
    Banner = document.createElement("IMG");
    Banner.src = "img/Title.png";
    Banner.style = "position: absolute; top: 5%; left: 40%;";
    stage.appendChild(Banner);
    activeBtns = [ buttons[0], buttons[1] ];
	renderMenu = true;
}

function updateMenu()
{
	if(renderMenu == false) return;
	checkButtons();
	render();
}

function exitMenu()
{
	console.log("Exiting menu state.");
}

function enterGame()
{
    console.log("Entering game state.");
    activeBtns = [buttons[2]];
    Banner.parentNode.removeChild(Banner);
	renderMenu = false;
	clearInterval(updateIval);
	setGameToStart();
}

function updateGame()
{
	if(renderMenu == false) return;
	checkButtons();
	render();
}

function exitGame()
{
	console.log("Exiting game state.");
}

function enterHelp()
{
    console.log("Entering help state.");
    stage.style.backgroundImage = "url('img/HelpScreen.png')";
    activeBtns = [ buttons[2] ];
    Banner.parentNode.removeChild(Banner);
}

function updateHelp()
{
	if(renderMenu == false) return;
	checkButtons();
	render();
}

function exitHelp()
{
	console.log("Exiting help state.");
}

// This checkButtons function is basically a box-collision-based test with the mouse location and each active button.
function checkButtons()
{
	for (var i = 0; i < activeBtns.length; i++)
	{
		activeBtns[i].over = false;
		if(!(mouse.x < activeBtns[i].x ||
			 mouse.x > activeBtns[i].x+activeBtns[i].w ||
			 mouse.y < activeBtns[i].y ||
			 mouse.y > activeBtns[i].y+activeBtns[i].h))
		{
			activeBtns[i].over = true; // If our mouse is inside the button box, flip the over flag to true.
		}
	}
}
/* If we click the mouse and one of the buttons happens to have their over flag set to true, run its click function.
   I need to do this because my buttons are drawn as part of the canvas and can't have events on them. */
function onMouseClick()
{
	for (var i = 0; i < activeBtns.length; i++)
	{
		if (activeBtns[i].over == true)
		{	
			activeBtns[i].click();
			break;
		}		
	}
}

// Basically being used just for each button. Draws the button image based on its over property.
function render()
{
	surface.clearRect(0, 0, canvas.width, canvas.height);
	document.body.style.cursor = "default";
	RenderActiveButtons();
}

function RenderActiveButtons()
{
	for (var i = 0; i < activeBtns.length; i++)
	{
		if (activeBtns[i].over == true)
		{
			surface.drawImage(activeBtns[i].imgO, activeBtns[i].x, activeBtns[i].y);
			document.body.style.cursor = "pointer";
		}
		else surface.drawImage(activeBtns[i].img, activeBtns[i].x, activeBtns[i].y);
	}
}

function onStartClick()
{
	changeState(1);
}

function onHelpClick()
{
	changeState(2);
}

function onExitClick()
{
	changeState(0);
}

// This function sets the mouse x and y position as it is on the canvas where 0,0 is top-left of canvas.
function updateMouse(event)
{
	var rect = canvas.getBoundingClientRect();
	mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}	
