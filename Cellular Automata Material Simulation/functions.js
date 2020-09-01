// roundDown(Math.random() * 100, 1)
function updateAndDrawGridWorld() {
    for (let x = grid.length; x--;) {
        for (let y = grid[x].length; y--;) {
            if (!grid[x][y]) continue;

            bitToUpdate = grid[x][y];
            // if(!bitToUpdate.shouldUpdateBit) {
            //     drawBit(x, y, grid[x][y].mat.color);
            //     continue;
            // }

            bitBelow = getBitFromGrid(x, y + 1);
            if (bitToUpdate.mat.hasGravity && bitBelow || y >= 99) {

                if (bitBelow && bitToUpdate.y <= 99 - bitToUpdate.mat.toppleHeight) {
                    if (bitToUpdate.mat.name == 'dirtmat') {
                        handleHeightRestrictionPhysics(x, y)
                    } else if (bitToUpdate.mat.name == 'sandmat') {
                        handleSandPhysics(x, y)
                    }
                } else if (y >= 99) {
                    grid[x][y].mat.isToppling = false
                }

                if (grid[x][y].mat.isToppling) {
                    // grid[x][y].mat.currentUpdateProgress += grid[x][y].mat.mass
                    switch (grid[x][y].mat.toppleDirection) {
                        case 'left':
                            moveBit(x, y, 'left', bitToUpdate.mat.shouldRevaluateTopple)
                            drawBit(x - 1, y, bitToUpdate.mat.color)

                            continue;
                        case 'right':
                            moveBit(x, y, 'right', bitToUpdate.mat.shouldRevaluateTopple)
                            drawBit(x + 1, y, bitToUpdate.mat.color)

                            continue;
                        case 'up':
                            moveBit(x, y, 'up', bitToUpdate.mat.shouldRevaluateTopple)
                            drawBit(x, y - 1, bitToUpdate.mat.color)

                            continue;
                        case 'down':
                            moveBit(x, y, 'down', bitToUpdate.mat.shouldRevaluateTopple)
                            drawBit(x, y + 1, bitToUpdate.mat.color)

                            continue;
                    }

                    continue;
                }

                drawBit(x, y, bitToUpdate.mat.color)
                continue;

            } else if (!bitToUpdate.mat.hasGravity || y <= 0) {
                if (bitToUpdate.mat.name == 'smokemat') {
                    handleSmokePhysics(x, y)
                }
                if (y == 0) {
                    grid[x][y].mat.isToppling = false
                }

                switch (grid[x][y].mat.toppleDirection) {
                    case 'left':
                        moveBit(x, y, 'left', bitToUpdate.mat.shouldRevaluateTopple)
                        drawBit(x - 1, y, bitToUpdate.mat.color)

                        continue;
                    case 'right':
                        moveBit(x, y, 'right', bitToUpdate.mat.shouldRevaluateTopple)
                        drawBit(x + 1, y, bitToUpdate.mat.color)

                        continue;
                    case 'up':
                        moveBit(x, y, 'up', bitToUpdate.mat.shouldRevaluateTopple)
                        drawBit(x, y - 1, bitToUpdate.mat.color)

                        continue;
                    case 'down':
                        moveBit(x, y, 'down', bitToUpdate.mat.shouldRevaluateTopple)
                        drawBit(x, y + 1, bitToUpdate.mat.color)

                        continue;
                }

                drawBit(x, y, bitToUpdate.mat.color)
                continue;
            }

            bitToUpdate.mat.currentUpdateProgress += bitToUpdate.mat.mass;

            if (bitToUpdate.mat.currentUpdateProgress >= bitToUpdate.mat.timeBetweenUpdate) {
                if (bitToUpdate.mat.hasGravity) {
                    bitToUpdate.mat.currentUpdateProgress = 0;
                    grid[x][y + 1] = grid[x][y];
                    grid[x][y] = null;

                    grid[x][y + 1].x = x;
                    grid[x][y + 1].y = y;

                    // if (grid[x][y - 1]) grid[x][y - 1].shouldUpdateBit = true;

                    drawBit(x, y + 1, grid[x][y + 1].mat.color)
                    continue;
                } else {
                    console.log('is moving down')
                    bitToUpdate.mat.currentUpdateProgress = 0;
                    grid[x][y - 1] = grid[x][y];
                    grid[x][y] = null;

                    grid[x][y - 1].x = x;
                    grid[x][y - 1].y = y;

                    // if (grid[x][y - 1]) grid[x][y - 1].shouldUpdateBit = true;

                    drawBit(x, y - 1, grid[x][y - 1].mat.color)
                    continue;
                }
            } else {
                drawBit(x, y, grid[x][y].mat.color);
            }

        }
    }
}

function drawTestGrid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            if (grid[x][y]) {
                drawBit(x, y, 'black');
            }
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.strokeRect(x * 5, y * 5, 5, 5);
        }
    }
}

function createBit(x, y, mat) {
    let shouldUpdateBit = true;
    grid[x][y] = { x, y, shouldUpdateBit, mat }
    // return {x, y, isFalling, mat};
}

function getGridIndexFromWorld(rawX, rawY) {
    gridIndexX = roundDown(rawX, 5) / 5;
    gridIndexY = roundDown(rawY, 5) / 5;

    // console.log(gridIndexX, gridIndexY);

    return { gridIndexX, gridIndexY };
}

function getBitFromGrid(x, y) {

    if (x <= 99 && x >= 0) return grid[x][y];
    else return {}
}

function drawDebugBit() {
    bitCoords = getGridIndexFromWorld(mouseX, mouseY);

    // ctx.fillStyle = matList[currentSelectedMatIndex].color;
    // ctx.fillRect(bitCoords.gridIndexX * 5, bitCoords.gridIndexY * 5, 5, 5);
    drawBit(0, 0, 'red')
}

