class Map{
    constructor(map){
        this.map = map;
    }

    foodOnMap(){
        for(let i = 0; i < this.map[0].length; i++) {
            for(let j = 0; j < this.map.length; j++) {
                if(this.map[j][i] === 3){
                    this.map[j][i] = 0;
                } else if(this.map[j][i] === 7){
                    this.map[j][i] = 6;
                }
            }
        }
    }

    drawFood() {
        for(let i = 0; i < this.map[0].length; i++) {
            for(let j = 0; j < this.map.length; j++) {
                if(mapArray[j][i] === 0){
                    stroke(100);
                    fill(255, 192, 203);
                    rect(j+6, i+6, 4, 4);
                } else if(mapArray[j][i] === 6){
                    if(frameCount % 30 < 25 ){
                        stroke(100);
                        fill(255, 192, 203);
                        rect(j+2, i+2, 10, 10);
                    }
                }
            }
        }
    }

    countPoints(){
        let points = 0;
        for(let i = 0; i < this.map[0].length; i++){
            for (let j = 0; j < this.map.length; j++){
                if(this.map[j][i] === 3){
                    points += 10;
                } else if(this.map[j][i] === 6){
                    points += 100;
                }
            }
        }
        return points;
    }

    getRandomTile(){
        let result = [Math.floor(random(this.map[0].length-1)), Math.floor(this.map(mapArray.length-1))];
        while(mapArray[result[1]][result[0]] === 1){
            result = [Math.floor(this.map(mapArray[0].length-1)), Math.floor(this.map(mapArray.length-1))];
        } return result;
    }

    notInTunnel(actor){
        for(let tile of [[0,14], [1,14], [2,14], [3,14], [4,14], [23,14], [24,14], [25,14], [26,14], [27,14]]){
            if(actor.locationIsSame(tile,tileSize)){
                return false;
            }
        } return true;
    }

    ghostHouseTiles(){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 6; j++){
                for(let actor of [Blinky, Pinky, Clyde, Inky]){
                    if (actor.locationIsSame([11+j,13+i], tileSize)) {
                        return actor;
                    }
                }
            }
        }
    }

}