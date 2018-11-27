class MrPacMan {
    constructor(xCoordinate, yCoordinate, direction, speed, sprites, animation=[], animationCount=0, path=[], endTile=[], alive=true) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.direction = direction;
        this.intention = direction;
        this.alive = alive;
        this.speed = speed;
        this.sprites = sprites;
        this.animation = animation;
        this.animationCount = animationCount;
        this.path = path;
        this.endTile = endTile;

    }


    isOnWhichTile(tileSize){
        return [Math.ceil(this.xCoordinate/tileSize), Math.ceil(this.yCoordinate/tileSize)];}


    locationIsSame(otherTile, tileSize){
        let tile = this.isOnWhichTile(tileSize);
        return (tile[0] === otherTile[0] && tile[1] === otherTile[1]);}


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


    isOnGrid(tileSize) {
        return (this.xCoordinate % tileSize === 0 && this.yCoordinate % tileSize === 0);}


    noCollision(mapArray, tileSize){
        let surroundings = this.surroundingTiles(mapArray, tileSize);
        if(this.intention === 'right' && surroundings[0] !== 1){
            return true;
        } else if(this.intention === 'left' && surroundings[1] !== 1) {
            return true;
        } else if(this.intention === 'up' && surroundings[2] !== 1) {
            return true;
        } else return (this.intention === 'down' && surroundings[3] !== 1);
    }


    outOfBounds(mapArray, tileSize){
        let backgroundWidth = tileSize*mapArray[0].length;
        if(this.xCoordinate < -16) {
            this.xCoordinate = backgroundWidth;
        } else if(this.xCoordinate > backgroundWidth){
            this.xCoordinate = -16;
        }
    }

    isOutofBounds(){
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
            this.tileDirection(mapArray, tileSize);
            if(this.noCollision(mapArray, tileSize) && !this.isOutofBounds()){
                this.direction = this.intention;
            }
        }
        this.move();
        this.outOfBounds(mapArray, tileSize);

    }

    followPath(mapArray, tileSize) {
        let surroundings = this.indexOfSurroundings(mapArray, tileSize);
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