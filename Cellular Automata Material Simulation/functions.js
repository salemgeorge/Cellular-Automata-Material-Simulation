function updateAndDrawGridWorld() {
    for(let x = grid.length; x--;) {
        for(let y = grid[x].length; y--;) {
            if(!grid[x][y]) continue;

            bitToUpdate = grid[x][y];
            if(!bitToUpdate.shouldUpdateBit) {
                drawBit(x, y, grid[x][y].mat.color);
                continue;
            }

            let shouldUpdatePos = true;

            bitBelow = getBitFromGrid(x, y + 1);
            if(bitBelow || y >= 99) {
                shouldUpdatePos = false;
                bitToUpdate.shouldUpdateBit = false;
                // shouldTopple = Math.random() * Math.floor(10);
                // console.log(shouldTopple);

                drawBit(x, y, grid[x][y].mat.color)
                continue;
            } else {
                bitToUpdate.mat.currentUpdateProgress += bitToUpdate.mat.mass;

                if(shouldUpdatePos && bitToUpdate.mat.currentUpdateProgress >= bitToUpdate.mat.timeBetweenUpdate) {
                    bitToUpdate.mat.currentUpdateProgress = 0;
                    grid[x][y + 1] = grid[x][y];
                    grid[x][y] = null;

                    grid[x][y + 1].x = x;
                    grid[x][y + 1].y = y;

                    if(grid[x][y - 1]) grid[x][y - 1].shouldUpdateBit = true;
    
                    drawBit(x, y + 1, grid[x][y + 1].mat.color)
                    continue;
                } else {
                    drawBit(x, y, grid[x][y].mat.color);
                }
            }
        }
    }
}

function drawTestGrid() {
    for(let x = 0; x < grid.length; x++) {
        for(let y = 0; y < grid[x].length; y++) {
            if(grid[x][y]) {
                drawBit(x, y, 'black');
            }
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.strokeRect(x * 5,  y * 5, 5, 5);
        }
    }
}

function createBit(x, y, mat) {
    let shouldUpdateBit = true;
    grid[x][y] = {x, y, shouldUpdateBit, mat}
    // return {x, y, isFalling, mat};
}

function getGridIndexFromWorld(rawX, rawY) {
    gridIndexX = roundDown(rawX, 5) / 5;
    gridIndexY = roundDown(rawY, 5) / 5;

    // console.log(gridIndexX, gridIndexY);
    
    return {gridIndexX, gridIndexY};
}

function getBitFromGrid(x, y) {
    return grid[x][y];
}

function drawDebugBit() {
    bitCoords = getGridIndexFromWorld(mouseX, mouseY);

    // ctx.fillStyle = matList[currentSelectedMatIndex].color;
    // ctx.fillRect(bitCoords.gridIndexX * 5, bitCoords.gridIndexY * 5, 5, 5);
    drawBit(bitCoords.gridIndexX, bitCoords.gridIndexY, 'red')
}

function spawnBit(x, y, mat, spawnType) {
    if(grid[x][y]) return;

    switch(spawnType) {
        case 1:
            createBit(x, y, {...mat})
            // console.log({...newMat})
            break;
    }
}

function destroyBit(x, y) {
    if(grid[x][y]) grid[x][y] = null;
    if(grid[x][y - 1]) grid[x][y - 1].shouldUpdateBit = true;

}

function drawBit(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * 5, y * 5, 5, 5);
}