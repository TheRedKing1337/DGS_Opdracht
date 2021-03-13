import { WorldBuilder } from "./DesignPatterns/Strategy/WorldBuilder";
import { PerlinNoise } from  "./DesignPatterns/Strategy/PerlinNoise";
import { NoiseFactory} from "./DesignPatterns/Factory/NoiseFactory";
import { BulletPool } from "./DesignPatterns/ObjectPool/BulletPool";
import { ApartmentBuilder } from "~DesignPatterns/Builder/Builder";
import { IDatabaseAdapter, HighscoreData, DatabaseAdapter} from "./DesignPatterns/Adapter/Adapter";
import { ShapeDrawer, IShape } from "./DesignPatterns/Facade/Facade";

import backgroundImg from "./Images/dungeon.png";
import appleImg from "./Images/Apple.png";
import snakeHeadImg from "./Images/SnakeHead.png";
import snakeBodyImg from "./Images/SnakeBody.png";
import snakeCornerImg from "./Images/SnakeCorner.png";
import snakeLastImg from "./Images/SnakeLast.png";
// const backgroundImg = require("./Images/dungeon.png")
// const appleImg = require('./Images/Apple.png');
// const snakeHeadImg = require('./Images/SnakeHead.png');
// const snakeBodyImg = require('./Images/SnakeBody.png');
// const snakeCornerImg = require('./Images/SnakeCorner.png');
// const snakeLastImg = require('./Images/SnakeLast.png');

//Creates a new WorldBuilder using Perlin noise
let wb = new WorldBuilder(new PerlinNoise());

//Builds a world
console.log(wb.BuildWorld().toString());

console.log("Strategy ran succesfully");

let noiseFactory = new NoiseFactory();
//Changes the used strategy to another type
wb.ChangeStrategy(noiseFactory.GetNoise("Voronoi"));

//Executes using the new type
console.log(wb.BuildWorld().toString());

console.log("Factory ran succesfully");

let builder = new ApartmentBuilder();

let studio = builder.BuildStudio();

console.log(studio.GetSize());

console.log("Builder ran succesfully");

let bullet = BulletPool.GetInstance().GetFromPool();

console.log("Singleton ran succesfully");

bullet.OnHit();

console.log("Object pool ran succesfully");

//this code does not work as it requires the database to work
// let databaseLink : IDatabaseAdapter = new DatabaseAdapter();
// let highscores : HighscoreData[] = databaseLink.GetHighscores();
// console.log(highscores);
//console.log("Adapter ran succesfully");

let shapeDrawer = new ShapeDrawer();
let triangle : IShape = shapeDrawer.DrawTriangle(1);
triangle.Resize(5);
console.log('Facade ran succesfully');




//Snake code below VVV
import * as PIXI from 'pixi.js';
document.getElementById("restart").addEventListener("click", Restart);

