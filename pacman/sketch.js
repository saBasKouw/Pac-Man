p5.disableFriendlyErrors = true;


let background_image;
const backgroundWidth = 448;
const backgroundHeight = 496;
let spriteSheet;
let spriteData;
let frames;

const tileSize = 16;
let pacManSpeed = 2.2;
let spriteSpeed = 1.3;


const animationRightPac = [2, 1, 0];
const animationLeftPac = [2, 16, 15];
const animationUpPac = [2, 31, 30];
const animationDownPac = [2, 46, 45];
const pacManSprites = [animationRightPac, animationLeftPac, animationUpPac, animationDownPac];
const PacManDieSprites = [[3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]];

const scaredSprites = [[68, 69], [68,69], [68,69], [68,69]];

const scaredSpritesTwo = [[68, 69, 70, 71], [68, 69, 70, 71], [68, 69, 70, 71], [68, 69, 70, 71]];
const deadSprites = [[83], [84], [85],[86]];

const blinkySprites = [[60,61], [62,63], [64,65], [66,67]];
const pinkySprites = [[75, 76], [77,78], [79,80], [81,82]];
const inkySprites = [[90, 91], [92,93], [94,95], [96,97]];
const clydeSprites = [[105, 106], [107,108], [109,110], [111,112]];

let PacMan = new MrPacMan(14*16-8, 23*16, 'right', pacManSpeed, pacManSprites, [4, 20]);

let Blinky = new MrPacMan(26*16, 16, 'up', spriteSpeed, blinkySprites, [21, 5]);
let Clyde = new MrPacMan(16, 29*16, 'left', spriteSpeed, clydeSprites, [12, 29]);
let Pinky = new MrPacMan(16, 16, 'left', spriteSpeed, pinkySprites, [6, 5]);
let Inky = new MrPacMan(26*16, 29*16, 'right', spriteSpeed, inkySprites, [15, 29]);


let inkyStrategy = 'Clyde';
let counter = 0;
let scaredMode = false;
let countStrategy = 1000;
let ghost = {'Blinky': Blinky, 'Pinky': Pinky, 'Clyde': Clyde, 'Inky': Inky};

function foodOnMap(){
    for(let i = 0; i < mapArray[0].length; i++) {
        for(let j = 0; j < mapArray.length; j++) {
            if(mapArray[j][i] === 3){
                mapArray[j][i] = 0;
            } else if(mapArray[j][i] === 7){
                mapArray[j][i] = 6;
            }
        }
    }
}

function initializeGame(){
   PacMan = new MrPacMan(PacMan.isOnWhichTile(tileSize)[0]*16, PacMan.isOnWhichTile(tileSize)[1]*16, 'right', pacManSpeed, pacManSprites, [4, 20]);
   Blinky = new MrPacMan(26*16, 16, 'up', spriteSpeed, blinkySprites, [21, 5]);
   Clyde = new MrPacMan(16, 29*16, 'left', spriteSpeed, clydeSprites, [12, 29]);
   Pinky = new MrPacMan(16, 16, 'left', spriteSpeed, pinkySprites, [6, 5]);
   Inky = new MrPacMan(26*16, 29*16, 'right', spriteSpeed, inkySprites, [15, 29]);
   inkyStrategy = 'Clyde';
   foodOnMap();
   counter = 0;
    scaredMode = false;
    ghost = {'Blinky': Blinky, 'Pinky': Pinky, 'Clyde': Clyde, 'Inky': Inky};

    let countStrategy = 1000;

}




///////////////////////development tools
function drawPath(pathArray, color){
    if(color === 'red') {
        for (let tile of pathArray) {
            noStroke();
            fill(135, 206, 250, 100);
            rect(tile[0] * 16, tile[1] * 16, tileSize, tileSize);
        }
    } else if (color === 'pink') {
        for(let tile of pathArray){
            noStroke();
            fill(255,192,203,100);
            rect(tile[0]*16, tile[1]*16, tileSize, tileSize);
        }
    }
}

function createGrid() {
    for(let i = 0; i < backgroundHeight; i+=16) {
        for(let j = 0; j < backgroundWidth; j+=16) {
            stroke(100);
            noFill();
            rect(j, i, 16, 16);
        }
    }
}



function gridPointer(){
    for(let i = 0; i < backgroundHeight; i+=tileSize) {
        for(let j = 0; j < backgroundWidth; j+=tileSize) {
            if((mouseX > j && mouseX < j+tileSize) && (mouseY > i && mouseY < i+tileSize)){
                if(mouseIsPressed){
                    console.log(ceil(j / 16) + ',' + ceil(i / 16));
                }
                noStroke();
                fill(255,255,255,100);
                rect(j, i, tileSize, tileSize);
            }

        }
    }
}

///////////////////////////////////////



