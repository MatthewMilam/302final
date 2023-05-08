// let boardAr = new Array(80);
// let filledSquares = 0;
// let mss = 5;
// let score = 0;
// let colorArray = ["silver", "darkorchid", "aqua", "yellow", "crimson", "chartreuse"];
// let scoreArray = [0, 2, 3, 4, 5, 6];
// let emptySet = [];
// for (let i = 0; i < 80; i++) {
//     emptySet[i] = i;
//     boardAr[i] = 0;
// }
//Call constructor for the board class
import TwoPlayerSuperballBoard from './2plameoball.js';
import SuperballBoard, * as boardFile from './lameoball.js'

let board = new SuperballBoard();
//let board = new TwoPlayerSuperballBoard();

// Colors: White(1), Purple(2), Blue(3), Yellow(4), Red(5), Green(6)
var elem = document.querySelector('.gridItemTemplate');
for (let i = 0; i < 80; i++) {
    board.boardAr[i] = 0;
    var clone = elem.cloneNode(true);
    clone.dataset.number = ((79 - i));
    elem.after(clone);
}
elem.remove();

//Create goal cells
for(let i=20; i < 60; i++) {
    if(board.IsGoalCell(i)) {
      //console.log(i)
      // console.log(document.querySelector(`[data-number="${i}"]`));
      document.querySelector(`[data-number="${i}"]`).classList.add("gridGoal");
    }
}

function ChangeGame() {
    let overlay = document.getElementById("ChangeGameButton");
    overlay.style.display = "flex";
    overlay.style.opacity = 1;
};


function SinglePlayerFunction() {
    console.log("Single Player");
    board = new SuperballBoard();
    board.NewGame();
    let overlay = document.getElementById("ChangeGameButton");
    overlay.style.display = "none";
    overlay.style.opacity = 0;
};

function TwoPlayerFunction() {
    console.log("Two Player");
    board = new TwoPlayerSuperballBoard();
    board.NewGame();
    let overlay = document.getElementById("ChangeGameButton");
    overlay.style.display = "none";
    overlay.style.opacity = 0;
};

board.SpawnSquares(); // spawns squares the first time // WHY IS THIS NEEDED? it should spawn squares in NewGame() but doens't...

//add buttons event listeners to call functions when clicked
//Swap Game Mode Functions
document.addEventListener('DOMContentLoaded', () => {
    const changeGameButton = document.getElementById('changeGameButton');
    changeGameButton.addEventListener('click', ChangeGame);
});

document.addEventListener('DOMContentLoaded', () => {
    const SinglePlayerButton = document.getElementById('SinglePlayerButton');
    SinglePlayerButton.addEventListener('click', SinglePlayerFunction);
});

document.addEventListener('DOMContentLoaded', () => {
    const TwoPlayerButton = document.getElementById('TwoPlayerButton');
    TwoPlayerButton.addEventListener('click', TwoPlayerFunction);
});

//Other buttons
function getBoardMethod(methodName) {
    return function() {
        board[methodName].apply(board, arguments);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const NewGameButton = document.getElementById('NewGameButton');
    NewGameButton.addEventListener('click', getBoardMethod('NewGame'));
});

document.addEventListener('DOMContentLoaded', () => {
    const TryAgainButton = document.getElementById('TryAgainButton');
    TryAgainButton.addEventListener('click', getBoardMethod('NewGame'));
});

document.addEventListener('DOMContentLoaded', () => {
    const SquareButtons = Array.from(document.getElementsByClassName('gridItemTemplate'));
    SquareButtons.forEach((element) => {
        element.addEventListener('click', (event) => {
            const dataNumber = element.getAttribute('data-number');
            getBoardMethod('SetSwap')(dataNumber);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const CollectButton = document.getElementById('CollectButton');
    CollectButton.addEventListener('click', getBoardMethod('Collect'));
});

// Main area - moved to main.js commenting out for now
// SpawnSquares(); // spawns squares the first 
// filledSquares += 5;