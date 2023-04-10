const DEFAULT_GRID_SIZE = 16;
const ALPHA_INCREASE = 0.1;
const RAINBOW_INCREASE = 7;

const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
};

function generateNextRGBARainbow() {
    let nextHue = (+(document.querySelector(".canvas-container").dataset.lastHue) + RAINBOW_INCREASE)%360;
    document.querySelector(".canvas-container").dataset.lastHue = nextHue;
    const randomRGB = HSLToRGB(nextHue, 100, 50);
    randomRGB.push(1);
    return randomRGB;
}

function updateGridCell(event) {

    let colorToAdd = (document.querySelector(".rainbow-brush input").checked) ?
        generateNextRGBARainbow() :
        [0, 0, 0, 1];

    if (document.querySelector(".soft-brush input").checked) {

        const value = getComputedStyle(this).getPropertyValue("background-color");

        // Get all color components (alpha may not be there if = 1):
        const parts = value.match(/[\d.]+/g);

        // If alpha is not there, add it:
        if (parts.length === 3) {
            parts.push(1);
        }

        // Modify alpha:
        parts[3] = Math.min(1, Math.max(0, parseFloat(parts[3]) + ALPHA_INCREASE));

        //Blend color with random rainbow color
        if (document.querySelector(".rainbow-brush input").checked) {
            for (let i = 0; i < 3; i++) {
                parts[i] = Math.min(255, Math.max(0, parseFloat(parts[i]) + colorToAdd[i] * 2 * ALPHA_INCREASE));
            }
        }
        else {
            //Modify color towards black
            for (let i = 0; i < 3; i++) {
                parts[i] = Math.min(255, Math.max(0, parseFloat(parts[i]) - 255 * ALPHA_INCREASE));
            }
        }

        // Apply new value:
        this.style.backgroundColor = `rgba(${parts.join(',')})`;
    }
    else {
        this.style.backgroundColor = `rgba(${colorToAdd.join(',')})`;
    }
}

function makeGrid(gridSize) {
    const canvasContainer = document.querySelector(".canvas-container");
    const gridRows = [];
    for (let i = 0; i < gridSize; i++) {
        const gridRow = document.createElement('div');
        gridRow.classList.add("grid-row");
        for (let y = 0; y < gridSize; y++) {
            const gridCell = document.createElement('div');
            gridCell.classList.add("grid-cell");
            gridCell.addEventListener("mouseover", updateGridCell);
            gridRow.appendChild(gridCell);
        }
        gridRows.push(gridRow);
    }
    canvasContainer.replaceChildren(...gridRows);
}

function handleNewGrid() {
    let newGridSize = prompt("Please enter a new grid size, 1-100");
    if (newGridSize === null) {
        alert("New Grid Cancelled");
    }
    else if (+newGridSize < 1 || +newGridSize > 100 || +newGridSize % 1 !== 0) {
        alert("New Grid Cancelled, not a valid grid size, integer 1-100");
    }
    else {
        makeGrid(+newGridSize);
    }
}

document.querySelector(".reset-button").addEventListener("click", handleNewGrid);
makeGrid(DEFAULT_GRID_SIZE);