//Game setting variables
let tickSpeed = 0.2;
let cellSize = 32
let mapWidth = 20; 
let mapHeight = 20; 
//Game variables
let borderSize = mapWidth / 10;
let isAlive : boolean = true;
let gameOverMessage : PIXI.Text;
let timeSinceLastTick = 0;
enum Directions
{
    UP, RIGHT, DOWN, LEFT
}
let direction = Directions.UP;
let scoreUI = document.getElementById("score");
//Snake variables
class Vector2Int
{
    x : number;
    y : number;
    public constructor(x : number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}
let snakePos : Vector2Int[] = [new Vector2Int(Math.round(mapWidth/2),Math.round(mapHeight/2))]; //= [new Vector2Int(Math.round(Math.random()*(mapWidth-6)+1),Math.round(Math.random()*(mapHeight-6)+1))];
let applePos : Vector2Int = new Vector2Int(0,0);


//Setup PIXI screen
const app = new PIXI.Application({
    width : cellSize*mapWidth,
    height : cellSize*mapHeight
});
document.body.appendChild(app.view);

//Setup vars
let snakeHead: PIXI.Sprite, apple : PIXI.Sprite, snakeLast : PIXI.Sprite, background : PIXI.Sprite;
let snakeBodyTex : PIXI.Texture, snakeCornerTex : PIXI.Texture;
let snakeBodySprites : PIXI.Sprite[] = [];

//Setup the needed sprites
app.loader.add('background', backgroundImg)
.add("apple",appleImg)
.add('snakeHead', snakeHeadImg)
.add("snakeBody",snakeBodyImg)
.add("snakeCorner",snakeCornerImg)
.add("snakeLast",snakeLastImg)
.load((loader, resources) => {
    // This creates a texture from an image
    background = new PIXI.Sprite(resources.background.texture);
    
    //Set background size
    background.width = app.renderer.width;
    background.height = app.renderer.height;

    // Add the background to the scene we are building
    app.stage.addChild(background);
    
    //Setup snakehead sprite
    snakeHead = new PIXI.Sprite(resources.snakeHead.texture);
    snakeHead.width = cellSize;
    snakeHead.height = cellSize;
    snakeHead.anchor.x = 0.5;
    snakeHead.anchor.y = 0.5;
    app.stage.addChild(snakeHead);

    //Setup apple
    apple = new PIXI.Sprite(resources.apple.texture);
    apple.width = cellSize;
    apple.height = cellSize;
    apple.anchor.x = 0.5;
    apple.anchor.y = 0.5;
    apple.x = GridPosToScreenPos(applePos.x);
    apple.y = GridPosToScreenPos(applePos.y);
    app.stage.addChild(apple);

    //Setup snake last piece
    snakeLast = new PIXI.Sprite(resources.snakeLast.texture);
    snakeLast.width = cellSize;
    snakeLast.height = cellSize;
    snakeLast.anchor.x = 0.5;
    snakeLast.anchor.y = 0.5;
    app.stage.addChild(snakeLast);

    //Setup textures
    snakeBodyTex = resources.snakeBody.texture;
    snakeCornerTex = resources.snakeCorner.texture;

    DrawSnake();
    MoveApple();

    app.ticker.add(Tick);
});

document.addEventListener("keydown", KeyDown);


function KeyDown(event : KeyboardEvent) : void
{
    switch(event.key)
    {
        case "W" : case "ArrowUp" : direction = Directions.UP; break;
        case "D" : case "ArrowRight" : direction = Directions.RIGHT; break;
        case "S" : case "ArrowDown" : direction = Directions.DOWN; break;
        case "A" : case "ArrowLeft" : direction = Directions.LEFT; break;        
    }
}

function Tick() : void
{
    //Tick logic
    if(!isAlive) return;
    timeSinceLastTick += app.ticker.deltaMS*0.001;
    if(timeSinceLastTick < tickSpeed) return;

    //Actual tick below VVV
    timeSinceLastTick -= tickSpeed;

    //move snakePos forward and check for collisions/apples
    MoveSnake();

    //draw the snake based on new positions
    DrawSnake();
}
function MoveSnake() : void
{
    //Get the next position based on input
    let nextPos:Vector2Int;
    switch(direction)
    {
        case Directions.UP : nextPos = new Vector2Int(snakePos[0].x,snakePos[0].y-1); break;
        case Directions.RIGHT : nextPos = new Vector2Int(snakePos[0].x + 1,snakePos[0].y); break;
        case Directions.DOWN : nextPos = new Vector2Int(snakePos[0].x,snakePos[0].y+1); break;
        case Directions.LEFT : nextPos = new Vector2Int(snakePos[0].x - 1,snakePos[0].y); break;
    }
    //Check for collisions with self
    for(let i=1;i<snakePos.length;i++)
    {
        if(NearlyEqualsVec2(nextPos, snakePos[i]))
        {
            GameOver();
            return;
        }
    }
    //Check for out of bounds
    if(nextPos.x < 0 || nextPos.y < 0 || nextPos.x > mapWidth - borderSize*2 || nextPos.y > mapHeight -borderSize*2)
    {
        GameOver();    
        return;    
    }
    //check for apple
    if(NearlyEqualsVec2(nextPos, applePos))
    {
        EatApple();
    }
    //move each snakePos one forward
    for(let i=snakePos.length-1;i>0;i--)
    {
        snakePos[i] = snakePos[i-1];
    }
    snakePos[0] = nextPos;
}
function EatApple() : void
{
    //make snake longer
    snakePos.push(new Vector2Int(0,0));
    //Add new sprite to array
    snakeBodySprites.push(new PIXI.Sprite(snakeBodyTex));
    snakeBodySprites[snakeBodySprites.length-1].width = cellSize;
    snakeBodySprites[snakeBodySprites.length-1].height = cellSize;
    snakeBodySprites[snakeBodySprites.length-1].anchor.x = 0.5;
    snakeBodySprites[snakeBodySprites.length-1].anchor.y = 0.5;
    app.stage.addChild(snakeBodySprites[snakeBodySprites.length-1]);

    //Show score
    console.log("Ate apple!!");
    scoreUI.innerText = "SCORE : "+(snakePos.length-1);

    //move apple
    MoveApple();
}
function MoveApple()
{
    let isOnSnake : boolean = false;
    //test if the new random position is on the snake body, if so try again
    do 
    {
        //get new random position
        applePos = new Vector2Int(Math.round(Math.random()*(mapWidth-borderSize*2)),Math.round(Math.random()*(mapHeight-borderSize*2)));
        //test if is on snake
        for(let i=0;i<snakePos.length;i++)
        {
            if(applePos.x == snakePos[i].x && applePos.y == snakePos[i].y)
            {
                isOnSnake = true;
                break;
            }
        }   
    }
    while (isOnSnake);

    //reposition apple sprite
    apple.x = GridPosToScreenPos(applePos.x);
    apple.y = GridPosToScreenPos(applePos.y);
}
function DrawSnake() : void
{
    //position head
    snakeHead.x = GridPosToScreenPos(snakePos[0].x);
    snakeHead.y = GridPosToScreenPos(snakePos[0].y);
    //get rotation of head
    let rot : number;
    switch(direction)
    {
        case Directions.UP : rot = Math.PI; break;
        case Directions.RIGHT : rot = Math.PI*1.5;break;
        case Directions.DOWN : rot = 0;break;
        case Directions.LEFT : rot = Math.PI*0.5; break;       
    }
    snakeHead.rotation = rot;

    //place and rotate body pieces
    for(let i=1;i<snakePos.length;i++)
    {
        snakeBodySprites[i-1].x = GridPosToScreenPos(snakePos[i].x);
        snakeBodySprites[i-1].y = GridPosToScreenPos(snakePos[i].y);
        snakeBodySprites[i-1].rotation = GetRotation(snakePos[i],snakePos[i-1]);
        //if not the last position
        if(i != snakePos.length-1)
        {
            let backRot = GetRotation(snakePos[i+1],snakePos[i]);
            //if is a corner, if the angle isnt nearly equal to
            if(!NearlyEquals(backRot,snakeBodySprites[i-1].rotation))
            {
                snakeBodySprites[i-1].texture = snakeCornerTex;
                SetBodyCornerRotation(snakePos[i-1],snakePos[i+1], snakeBodySprites[i-1], snakePos[i]);
                continue;
            }
        }
        snakeBodySprites[i-1].texture = snakeBodyTex;
    }
    
    //Calculate the rotation and position of tail piece
    if(snakePos.length > 1) rot = GetRotation(snakePos[snakePos.length-1],snakePos[snakePos.length-2]);
    let xOffset : number = (rot==  Math.PI * 1.5) ? -1 : (rot == Math.PI * 0.5) ? 1 : 0;
    let yOffset : number = (rot == 0) ? -1 : (rot == Math.PI) ? 1 : 0;

    //Place and rotate tail piece
    snakeLast.rotation = rot;
    snakeLast.x = GridPosToScreenPos(snakePos[snakePos.length-1].x + xOffset);
    snakeLast.y = GridPosToScreenPos(snakePos[snakePos.length-1].y + yOffset);
}
function SetBodyCornerRotation(frontPos : Vector2Int, backPos : Vector2Int, sprite : PIXI.Sprite, spritePos : Vector2Int)
{
    if(frontPos.y > backPos.y)
    {
        if(frontPos.x > backPos.x) sprite.rotation = NearlyEquals(spritePos.x,frontPos.x) ? Math.PI*0.5: Math.PI*1.5; 
        else sprite.rotation = NearlyEquals(spritePos.x,frontPos.x) ? 0: Math.PI; 
    }
    else
    {
        if(frontPos.x > backPos.x) sprite.rotation = NearlyEquals(spritePos.x,frontPos.x) ? Math.PI: 0; 
        else sprite.rotation = NearlyEquals(spritePos.x,frontPos.x) ? Math.PI*1.5: Math.PI*0.5; 
    }
}
function GridPosToScreenPos(gridPos:number):number
{
    return (gridPos + borderSize) * cellSize;
}
function GetRotation(currentPos:Vector2Int , previousPos:Vector2Int) : number
{
    if(currentPos.x > previousPos.x) return Math.PI*0.5;
    if(currentPos.x < previousPos.x) return Math.PI*1.5;
    if(currentPos.y > previousPos.y) return Math.PI;
    return 0;
}
function GameOver() : void
{
    isAlive = false;
    let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "red",
        stroke: '#ff3300',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
      });
    gameOverMessage = new PIXI.Text("GAME OVER!",style);
    gameOverMessage.position.set(app.renderer.width/2,app.renderer.height/2);
    gameOverMessage.anchor.x = 0.5;
    gameOverMessage.anchor.y = 0.5;
    app.stage.addChild(gameOverMessage);
    console.log("GAME OVER!!");
}
function Restart() : void
{
    console.log("Restarting");
    app.stage.removeChild(gameOverMessage);
    snakePos = [new Vector2Int(Math.round(mapWidth/2),Math.round(mapHeight/2))]; 
    snakeBodySprites.forEach(sprite => {
        app.stage.removeChild(sprite);
    });
    snakeBodySprites = [];
    MoveApple();
    //Resize renderer for if changed
    app.renderer.resize(cellSize*mapWidth,cellSize*mapHeight);
    background.width = app.renderer.width;
    background.height = app.renderer.height;
    isAlive = true;
}

function NearlyEquals(posA : number, posB : number):boolean
{
    return Math.abs(posA - posB) < 0.1;
}
function NearlyEqualsVec2(posA : Vector2Int, posB : Vector2Int):boolean
{
    let x = Math.abs(posA.x - posB.x) < 0.1;
    let y = Math.abs(posA.y - posB.y) < 0.1;
    return (x && y);
}

//DATABASE stuff
import * as mysql from "mysql";

function SubmitHighscore(score : number) : boolean
{
    let connection = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "",
        database : "dgs_opdracht"
    });

    connection.connect();

    //get current highscores
    connection.query('SELECT score', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      });
    //if too low
    return false;
    //if in highscores find correct spot and replace all below
    return true;
}

