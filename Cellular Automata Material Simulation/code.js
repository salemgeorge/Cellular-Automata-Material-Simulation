const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let sandMat = {
    mass: 60,
    toppleChance: 50,
    timeBetweenUpdate: 150,
    currentUpdateProgress: 0,
    color: 'khaki'
}

let dirtMat = {
    mass: 90,
    maxStackHeight: 6,
    stackSupport: 1,
    timeBetweenUpdate: 100,
    currentUpdateProgress: 0,
    color: 'saddlebrown'
}

let newMat = {}

let matList = [sandMat, dirtMat]

let gridWorld = []

let shouldSpawnBit = false;

let mouseX = 0;
let mouseY = 0;

let currentSelectedMatIndex = 0;

let roundDown = function(num, precision) {
    num = parseFloat(num);
    if(!precision) return num;
    return (Math.floor(num / precision) * precision);
}

function update() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    drawDebugBit();
    updateAndDrawGridWorld();
    drawTestGrid();

    if(shouldSpawnBit) {
        bitCoords = getGridIndexFromWorld(mouseX, mouseY);
        spawnBit(bitCoords.gridIndexX, bitCoords.gridIndexY, {...sandMat})
    }
    // updateGridWorld()
    // drawGridWorld()

    window.requestAnimationFrame(update);
}

window.addEventListener('keydown', event => {
    if(event.key == 'ArrowRight') {
        if(currentSelectedMatIndex == matList.length - 1) return;
        currentSelectedMatIndex++;
        return;
    }

    if(event.key == 'ArrowLeft') {
        if(currentSelectedMatIndex == 0) return;
        currentSelectedMatIndex--;
        return;
    }
});

window.addEventListener('mousemove', event => {
    mouseX = event.x - canvas.offsetLeft
    mouseY = event.y - canvas.offsetTop;

    mouseCoords = getGridIndexFromWorld(mouseX, mouseY);

    bitCoords = getGridIndexFromWorld(mouseX, mouseY);

    spawnBit(bitCoords.gridIndexX, bitCoords.gridIndexY, matList[currentSelectedMatIndex],1);
    // console.log(mouseCoords.gridIndexX, mouseCoords.gridIndexY);
});

window.addEventListener('mousedown', event => {
    bitCoords = getGridIndexFromWorld(mouseX, mouseY);

    spawnBit(bitCoords.gridIndexX, bitCoords.gridIndexY, matList[currentSelectedMatIndex], 2);

    shouldSpawnBit = true;
})

let grid = []
for(let x = 0; x < 100; x++) {
    grid[x] = [];
    for(let y = 0; y < 100; y++) {
        grid[x][y] = null;
    }
}
console.log(grid);

update();