function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        PacMan.intention = 'right';
    } else if (keyCode === LEFT_ARROW) {
        PacMan.intention = 'left';
    } else if (keyCode === UP_ARROW) {
        PacMan.intention = 'up';
    } else if (keyCode === DOWN_ARROW) {
        PacMan.intention = 'down';
    }
}


function whenJiggle(actor){
    if(frameCount % 4 === 0 && actor.direction !== 'still'){
        actor.animationCount++;
    } else if((actor.animationCount % actor.animation.length) === 0 && actor.direction === 'still'){
        actor.animationCount++;
        }
}


function drawSprite(actor) {
    whenJiggle(actor);
    image(actor.animation[actor.animationCount % actor.animation.length], actor.xCoordinate-5, actor.yCoordinate-5, 28, 28);

}


function imageToAnimation(actor, sprites, frames){
    actor.animation = [];
    for (let sprite of sprites){
        let position = frames[sprite].position;
        let img = spriteSheet.get(position.x, position.y, position.w+2, position.h+2);
        actor.animation.push(img);
    }

}

function animateDeath(){
    imageToAnimation(PacMan, PacManDieSprites[0], frames);
    if(frameCount % 7 === 0){
        PacMan.animationCount++;
    }
    image(PacMan.animation[PacMan.animationCount % PacMan.animation.length], PacMan.xCoordinate-7, PacMan.yCoordinate-7, 32, 32);
    if(PacMan.animationCount % PacManDieSprites[0].length === 0){
        PacMan.alive = true;
        PacMan.xCoordinate = 14*16-8;
        PacMan.yCoordinate = 23*16;
        initializeGame();
    }
}


function animate(actor){
    if(actor.direction === 'right'){
        imageToAnimation(actor, actor.sprites[0], frames);
    } else if(actor.direction === 'left'){
        imageToAnimation(actor, actor.sprites[1], frames);
    } else if(actor.direction === 'up'){
        imageToAnimation(actor, actor.sprites[2], frames);
    } else if(actor.direction === 'down'){
        imageToAnimation(actor, actor.sprites[3], frames);
    } drawSprite(actor);
}


function drawFood() {
    for(let i = 0; i < backgroundHeight; i+=tileSize) {
        for(let j = 0; j < backgroundWidth; j+=tileSize) {
            if(mapArray[i/16][j/16] === 0){
                stroke(100);
                fill(255, 192, 203);
                rect(j+6, i+6, 4, 4);
            } else if(mapArray[i/16][j/16] === 6){
                if(frameCount % 30 < 25 ){
                    stroke(100);
                    fill(255, 192, 203);
                    rect(j+2, i+2, 10, 10);
                }
            }
        }
    }
}




function eatFood(){
    if(PacMan.isOnGrid(tileSize)){
        let tile = PacMan.isOnWhichTile(tileSize);
        if(mapArray[tile[1]][tile[0]] === 0){
            mapArray[tile[1]][tile[0]] = 3;
        } else if(mapArray[tile[1]][tile[0]] === 6){
            mapArray[tile[1]][tile[0]] = 7;
            console.log('death');
            scaredMode = true;
            counter = 0;

        }
    }
}


function countPoints(){
    let points = 0;
    for(let i = 0; i < mapArray.length; i++){
        for (let j = 0; j < mapArray[0].length; j++){
            if(mapArray[i][j] === 3){
                points += 10;
            } else if(mapArray[i][j] === 6){
                points += 100;
            }
        }
    } return points;
}



function getRandomTile(){
    let result = [Math.floor(random(mapArray[0].length-1)), Math.floor(random(mapArray.length-1))];
    while(mapArray[result[1]][result[0]] === 1){
        result = [Math.floor(random(mapArray[0].length-1)), Math.floor(random(mapArray.length-1))];
    } return result;
}

function getTileInFront(){
    let result = [];
    if(PacMan.direction === 'right'){
        result = [PacMan.isOnWhichTile(tileSize)[0]+2, PacMan.isOnWhichTile(tileSize)[1]];
    } else if(PacMan.direction === 'left') {
        result = [PacMan.isOnWhichTile(tileSize)[0]-2, PacMan.isOnWhichTile(tileSize)[1]];
    } else if(PacMan.direction === 'up') {
        result = [PacMan.isOnWhichTile(tileSize)[0]-2, PacMan.isOnWhichTile(tileSize)[1]+2];
    } else if(PacMan.direction === 'down') {
        result = [PacMan.isOnWhichTile(tileSize)[0], PacMan.isOnWhichTile(tileSize)[1]+2];
    } else if(PacMan.direction === 'still') {
        result = [PacMan.isOnWhichTile(tileSize)[0], PacMan.isOnWhichTile(tileSize)[1]];
    }
    if(result[1] < 0 || result[1] > 27 || result[0] < 0 || result[0] > 27 || mapArray[result[1]][result[0]] === 1){
        return PacMan.isOnWhichTile(tileSize);
    } else {
        return result;
    }
}


