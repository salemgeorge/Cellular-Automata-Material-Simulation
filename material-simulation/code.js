const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const sandSelector = document.getElementById('sandSelector')
const dirtSelector = document.getElementById('dirtSelector')
const smokeSelector = document.getElementById('smokeSelector')
const woodSelector = document.getElementById('woodSelector')

const spawnTypeSelector = document.getElementById('spawnType')

sandSelector.style.color = 'black'

dirtSelector.style.color = 'lightgray'
smokeSelector.style.color = 'lightgray'
woodSelector.style.color = 'lightgray'

let sandMat = {
    name: 'sandmat',
    currentOverlay: null,
    canBurn: false,
    mass: 50,
    toppleHeight: 1,
    isToppling: false,
    shouldRevaluateTopple: true,
    toppleDirection: 'left',
    hasGravity: true,
    timeBetweenUpdate: 150,
    currentUpdateProgress: 0,
    color: 'khaki'
}

let dirtMat = {
    name: 'dirtmat',
    currentOverlay: null,
    canBurn: false,
    mass: 90,
    toppleHeight: 2,
    isToppling: false,
    shouldRevaluateTopple: true,
    toppleDirection: 'left',
    hasGravity: true,
    timeBetweenUpdate: 100,
    currentUpdateProgress: 0,
    color: 'saddlebrown'
}

let smokeMat = {
    name: 'smokemat',
    canBurn: false,
    mass: 30,
    toppleHeight: 1,
    isToppling: true,
    shouldRevaluateTopple: true,
    toppleDirection: 'up',
    hasGravity: false,
    timeBetweenUpdate: 150,
    currentUpdateProgress: 0,
    color: 'slategray'
}

let woodMat = {
    name: 'woodmat',
    currentOverlay: null,
    canBurn: true,
    isBurning: false,
    burnTime: 5,
    currentBurnProgress: 0,
    mass: 95,
    toppleDirection: 'down',
    hasGravity: true,
    timeBetweenUpdate: 100,
    currentUpdateProgress: 0,
    color: '#CA6F1E'
}

let smokeOverlayMat = {
    name: 'smokeOverlay',
    canBurn: false,
    mass: 30,
    toppleDirection: 'up',
    hasGravity: false,
    timeBetweenUpdate: 150,
    currentUpdateProgress: 0,
    color: 'slategray'
}

let newMat = {}

let matList = [sandMat, dirtMat, smokeMat, woodMat]

let gridWorld = []

let shouldSpawnBit = false;

let mouseX = 0;
let mouseY = 0;

let currentSelectedMatIndex = 0;
let currentSpawnType = 1;

let roundDown = function(num, precision) {
    num = parseFloat(num);
    if(!precision) return num;
    return (Math.floor(num / precision) * precision);
}

function update() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    updateAndDrawGridWorld();
    drawDebugBit();
    // drawTestGrid();

    if(shouldSpawnBit) {
        bitCoords = getGridIndexFromWorld(mouseX, mouseY);
        spawnBit(bitCoords.gridIndexX, bitCoords.gridIndexY, {...sandMat})
    }
    // updateGridWorld()
    // drawGridWorld()

    window.requestAnimationFrame(update);
}

