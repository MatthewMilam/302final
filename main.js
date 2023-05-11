// This file holds the general code for the first game played, as well as setting up the buttons on the page
// to relate to Javascript functions.

// Singleplayer and 2 player versions imported from other files.
import TwoPlayerSuperballBoard from './2plameoball.js';
import SuperballBoard, * as boardFile from './lameoball.js';

let board = new SuperballBoard();

// Colors: White(1), Purple(2), Blue(3), Yellow(4), Red(5), Green(6)
// Gets the single cell in the HTML, then clones it to create the board
var cell = document.querySelector('.gridItemTemplate');
for (let i = 0; i < 80; i++) {
    board.boardAr[i] = 0;
    var clone = cell.cloneNode(true);
    clone.dataset.number = ((79 - i));
    cell.after(clone);
}
cell.remove();

// Create goal cells by adding the CSS class "gridGoal", making it circular
for(let i=20; i < 60; i++) {
    if(board.IsGoalCell(i)) {
      document.querySelector(`[data-number="${i}"]`).classList.add("gridGoal");
    }
}

// Shows the change game mode overlay
function ChangeGame() {
    let overlay = document.getElementById("ChangeGameButton");
    overlay.style.display = "flex";
    overlay.style.opacity = 1;
};


// Changes the overlay to show easy or hard options, and removes the single or two player overlay
function TwoPlayerFunction() {
    let difficultyOverlay = document.getElementById("ChangeDifficultyButton");
    difficultyOverlay.style.display = "flex";
    difficultyOverlay.style.opacity = 1;

    let overlay = document.getElementById("ChangeGameButton");
    overlay.style.display = "none";
    overlay.style.opacity = 0;
};

function SinglePlayerGoalCellsFunction() {
    for(let i=20; i < 60; i++) {
        if(board.IsGoalCell(i)) {
            document.querySelector(`[data-number="${i}"]`).style.borderWidth = "2px";
            document.querySelector(`[data-number="${i}"]`).style.borderColor = "black";
        }
    }
}

function TwoPlayerGoalCellsFunction() {
    for(let i=20; i < 60; i++) {
        if(board.IsLeftGoalCell(i)) {
            document.querySelector(`[data-number="${i}"]`).style.borderWidth = "6px";
            document.querySelector(`[data-number="${i}"]`).style.borderColor = "green";
        }
        if(board.IsRightGoalCell(i)) {
            document.querySelector(`[data-number="${i}"]`).style.borderWidth = "6px";
            document.querySelector(`[data-number="${i}"]`).style.borderColor = "red";
        }
    }
}

// Changes the board object to be two player easy by passing in 0, and also removes the overlay
function TPEasyFunction() {
    board = new TwoPlayerSuperballBoard(0);
    board.NewGame();
    TwoPlayerGoalCellsFunction();

    let overlay = document.getElementById("ChangeDifficultyButton");
    overlay.style.display = "none";
    overlay.style.opacity = 0;
}

// Changes the board object to be two player easy by passing in 1, and also removes the overlay
function TPHardFunction() {
    board = new TwoPlayerSuperballBoard(1);
    board.NewGame();
    TwoPlayerGoalCellsFunction();

    let overlay = document.getElementById("ChangeDifficultyButton");
    overlay.style.display = "none";
    overlay.style.opacity = 0;
}

// Changes the board object to be single player, and also removes the overlay
function SinglePlayerFunction() {
    board = new SuperballBoard();
    board.NewGame();
    SinglePlayerGoalCellsFunction();

    let overlay = document.getElementById("ChangeGameButton");
    overlay.style.display = "none";
    overlay.style.opacity = 0;
};

//Spawns the squares for the game when the user loads the page
board.SpawnSquares(); 

//Adds JavaScript event listeners which look for when the HTML button is clicked and execute code

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

document.addEventListener('DOMContentLoaded', () => {
    const TwoPlayerButton = document.getElementById('TPEasyButton');
    TwoPlayerButton.addEventListener('click', TPEasyFunction);
});

document.addEventListener('DOMContentLoaded', () => {
    const TwoPlayerButton = document.getElementById('TPHardButton');
    TwoPlayerButton.addEventListener('click', TPHardFunction);
});

// Other buttons
// Callback function to call the correct function depending on board, otherwise the event listeners
    //call on functions for only an individual single or double player board rather than a dynamic changing board
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

//Special buttons for each cell on the board, which also get the cell number using the HTML data-number custom attribute
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

