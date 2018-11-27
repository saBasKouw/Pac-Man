let background_image;
const backgroundWidth = 448;
const backgroundHeight = 496;
let spriteSheet;
let spriteData;


const tileSize = 16;
const speedMultiplier = 1;
const speed = 2*speedMultiplier;


const animationRightPac = [2, 1, 0];
const animationLeftPac = [2, 16, 15];
const animationUpPac = [2, 31, 30];
const animationDownPac = [2, 46, 45];
const pacManSprites = [animationRightPac, animationLeftPac, animationUpPac, animationDownPac];

const clydeSprites = [[60,61], [62,63], [64,65], [66,67]];
const pinkySprites = [[75, 76], [77,78], [79,80], [81,82]];

const PacMan = new MrPacMan(4*16, 20*16, 'right', speed, pacManSprites);
const Clyde = new MrPacMan(1*16, 1*16, 'right', speed, clydeSprites);
const Pinky = new MrPacMan(26*16, 1*16, 'left', speed, pinkySprites);
//
// const Mofo = new MrPacMan(26*16, 1*16, 'left', speed-1);
// const Peter = new MrPacMan(26*16, 29*16, 'left', speed-1);
// const John = new MrPacMan(1*16, 29*16, 'right', speed-1);

let timingSwitches = [true, true, true, true];

let beginTilePinky = [26, 1];




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
    for(let i = 0; i < backgroundHeight; i+=tileSize) {
        for(let j = 0; j < backgroundWidth; j+=tileSize) {
            stroke(100);
            noFill();
            rect(j, i, tileSize, tileSize);
        }
    }
}


function drawAllPaths(){
    let path = aStar(Mofo.isOnWhichTile(tileSize), PacMan.isOnWhichTile(tileSize));
    let path1 = aStar2(Clyde.isOnWhichTile(tileSize), PacMan.isOnWhichTile(tileSize));
    let path2 = aStar(Peter.isOnWhichTile(tileSize), PacMan.isOnWhichTile(tileSize));
    let path3 = aStar2(John.isOnWhichTile(tileSize), PacMan.isOnWhichTile(tileSize));
    drawPath(path, 'red');
    drawPath(path1, 'pink');
    drawPath(path2, 'red');
    drawPath(path3, 'pink');
    followPath(path, Mofo);
    followPath(path1, Clyde);
    followPath(path2, Peter);
    followPath(path3, John);
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
    if(frameCount % 7 === 0 && actor.direction !== 'still'){
        actor.animationCount++;
    } else if((actor.animationCount % actor.animation.length) === 0 && actor.direction === 'still'){
        actor.animationCount++;
        }
}


function drawSprite(actor) {
    whenJiggle(actor);
    image(actor.animation[actor.animationCount % actor.animation.length], actor.xCoordinate-3, actor.yCoordinate-3, 20, 20);

}


function imageToAnimation(actor, sprites, frames){
    actor.animation = [];
    for (let sprite of sprites){
        let position = frames[sprite].position;
        let img = spriteSheet.get(position.x, position.y, position.w, position.h);
        actor.animation.push(img);
    }

}


function animate(actor){
    let frames = spriteData.frames;
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
            if(mapArray[i/16][j/16] === 0 || mapArray[i/16][j/16] === 5){
                stroke(100);
                fill(255, 192, 203);
                rect(j+6, i+6, 4, 4);
            }
        }
    }
}


function eatFood(){
    if(PacMan.isOnGrid(tileSize)){
        mapArray[PacMan.yCoordinate/16][PacMan.xCoordinate/16] = 2;
    }
}


function countPoints(){
    let points = 0;
    for(let i = 0; i < mapArray.length; i++){
        for (let j = 0; j < mapArray[0].length; j++){
            if(mapArray[i][j] === 2){
                points += 10;
            }
        }
    }
    return points;
}



function getRandomTile(){
    let result = [floor(random(mapArray[0].length-1)), floor(random(mapArray.length-1))];
    while(mapArray[result[1]][result[0]] === 1){
        result = [floor(random(mapArray[0].length-1)), floor(random(mapArray.length-1))];
    } return result;
}


function clydeMoveStrategy(actor, frequency){
    if(frameCount % frequency === 0 && timingSwitches[0]){
        timingSwitches[0] = false;
        actor.endTile = getRandomTile();
        actor.speed = speed;
    } else if(frameCount % frequency === 0 && !timingSwitches[0]) {
        timingSwitches[0] = true;
        actor.speed = speed;
    } else if(timingSwitches[0]){
        actor.endTile = PacMan.isOnWhichTile(tileSize);
    }
    if(actor.locationIsSame(actor.endTile, tileSize)){
        actor.endTile = getRandomTile();
        timingSwitches[0] = false;
    }
    return aStar(actor.isOnWhichTile(tileSize), actor.endTile);
}

function pinkyMoveStrategy(actor, frequency){
    if(frameCount % frequency === 0 && timingSwitches[0]){
        timingSwitches[1] = false;
        actor.endTile = getRandomTile();
        actor.speed = speed;
    } else if(frameCount % frequency === 0 && !timingSwitches[0]) {
        timingSwitches[1] = true;
        actor.speed = speed;
    } else if(timingSwitches[1]){
        actor.endTile = PacMan.isOnWhichTile(tileSize);
    }
    if(actor.locationIsSame(actor.endTile, tileSize)){
        actor.endTile = getRandomTile();
        timingSwitches[1] = false;
    }
    return aStar(actor.isOnWhichTile(tileSize), actor.endTile);
}

// function pinkyMoveStrategy(actor, frequency){
//     if(frameCount % frequency === 0 && timingSwitches[1]){
//         timingSwitches[1] = false;
//         actor.endTile = beginTilePinky;
//         Pinky.speed = speed;
//     } else if(frameCount % frequency === 0 && !timingSwitches[1]) {
//         timingSwitches[1] = true;
//         Pinky.speed = speed;
//     } else if(timingSwitches[1]){
//         actor.endTile = PacMan.isOnWhichTile(tileSize);
//     }
//     if(Pinky.locationIsSame(actor.endTile, tileSize)){
//         actor.endTile = beginTilePinky;
//         timingSwitches[1] = false;
//     }
//     return aStar(Pinky.isOnWhichTile(tileSize), actor.endTile);
// }


function preload(){
    spriteData = loadJSON('img/sprite_frames.json');
    spriteSheet = loadImage('img/pacman_spritesheet.png');
}

function setup() {
    background_image = loadImage("img/map.jpg");
    createCanvas(backgroundWidth, backgroundHeight);
}


function draw() {
    background(background_image);
    drawFood();

    animate(PacMan);
    PacMan.act(mapArray, tileSize);

    animate(Clyde);
    Clyde.act(mapArray, tileSize);
    Clyde.path = clydeMoveStrategy(Clyde, 500/speedMultiplier);
    Clyde.followPath(mapArray, tileSize);


    animate(Pinky);
    Pinky.act(mapArray, tileSize);
    Pinky.path = pinkyMoveStrategy(Pinky, 500/speedMultiplier);
    Pinky.followPath(mapArray, tileSize);



    eatFood();



    // drawPath(path, 'red');

}