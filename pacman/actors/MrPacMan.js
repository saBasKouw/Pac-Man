class MrPacMan {
    constructor(xCoordinate, yCoordinate, direction, speed, sprites, endTile, cornerTiles) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.direction = direction;
        this.intention = direction;
        this.alive = true;
        this.speed = speed;
        this.initialSpeed = speed;
        this.sprites = sprites;
        this.initialSprites = sprites;
        this.animation = [];
        this.animationCount = 0;
        this.path = [];
        this.endTile = endTile;
        this.strategy = 'toCorner';
        this.scaredMode = false;
        this.zombieMode = false;
        this.cornerTiles = cornerTiles;

    }


    isOnWhichTile(tileSize){
        if(this.direction === 'right' || this.direction === 'down' || this.direction === 'still'){
            return [Math.ceil(this.xCoordinate/tileSize), Math.ceil(this.yCoordinate/tileSize)];
        } else if(this.direction === 'left' || this.direction === 'up'){
            return [Math.floor(this.xCoordinate/tileSize), Math.floor(this.yCoordinate/tileSize)];}
    }

    coversWhichTile(tileSize){
        let tile = this.isOnWhichTile(tileSize);
        return [1-(Math.abs(this.xCoordinate-tile[0]*tileSize)/ tileSize), 1-(Math.abs(this.yCoordinate-tile[1]*tileSize)/ tileSize)];
    }


    locationIsSame(otherTile, tileSize){
        let tile = this.isOnWhichTile(tileSize);
        return (tile[0] === otherTile[0] && tile[1] === otherTile[1]);}

    collisionWithOther(otherActor, tileSize){
        let tile = otherActor.isOnWhichTile(tileSize);
        return (this.locationIsSame(tile, tileSize));
    }

    indexOfSurroundings(mapArray, tileSize){
        let tile = this.isOnWhichTile(tileSize);
        return [[tile[0]+1, tile[1]], [tile[0]-1, tile[1]],
            [tile[0], tile[1]-1], [tile[0], tile[1]+1]];}


    surroundingTiles(mapArray, tileSize){
        let coordinates = this.indexOfSurroundings(mapArray, tileSize);
        return [mapArray[coordinates[0][1]][coordinates[0][0]], mapArray[coordinates[1][1]][coordinates[1][0]],
            mapArray[coordinates[2][1]][coordinates[2][0]], mapArray[coordinates[3][1]][coordinates[3][0]]];}


    tileDirection(mapArray, tileSize) {
        let surroundings = this.surroundingTiles(mapArray, tileSize);
        if(surroundings[0] === 1 && this.direction === 'right') {
            this.direction = 'still';
        } else if(surroundings[1] === 1 && this.direction === 'left') {
            this.direction = 'still';
        } else if(surroundings[2] === 1 && this.direction === 'up') {
            this.direction = 'still';
        } else if(surroundings[3] === 1 && this.direction === 'down') {
            this.direction = 'still';
        }
    }

    isOnGrid(tileSize){
        return (this.coversWhichTile(tileSize)[0] > 0.85 && this.coversWhichTile(tileSize)[1] > 0.85);
    }


    noCollision(mapArray, tileSize){
        let surroundings = this.surroundingTiles(mapArray, tileSize);
        if(this.intention === 'right' && surroundings[0] !== 1){
            return true;
        } else if(this.intention === 'left' && surroundings[1] !== 1) {
            return true;
        } else if(this.intention === 'up' && surroundings[2] !== 1) {
            return true;
        } else return (this.intention === 'down' && surroundings[3] !== 1 && (surroundings[3] !== 8 || this.zombieMode));
    }


    outOfBounds(mapArray, tileSize){
        let backgroundWidth = tileSize*mapArray[0].length;
        if(this.xCoordinate < -16) {
            this.xCoordinate = backgroundWidth;
        } else if(this.xCoordinate > backgroundWidth){
            this.xCoordinate = -16;
        }
    }

    isOutOfBounds(){
        return (this.xCoordinate <= 0 || this.xCoordinate >= backgroundWidth);
    }

    move(){
        if (this.direction === 'right'){
            this.xCoordinate += this.speed;
        } else if(this.direction === 'left' ){
            this.xCoordinate -=this.speed;
        } else if(this.direction === 'up'){
            this.yCoordinate -=this.speed;
        } else if(this.direction === 'down'){
            this.yCoordinate +=this.speed;
        }


    }


    act(mapArray, tileSize) {

        if(this.isOnGrid(tileSize)){
            this.xCoordinate = this.isOnWhichTile(tileSize)[0]*tileSize;
            this.yCoordinate = this.isOnWhichTile(tileSize)[1]*tileSize;
            this.tileDirection(mapArray, tileSize);
            if(this.noCollision(mapArray, tileSize) && !this.isOutOfBounds()){

                this.direction = this.intention;

            }
        }
        this.move();
        this.outOfBounds(mapArray, tileSize);

    }



    followPath(mapArray, tileSize) {
        let surroundings = this.indexOfSurroundings(mapArray, tileSize);
        if(this.path === undefined){
            this.intention = random(['right', 'left', 'up', 'down']);
            return;
        } else if(!this.scaredMode) {
            for (let node of this.path) {
                for (let i = 0; i < surroundings.length; i++) {
                    if (node[0] === surroundings[i][0] && node[1] === surroundings[i][1]) {
                        if (i === 0) {
                            this.intention = 'right';
                        } else if (i === 1) {
                            this.intention = 'left';
                        } else if (i === 2) {
                            this.intention = 'up';
                        } else if (i === 3) {
                            this.intention = 'down';
                        }
                    }
                }
            }
        }

    }


    distanceToOther(otherActor, tileSize){
        return Math.abs((this.isOnWhichTile(tileSize)[0]-otherActor.isOnWhichTile(tileSize)[0])) + Math.abs(this.isOnWhichTile(tileSize)[1]-otherActor.isOnWhichTile(tileSize)[1]);
    }
}

