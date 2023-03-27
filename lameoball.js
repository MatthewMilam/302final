/* What to get done
1. Finish superball functions
   - add 5 different colors (get random color), function to select random color (rpbgy) MATTHEW
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

let boardAr = new Array(80);
let emptySet = [];
for(let i=0; i < 80; i++) {
    emptySet.push(i);
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
    if((i%10) == 0 | (i%10) == 1 | (i%10) == 8 | (i%10) == 9) {
        document.querySelector('#gridItem'+i).classList.add("gridGoal");
    }
}

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
        const intPos = Math.floor(Math.random() * (emptySet.length));
        const intPosNum = emptySet[intPos]; 
        document.querySelector('#gridItem' + intPosNum).style.backgroundColor = "red";
        emptySet.splice(intPos, 1);
        boardAr[intPosNum] = 5;
    }
}

function ClearBoard() {
    emptySet.length = 0;
    for(let i=0; i < 80; i++) {
        boardAr[i] = 0;
        emptySet.push(i);
        document.querySelector('#gridItem' + i).style.backgroundColor = "lightgray";
    }
}

SpawnSquares();
// Loop repeats every turn. Finds 5 random blank squares and makes them a random color. Takes in input from the user.
// console.log('#gridItem' + console.log(Math.floor(Math.random() * 80)));
// for(let i=0; i < 5; i++) {
//     SpawnSquares();
// }



function GameOver() {
        
}