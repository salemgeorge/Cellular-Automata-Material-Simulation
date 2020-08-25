function updateAndDrawGridWorld() {
    if(gridWorld.length <= 0) return;
    console.log
    for(i = 0; i < gridWorld.length; i++) {
        shouldUpdatePos = true;

        gridWorld[i].mat.currentUpdateProgress += gridWorld[i].mat.mass;

        for(j = 0; j < gridWorld.length; j++) {
            if(gridWorld[i].x == gridWorld[j].x && gridWorld[i].y + 1 == gridWorld[j].y) {
                shouldUpdatePos = false;
            }
        }

        if(gridWorld[i].y < 99 && shouldUpdatePos) {
            shouldTopple = false;
            toppleDirection = 0;
            if(!shouldUpdatePos) {
                // if(Math.random() * Math.floor(10) * 10) {

                // }
            }

            if(gridWorld[i].mat.currentUpdateProgress >= gridWorld[i].mat.timeBetweenUpdate) {
                gridWorld[i].y++;
                gridWorld[i].mat.currentUpdateProgress = 0;
            }
        }

        ctx.fillStyle = gridWorld[i].mat.color;
        ctx.fillRect(gridWorld[i].x * 5, gridWorld[i].y * 5, 5, 5);
    }
}

function createBit(x, y, mat) {
    return {x, y, mat};
}

function getGridIndexFromWorld(rawX, rawY) {
    gridIndexX = roundDown(rawX, 5) / 5;
    gridIndexY = roundDown(rawY, 5) / 5;

    // console.log(gridIndexX, gridIndexY);
    
    return {gridIndexX, gridIndexY};
}

function drawDebugBit() {
    bitCoords = getGridIndexFromWorld(mouseX, mouseY);

    ctx.fillStyle = matList[currentSelectedMatIndex].color;
    ctx.fillRect(bitCoords.gridIndexX * 5, bitCoords.gridIndexY * 5, 5, 5)
}

function spawnBit(x, y, mat, spawnType) {
    let newMat = {...mat};

    switch(spawnType) {
        case 1:
            gridWorld.push(createBit(x, y, {...newMat}));
            break;
        case 2:
            //Bit Left
            gridWorld.push(createBit(x-1, y, {...newMat}));
            //Bit Right
            gridWorld.push(createBit(x+1, y, {...newMat}));
            //Bit Up
            gridWorld.push(createBit(x, y-1, {...newMat}));
            //Bit Down
            gridWorld.push(createBit(x, y+1, {...newMat}));
            //Bit Center
            gridWorld.push(createBit(x, y, {...newMat}));

            break;
    }

}