window.addEventListener('keydown', event => {
    if(event.key == 'ArrowDown') {
        if(currentSelectedMatIndex == matList.length - 1) return;
        currentSelectedMatIndex++;

        switch(currentSelectedMatIndex) {
            case 0:
                sandSelector.style.color = 'black'

                dirtSelector.style.color = 'lightgray'
                smokeSelector.style.color = 'lightgray'
                woodSelector.style.color = 'lightgray'
                break
            case 1:
                dirtSelector.style.color = 'black'

                sandSelector.style.color = 'lightgray'
                smokeSelector.style.color = 'lightgray'
                woodSelector.style.color = 'lightgray'
                break
            case 2:
                smokeSelector.style.color = 'black'

                sandSelector.style.color = 'lightgray'
                dirtSelector.style.color = 'lightgray'
                woodSelector.style.color = 'lightgray'
                break;
            case 3:
                woodSelector.style.color = 'black'

                sandSelector.style.color = 'blalightgrayck'
                dirtSelector.style.color = 'lightgray'
                smokeSelector.style.color = 'lightgray'
                break;
        }
        return;
    }

    if(event.key == 'ArrowUp') {
        if(currentSelectedMatIndex == 0) return;
        currentSelectedMatIndex--;

        switch(currentSelectedMatIndex) {
            case 0:
                sandSelector.style.color = 'black'

                dirtSelector.style.color = 'lightgray'
                smokeSelector.style.color = 'lightgray'
                woodSelector.style.color = 'lightgray'
                break
            case 1:
                dirtSelector.style.color = 'black'

                sandSelector.style.color = 'lightgray'
                smokeSelector.style.color = 'lightgray'
                woodSelector.style.color = 'lightgray'
                break
            case 2:
                smokeSelector.style.color = 'black'

                sandSelector.style.color = 'lightgray'
                dirtSelector.style.color = 'lightgray'
                woodSelector.style.color = 'lightgray'
                break;
            case 3:
                woodSelector.style.color = 'black'

                sandSelector.style.color = 'blalightgrayck'
                dirtSelector.style.color = 'lightgray'
                smokeSelector.style.color = 'lightgray'
                break;
        }
        return;
    }

    if(event.key == 'ArrowLeft') {
        if(currentSpawnType > 1) currentSpawnType--;
        else currentSpawnType = 2;

        if(currentSpawnType == 1) spawnTypeSelector.innerHTML = 'Spawn Type: Single Bit'
        else if(currentSpawnType == 2) spawnTypeSelector.innerHTML = 'Spawn Type: Multiple Bits'
        
        return;
    }

    if(event.key == 'ArrowRight') {
        if(currentSpawnType < 2) currentSpawnType++;
        else currentSpawnType = 1;

        if(currentSpawnType == 1) spawnTypeSelector.innerHTML = 'Spawn Type: Single Bit'
        else if(currentSpawnType == 2) spawnTypeSelector.innerHTML = 'Spawn Type: Multiple Bits'

        return;
    }

    if(event.key == ' ') {
        let coords = getGridIndexFromWorld(mouseX, mouseY)
        if(coords.gridIndexX + 10 > 99) return;
        spawnBit(coords.gridIndexX, bitCoords.gridIndexY, matList[currentSelectedMatIndex], currentSpawnType)
        return;
    }
});

window.addEventListener('mousemove', event => {
    mouseX = event.x - canvas.offsetLeft
    mouseY = event.y - canvas.offsetTop

    // mouseCoords = getGridIndexFromWorld(mouseX, mouseY);
    // console.log(mouseCoords);

    bitCoords = getGridIndexFromWorld(mouseX, mouseY);

    if(bitCoords.gridIndexX >= 0 && bitCoords.gridIndexX <= 99 && bitCoords.gridIndexY >= 0 && bitCoords.gridIndexY <= 99) {
        // if(currentSelectedMatIndex == 0) {
            spawnBit(bitCoords.gridIndexX, bitCoords.gridIndexY, matList[currentSelectedMatIndex], 1);
        // }
    }
   
    // console.log(mouseCoords.gridIndexX, mouseCoords.gridIndexY);
});

window.addEventListener('mousedown', event => {
    if(event.button == 0) {
        bitCoords = getGridIndexFromWorld(mouseX, mouseY);

        destroyBit(bitCoords.gridIndexX, bitCoords.gridIndexY)
    } else if(event.button == 2) {
        bitCoords = getGridIndexFromWorld(mouseX, mouseY);

        setBitOnFire(bitCoords.gridIndexX, bitCoords.gridIndexY)
    }

    // spawnBit(bitCoords.gridIndexX, bitCoords.gridIndexY, matList[currentSelectedMatIndex], 1);
    // shouldSpawnBit = true;
})

window.addEventListener('contextmenu', event => { 
    event.preventDefault(); 
}, false);

let grid = []
for(let x = 0; x < 100; x++) {
    grid[x] = [];
    for(let y = 0; y < 100; y++) {
        grid[x][y] = null;
    }
}
// console.log(grid);

update();