function toCornerAndPatrol(actor, corner, patrolScript){
    if(actor.strategy === 'toCorner'){
        actor.endTile = corner;
        if(actor.locationIsSame(actor.endTile, tileSize)){
            actor.strategy = 'patrol';
        }
    } else if(actor.strategy === 'patrol'){
        scriptedMovement(actor, patrolScript);
    }
}

function blinkyMoveStrategy(actor){
    actor.endTile = PacMan.isOnWhichTile(tileSize);
}

function clydeMoveStrategy(actor, corner, patrolScript){
    if (actor.distanceToOther(PacMan, tileSize) > 20 || PacMan.isOnWhichTile(tileSize)[0] < 14 && PacMan.isOnWhichTile(tileSize)[1] > 22) {
        actor.strategy = 'chase';
    } else if(actor.distanceToOther(PacMan, tileSize) < 8 && !(actor.strategy === 'patrol')){
        actor.strategy = 'toCorner';
    }
    if(actor.strategy === 'chase'){
        actor.endTile =  PacMan.isOnWhichTile(tileSize);
    } toCornerAndPatrol(actor, corner, patrolScript);
}

function pinkyMoveStrategy(actor){
    actor.endTile = getTileInFront();
}

function inkyMoveStrategy(actor){
    if(inkyStrategy === 'Blinky'){
        blinkyMoveStrategy(actor);
    } else if(inkyStrategy === 'Clyde'){
        clydeMoveStrategy(actor, [26, 29], [[26,29], [15,29], [21,23], [26,26], [26,29]]);
    } else if(inkyStrategy === 'Pinky'){
        pinkyMoveStrategy(actor);
    }
}


function onIntersection(actor){
    let surroundings = actor.surroundingTiles(mapArray, tileSize);
    return (surroundings[0] !== 1 && surroundings[1] !== 1 || surroundings[2] !== 1 && surroundings[3] !== 1);
}

///////////////////////////////
function scaredModeStrategy(){
    for(let actor of Object.entries(ghost)){
        actor[1].sprites = scaredSprites;
        if(onIntersection(actor[1])){
            actor[1].endTile = getRandomTile();
            onIntersection(actor[1]);
        }
        actor[1].alive = false;
    }
}

function allToCornerPatrol(){
    toCornerAndPatrol(Blinky, [26, 1], [[26,1], [21,5], [26,1]]);
    toCornerAndPatrol(Clyde, [1, 29], [[1,29], [12,29], [6,23], [1,26], [1,29]]);
    toCornerAndPatrol(Pinky, [1,1], [[1,1], [6,5], [1,1]]);
    toCornerAndPatrol(Inky, [26, 29], [[26,29], [15,29], [21,23], [26,26], [26,29]]);
}

function toCornerMode(){
    Blinky.strategy = 'toCorner';
    Pinky.strategy = 'toCorner';
    Clyde.strategy = 'toCorner';
    Inky.strategy = 'toCorner';
    Blinky.sprites = blinkySprites;
    Clyde.sprites = clydeSprites;
    Pinky.sprites = pinkySprites;
    Inky.sprites = inkySprites;
}


function scriptedMovement(actor, tileArray){
    for(let i = 0; i < tileArray.length-1; i++){
        if(actor.locationIsSame(tileArray[i], tileSize)) {
            actor.endTile = tileArray[i + 1];
        }
    }
}



function notInTunnel(actor){
    for(let tile of [[0,14], [1,14], [2,14], [3,14], [4,14], [23,14], [24,14], [25,14], [26,14], [27,14]]){
        if(actor.locationIsSame(tile,tileSize)){
            return false;
        }
    } return true;
}

function followPac(actor){
    if(notInTunnel(actor)) {
        actor.followPath(mapArray, tileSize);
    }
}

function PacManDies(){
    return (PacMan.collisionWithOther(Blinky, tileSize) ||
        PacMan.collisionWithOther(Pinky, tileSize) ||
        PacMan.collisionWithOther(Clyde, tileSize) ||
        PacMan.collisionWithOther(Inky, tileSize));
}

function collisionWithWho(){
    return [PacMan.collisionWithOther(Blinky, tileSize),
        PacMan.collisionWithOther(Pinky, tileSize),
        PacMan.collisionWithOther(Clyde, tileSize),
        PacMan.collisionWithOther(Inky, tileSize)];
}


function collisionDeathly(){
    let collisions = collisionWithWho();
    if(collisions[0] && Blinky.alive){
        return true;
    } else if(collisions[1] && Pinky.alive){
        return true;
    } else if(collisions[2] && Clyde.alive){
        return true;
    } else {
        return (collisions[3] && Inky.alive)
    }
}

