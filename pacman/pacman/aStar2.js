
function aStar2(start, goal){
    let startNode = new Node(null, start);
    let endNode  = new Node(null, goal);
    let openList = [];
    let closedList = [];

    openList.push(startNode);

    while(openList.length > 0){
        //Get the current node
        let currentNode = openList[0];
        let currentIndex = 0;

        for(let i = 0; i < openList.length;i++){
            if(openList[i].fScore < currentNode.fScore){
                currentNode = openList[i];
                currentIndex = i;
            }
        }
        //Pop current off open list, add to closed list
        openList.splice(currentIndex, 1);
        closedList.push(currentNode);
        // Found the goal
        if(currentNode.tile[0] === endNode.tile[0]
            && currentNode.tile[1] === endNode.tile[1]){
            let path = [];
            let current = currentNode;
            while(current !== null){
                path.push(current.tile);
                current = current.parent;
            }
            return path.reverse();
        }
        //    Generate CHildren
        let children = [];
        for (let newPosition of [[1, 0], [-1, 0], [0,1], [0,-1]]){
            let nodePosition = [currentNode.tile[0] + newPosition[0],
                currentNode.tile[1] + newPosition[1]];
            if(mapArray[nodePosition[1]][nodePosition[0]] === 1){
                continue;
            }

            let newNode = new Node(currentNode, nodePosition);
            children.push(newNode);
        }
        //    loop through children
        Loop1:
            for(let child of children) {

                for(let closedChild of closedList){
                    if(child.isSame(closedChild)){
                        continue Loop1;
                    }
                }
                child.gScore = currentNode.gScore + 1;
                child.hScore = Math.sqrt(Math.pow(child.tile[0]-endNode.tile[0],2) + Math.pow(child.tile[1]-endNode.tile[1],2));
                child.fScore = child.gScore + child.hScore;

                //    child is already in open list
                for(let openNode of openList){
                    if((child.isSame(openNode)) && child.gScore > openNode.gScore){
                        continue Loop1;
                    }
                }
                openList.push(child);
            }
    }
}