class Node{
    constructor(parent, tile){
        this.parent = parent;
        this.tile = tile;
        this.gScore = 0;
        this.hScore = 0;
        this.fScore = 0
    }

    isSame(otherNode){
        return (this.tile[0] === otherNode.tile[0]
            && this.tile[1] === otherNode.tile[1]);
    }


}