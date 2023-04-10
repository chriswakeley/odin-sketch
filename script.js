const DEFAULT_GRID_SIZE = 16;
const ALPHA_INCREASE = 0.1;

function updateGridCell(event) {

    let colorToAdd = document.querySelector(".rainbow-brush input").checked ?
                        [Math.random()*255, Math.random()*255, Math.random()*255, 1] : [0, 0, 0, 1];

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

        if(document.querySelector(".rainbow-brush input").checked){
            for(let i = 0; i < 3; i++){
                parts[i] = Math.min(255, Math.max(0, parseFloat(parts[i]) + colorToAdd[i]*ALPHA_INCREASE));
            }
        }
        else{
        //Modify color towards black
            for(let i = 0; i < 3; i++){
                parts[i] = Math.min(255, Math.max(0, parseFloat(parts[i]) - 255*ALPHA_INCREASE));
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

makeGrid(DEFAULT_GRID_SIZE);