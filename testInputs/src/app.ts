import { WorldBuilder } from "./DesignPatterns/Strategy/WorldBuilder";
import { PerlinNoise } from  "./DesignPatterns/Strategy/PerlinNoise";
import { NoiseFactory} from "./DesignPatterns/Factory/NoiseFactory";
import { BulletPool } from "./DesignPatterns/ObjectPool/BulletPool";
import { ApartmentBuilder } from "~DesignPatterns/Builder/Builder";

import * as PIXI from 'pixi.js';
import { workerData } from "worker_threads";
import { Console } from "console";
const backgroundImg = require('./Images/dungeon.png');
const appleImg = require('./Images/Apple.png');
const snakeHeadImg = require('./Images/SnakeHead.png');
const snakeBodyImg = require('./Images/SnakeBody.png');
const snakeCornerImg = require('./Images/SnakeCorner.png');
const snakeLastImg = require('./Images/SnakeLast.png');

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



//Snake code below VVV

//Game setting variables
let tickSpeed = 0.3;
let cellSize = 32
let mapWidth = 20; //border is 2 thick voor each side
let mapHeight = 20; //border is 2 thick voor each side
//Game variables
let timeSinceLastTick = 0;
let bodySprites : PIXI.Sprite[] = [];
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
let snakePos : Vector2Int[] = [new Vector2Int(Math.round(Math.random()*(mapWidth-6)+1),Math.round(Math.random()*(mapHeight-6)+1))]; //[new Vector2Int(Math.round(mapWidth/2),Math.round(mapHeight/2))];
let applePos : Vector2Int = new Vector2Int(0,0);


//Setup PIXI screen
const app = new PIXI.Application({
    width : cellSize*mapWidth,
    height : cellSize*mapHeight
});
document.body.appendChild(app.view);

//Setup vars
let snakeHead: PIXI.Sprite, apple : PIXI.Sprite, snakeLast : PIXI.Sprite;
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
    const background = new PIXI.Sprite(resources.background.texture);
    
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
        }
    }
    //Check for out of bounds
    if(nextPos.x < 0 || nextPos.y < 0 || nextPos.x > mapWidth - 4 || nextPos.y > mapHeight -4)
    {
        GameOver();        
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
    do 
    {
        //get new random position
        applePos = new Vector2Int(Math.round(Math.random()*(mapWidth-6)+1),Math.round(Math.random()*(mapHeight-6)+1));
        //test if the new position is on the snake body, if so try again
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
    snakeHead.x = GridPosToScreenPos(snakePos[0].x);
    snakeHead.y = GridPosToScreenPos(snakePos[0].y);
    let rot : number;
    switch(direction)
    {
        case Directions.UP : rot = Math.PI; break;
        case Directions.RIGHT : rot = Math.PI*1.5;break;
        case Directions.DOWN : rot = 0;break;
        case Directions.LEFT : rot = Math.PI*0.5; break;       
    }
    snakeHead.rotation = rot;

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

    //TODO Place and rotate last body piece to old head position
    

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
    return (gridPos + 2) * cellSize;
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
    console.log("GAME OVER!!");
    tickSpeed = 1000000;
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

