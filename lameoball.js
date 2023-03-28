/* What to get done
1. Finish superball functions
   - add 5 different colors (get random color), function to select random color (rpbgy) MATTHEW (done)
   - Swapping fix (shouldn't be able to swap any non-colored squares) BRYCE
   - fix collect button to hold a collect function - make collect have to be called on goal cell. MATTHEW
   - make collect reset the first swap (so you cant swap, collect and swap) BRYCE
   - add inability to swap same color. MATTHEW
2. Disjoint sets
   - Adding disjoint sets
   - Actually using disjoint sets in functions.
   - Scoring function, (related) is ending the game when no swaps / scores possible.
3. Invent 2 player version
3.5 Actually code the 2 player version
4. Ai easy
5. Ai hard
*/

/*
Due Dates:


*/

// File holding logic for lame-o-ball game


// Initialize global variables
let boardAr = new Array(80);
let filledSquares = 0;
let mss = 5;
let score = 0;
let colorArray = ["gainsboro", "crimson", "aqua", "chartreuse", "yellow", "darkorchid"];
let emptySet = [];
for (let i = 0; i < 80; i++) {
    emptySet[i] = i;
}



// Global variables for swap function.
let firstSquare = -1;
let secondSquare = -1;

// Colors: White(1), Purple(2), Blue(3), Yellow(4), Red(5), Green(6)
var elem = document.querySelector('#gridItemTemplate');
for (let i = 0; i < 80; i++) {
    boardAr[i] = 0;
    var clone = elem.cloneNode(true);
    clone.id = ('gridItem' + (79 - i ));
    elem.after(clone);
}
elem.remove();

//Create goal cells
for(let i=20; i < 60; i++) {
    if(IsGoalCell(i)) {
        document.querySelector('#gridItem'+i).classList.add("gridGoal");
    }
}


// End of global variabels

function SwapSquares(firstSquareInput, secondSquareInput) {
    let tempSetting = document.querySelector('#gridItem' + firstSquareInput).style.backgroundColor;
    document.querySelector('#gridItem' + firstSquareInput).style.backgroundColor = document.querySelector('#gridItem' + secondSquareInput).style.backgroundColor;
    document.querySelector('#gridItem' + secondSquareInput).style.backgroundColor = tempSetting;
}

function SetSwap(id) {
    if(firstSquare == -1 && secondSquare == -1) {
        console.log(id.length == 10);
        if(id.length == 10) {
            firstSquare = id.slice(-2);
        }
        else {
            firstSquare = id.slice(-1);
            console.log(firstSquare)
        }
        document.querySelector('#gridItem' + firstSquare).classList.add("highlightedItem");
    }
    else if(secondSquare == -1) {
        if(id.length == 10) {
            secondSquare = id.slice(-2);
        }
        else {
            secondSquare = id.slice(-1);
        }
        SwapSquares(firstSquare, secondSquare);
        firstSquare = -1;
        secondSquare = -1;
    }
    else {
        console.log("you shouldn't be here");
    }
}



function SpawnSquares() {
    for(let i=0;i < 5; i++) {
        const intPos = Math.floor(Math.random() * emptySet.length);
        const randomColor = Math.floor(Math.random() * 5) + 1;
        console.log(randomColor);
        document.querySelector('#gridItem' + emptySet[intPos]).style.backgroundColor = colorArray[randomColor];
        // emptySet.splice(intPos, 1);
        boardAr[emptySet[intPos]] = randomColor;
        // TODO: remove intPos indexed element from emptySet array
    
    }

    firstSqure = -1;
}

function NewGame() {
    emptySet.length = 0;
    for(let i=0; i < 80; i++) {
        boardAr[i] = 0;
        emptySet.push(i);
        document.querySelector('#gridItem' + i).style.backgroundColor = "lightgray";
    }
    
    SpawnSquares();
}

function Collect() {
    if (firstSquare > -1 && true /* also add check for disjoint set size >= mss*/ && IsGoalCell(firstSquare)) { // calls collect
        // Requires disjoint set
        firstSquare = -1;
    }
    else if (firstSquare == -1){
        
    }
    else if (false /*check disjoint set size*/) {

    }
    else if (!IsGoalCell(firstSquare)) {

    }

    // TODO: decrement filledSquares by how big the disjoint set was.
    // TODO: increment score
}

function IsGoalCell(int) {
    if((int%10) == 0 | (int%10) == 1 | (int%10) == 8 | (int%10) == 9) {
        return true;
    }
    return false;
}

function GameOver() {
        
}

// Main area
SpawnSquares(); // spawns squares the first 
filledSquares += 5;