function collisionEatable(){
    let collisions = collisionWithWho();
    if(collisions[0] && !Blinky.alive){
        return 'Blinky';
    } else if(collisions[1] && !Pinky.alive){
        return 'Pinky';
    } else if(collisions[2] && !Clyde.alive){
        return 'Clyde';
    } else if(collisions[3] && !Inky.alive){
        return 'Inky';
    } else {
        return false;
    }
}


function ghostDeath() {
    if(collisionEatable() === 'Blinky'){
        Blinky.sprites = deadSprites;
        delete ghost['Blinky'];
        Blinky.endTile = [13, 14];
        Blinky.speed = 3;
    } else if(collisionEatable() === 'Pinky') {
        Pinky.sprites = deadSprites;
        delete ghost['Pinky'];
        Pinky.endTile = [13, 14];
        Pinky.speed = 3;
    } else if(collisionEatable() === 'Clyde') {
        Clyde.sprites = deadSprites;
        delete ghost['Clyde'];
        Clyde.endTile = [13, 14];
        Clyde.speed = 3;
    } else if(collisionEatable() === 'Inky') {
        Inky.sprites = deadSprites;
        delete ghost['Inky'];
        Inky.endTile = [13, 14];
        Inky.speed = 3;
    }
}


function inGhostHouse(actor){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 6; j++){
            if (actor.locationIsSame([11+j,13+i], tileSize)) {
                return true;
            }
        }
    } return false;
}

function whichGhostInHouse(){
    let result = [];
    for(let actor of [Blinky, Pinky, Clyde, Inky]){
        result.push(inGhostHouse(actor));
    } return result;
}

function whenInHouse(){
    let whichActors = whichGhostInHouse();
    for(let i = 0; i < whichActors.length; i++){
        if(whichActors[i] && i === 0){
          Blinky.speed = 0.8;
          Blinky.sprites = blinkySprites;
        } else if(whichActors[i] && i === 1){
            Pinky.speed = 0.8;
            Pinky.sprites = pinkySprites;
        } else if(whichActors[i] && i === 2){
            Clyde.speed = 0.8;
            Clyde.sprites = clydeSprites;
        } else if(whichActors[i] && i === 3){
            Inky.speed = 0.8;
            Inky.sprites = inkySprites;
        }
    }
}

function onlyZombies(){
    for(let actor of Object.entries(ghost)){
        actor[1].speed = 0.8;
        if(counter > 300){
            actor[1].sprites = scaredSpritesTwo;
        }
    }
}


function givePaths(){
    for(let actor of [Blinky, Pinky, Clyde, Inky]){
        actor.path = aStar(actor.isOnWhichTile(tileSize), actor.endTile, actor);
    }
}

function ghostStrategies(){
    if(scaredMode){
        scaredModeStrategy();
        countStrategy = 500;
        ghostDeath();
        whenInHouse();
        onlyZombies();

    } else if(counter < 500){
        allToCornerPatrol();
    } else if(counter < countStrategy) {
        blinkyMoveStrategy(Blinky);
        clydeMoveStrategy(Clyde, [1, 29], [[1,29], [12,29], [6,23], [1,26], [1,29]]);
        pinkyMoveStrategy(Pinky);
        inkyMoveStrategy(Inky);
    }
    if(counter === countStrategy){
        counter = 0;
        scaredMode = false;
        countStrategy = 1000;
        for(let actor of [Blinky, Pinky, Clyde, Inky]){
            actor.alive = true;
            actor.speed = 1.3;
            ghost = {'Blinky': Blinky, 'Pinky': Pinky, 'Clyde': Clyde, 'Inky': Inky};
        }

        inkyStrategy = random(['Blinky', 'Clyde', 'Pinky']);
        toCornerMode();
    }
    counter++;
    givePaths();
}



function actAll(){
    drawFood();
    animate(PacMan);
    PacMan.act(mapArray, tileSize);
    for(let actor of [Blinky, Pinky, Clyde, Inky]){
        animate(actor);
        actor.act(mapArray, tileSize);
        followPac(actor);
    }
    ghostStrategies();
    eatFood();
}


function preload(){
    spriteData = loadJSON('img/sprite_frames.json');
    spriteSheet = loadImage('img/imageedit_1_2356716189.png');
}

function setup() {
    background_image = loadImage("img/map.jpg");
    createCanvas(backgroundWidth, backgroundHeight);
    frameRate(60);
    frames = spriteData.frames;
}

function draw() {

        if(collisionDeathly()){
            PacMan.alive = false;
        }
        background(background_image);
        if(PacMan.alive){
            actAll();

        } else {
            animateDeath();
        }
    // drawPath(Blinky.path, 'red');
    // createGrid();
    // gridPointer();
}