function spawnBit(x, y, mat, spawnType) {
    if (grid[x][y]) return;

    switch (spawnType) {
        case 1:
            createBit(x, y, { ...mat })
            // console.log({...newMat})
            break;
        case 2:
            for (let newX = x; newX < x + 10; newX++) {
                for (let newY = y; newY < y + 10; newY++) {
                    createBit(newX, newY, { ...mat })
                }
            }
            break;
    }
}

function destroyBit(x, y) {
    if (grid[x][y]) grid[x][y] = null;
    if (grid[x][y - 1]) grid[x][y - 1].shouldUpdateBit = true;
}

function drawBit(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * 5, y * 5, 5, 5);
}

function moveBit(x, y, direction, shouldStopToppling) {

    if (grid[x][y].mat.currentUpdateProgress < grid[x][y].mat.timeBetweenUpdate) {
        grid[x][y].mat.currentUpdateProgress += grid[x][y].mat.mass
        grid[x][y].shouldUpdateBit = true
        return;
    }
    else grid[x][y].mat.currentUpdateProgress = 0

    if (shouldStopToppling) grid[x][y].mat.isToppling = false;

    switch (direction) {
        case 'left':
            let bitLeft = getBitFromGrid(x - 1, y)

            if (!bitLeft && x != 0) {
                grid[x - 1][y] = grid[x][y]
                grid[x][y] = null;
            }
            break;
        case 'right':
            let bitRight = getBitFromGrid(x + 1, y)

            if (!bitRight && x + 1 <= 99) {
                grid[x + 1][y] = grid[x][y]
                grid[x][y] = null;
            }
            break;
        case 'up':
            let bitUp = getBitFromGrid(x, y - 1)

            if (!bitUp && y >= 2) {
                grid[x][y - 1] = grid[x][y]
                grid[x][y] = null
            }
            break;
        case 'down':
            let bitDown = getBitFromGrid(x, y + 1)

            if(!bitDown && y + 1 < 99) {
                grid[x][y + 1] = grid[x][y]
                grid[x][y] = null;
            }
            break;
    }
}

function handleHeightRestrictionPhysics(x, y) {
    let bitToUpdate = grid[x][y]

    bitLeftAndDown = getBitFromGrid(x - 1, y + bitToUpdate.mat.toppleHeight)
    bitRightAndDown = getBitFromGrid(x + 1, y + bitToUpdate.mat.toppleHeight)
    bitDownCenter = getBitFromGrid(x, y + bitToUpdate.mat.toppleHeight)

    if (!grid[x][y].mat.isToppling) {
        if (bitDownCenter) {
            if (!bitLeftAndDown && !bitRightAndDown) {
                coinflip = Math.random()
                if (coinflip < 0.5) {
                    grid[x][y].mat.isToppling = true
                    grid[x][y].mat.toppleDirection = 'left'
                } else {
                    grid[x][y].mat.isToppling = true
                    grid[x][y].mat.toppleDirection = 'right'
                }
            } else if (!bitLeftAndDown) {
                grid[x][y].mat.isToppling = true
                grid[x][y].mat.toppleDirection = 'left'
            }
            else if (!bitRightAndDown) {
                grid[x][y].mat.isToppling = true
                grid[x][y].mat.toppleDirection = 'right'
            }
        }
    }
    else {
        if (bitLeftAndDown || bitRightAndDown) {
            grid[x][y].mat.isToppling = false
        }
    }
}

function handleSandPhysics(x, y) {
    let bitToUpdate = grid[x][y]

    bitLeftAndDown = getBitFromGrid(x - 1, y + bitToUpdate.mat.toppleHeight)
    bitRightAndDown = getBitFromGrid(x + 1, y + bitToUpdate.mat.toppleHeight)

    if (!grid[x][y].mat.isToppling) {
        if (!bitLeftAndDown && !bitRightAndDown) {
            coinflip = Math.random()
            if (coinflip < 0.5) {
                grid[x][y].mat.isToppling = true
                grid[x][y].mat.toppleDirection = 'left'
            } else {
                grid[x][y].mat.isToppling = true
                grid[x][y].mat.toppleDirection = 'right'
            }
        } else if (!bitLeftAndDown) {
            grid[x][y].mat.isToppling = true
            grid[x][y].mat.toppleDirection = 'left'
        }
        else if (!bitRightAndDown) {
            grid[x][y].mat.isToppling = true
            grid[x][y].mat.toppleDirection = 'right'
        }
    } else {
        switch (grid[x][y].mat.toppleDirection) {
            case 'left':
                if (bitLeftAndDown) grid[x][y].mat.isToppling = false
                break;
            case 'right':
                if (bitRightAndDown) grid[x][y].mat.isToppling = false
                break;
        }
    }
}

function handleSmokePhysics(x, y) {
    grid[x][y].mat.toppleDirection = 'up'

    let bitUp = getBitFromGrid(x, y - 1)

    if(bitUp) {
        // console.log(bitUp)
        // grid[x][y].mat.isToppling = false
        // grid[x][y].mat.toppleDirection = 'up'
        let bitLeft = getBitFromGrid(x - 1, y)
        let bitRight = getBitFromGrid(x + 1, y)
        if(!bitLeft && !bitRight) {
            coinflip = Math.random()
            if (coinflip < 0.5) {
                grid[x][y].mat.toppleDirection = 'left'
            } else {
                grid[x][y].mat.toppleDirection = 'right'
            }
        } else if(!bitLeft && bitRight) {
            grid[x][y].mat.toppleDirection = 'left'
        } else {
            grid[x][y].mat.toppleDirection = 'right'
        }
    }

}