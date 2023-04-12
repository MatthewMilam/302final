// let boardAr = new Array(80);
// let filledSquares = 0;
// let mss = 5;
// let score = 0;
// let colorArray = ["gainsboro", "darkorchid", "aqua", "yellow", "crimson", "chartreuse"];
// let scoreArray = [0, 2, 3, 4, 5, 6];
// let emptySet = [];
// for (let i = 0; i < 80; i++) {
//     emptySet[i] = i;
//     boardAr[i] = 0;
// }
//Call constructor for the board class
import SuperballBoard, * as boardFile from './lameoball.js'
let board = new SuperballBoard();

let firstSquare = -1;
let secondSquare = -1;

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
      console.log(i)
      // console.log(document.querySelector(`[data-number="${i}"]`));
      document.querySelector(`[data-number="${i}"]`).classList.add("gridGoal");
    }
}


board.SpawnSquares(); // spawns squares the first 
board.filledSquares += 5;

//add buttons event listeners to call functions when clicked
document.addEventListener('DOMContentLoaded', () => {
    const SpawnSquaresButton = document.getElementById('SpawnSquaresButton');
    SpawnSquaresButton.addEventListener('click', board.SpawnSquares.bind(board));
});

document.addEventListener('DOMContentLoaded', () => {
    const NewGameButton = document.getElementById('NewGameButton');
    NewGameButton.addEventListener('click', board.NewGame.bind(board));
});

document.addEventListener('DOMContentLoaded', () => {
    const SquareButtons = Array.from(document.getElementsByClassName('gridItemTemplate'));
    SquareButtons.forEach((element) => {
        element.addEventListener('click', (event) => {
            const dataNumber = element.getAttribute('data-number');
            board.SetSwap(dataNumber);

        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const CollectButton = document.getElementById('CollectButton');
    CollectButton.addEventListener('click', board.Collect.bind(board));
});


//Disjoint set code
import DisjSet from './disjoint.js';

const disjointSet = new DisjSet(80);
disjointSet.Union(0, 2);
disjointSet.Union(4, 2);
disjointSet.Union(3, 1);
 
if (disjointSet.find(4) === disjointSet.find(0)) {
  console.log("Yes");
} else {
  console.log("No");
}
if (disjointSet.find(1) === disjointSet.find(0)) {
  console.log("Yes");
} else {
  console.log("No");
}




// Main area - moved to main.js commenting out for now
// SpawnSquares(); // spawns squares the first 
// filledSquares += 5;