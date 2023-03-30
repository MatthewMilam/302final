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



// // Global variables for swap function.
// let firstSquare = -1;
// let secondSquare = -1;

// // Colors: White(1), Purple(2), Blue(3), Yellow(4), Red(5), Green(6)
// var elem = document.querySelector('.gridItemTemplate');
// for (let i = 0; i < 80; i++) {
//     boardAr[i] = 0;
//     var clone = elem.cloneNode(true);
//     clone.id = ((79 - i));
//     elem.after(clone);
// }
// elem.remove();

// //Create goal cells
// for(let i=20; i < 60; i++) {
//     if(IsGoalCell(i)) {
//         document.getElementById(i).classList.add("gridGoal");
//     }
// }


// End of global variables
export default class SuperballBoard {
    constructor() {
        this.boardAr = [];
        this.emptySet = [];
        // this.boardAr = new Array(80);
        // this.emptySet = new Array(80);
        this.filledSquares = 0;
        this.mss = 5;
        this.score = 0;
        this.colorArray = ["gainsboro", "darkorchid", "aqua", "yellow", "crimson", "chartreuse"];
        this.scoreArray = [0, 2, 3, 4, 5, 6];
        this.firstSquare = -1;
        this.secondSquare = -1;
        for (let i = 0; i < 80; i++) {
            this.emptySet.push(i);
            this.boardAr.push(0);
            // this.emptySet[i] = i;
            // this.boardAr[i] = 0;
        }
    }

    SwapSquares(firstSquareInput, secondSquareInput) {
        //change HTML
        let tempSetting = document.getElementById(firstSquareInput).style.backgroundColor;
        document.getElementById(firstSquareInput).style.backgroundColor = document.getElementById(secondSquareInput).style.backgroundColor;
        document.getElementById(secondSquareInput).style.backgroundColor = tempSetting;
    
        //change JS data
        let tempVar = this.boardAr[firstSquareInput];
        this.boardAr[firstSquareInput] = this.boardAr[secondSquareInput];
        this.boardAr[secondSquareInput] = tempVar;
    }
    
    SetSwap(id) {
        if(this.firstSquare == -1 && this.secondSquare == -1 && this.boardAr[id] != 0) {
            this.firstSquare = id;
            document.getElementById(this.firstSquare).classList.add("highlightedItem");
        }
        else if(this.secondSquare == -1 && this.boardAr[id] != 0) {
            this.secondSquare = id;
            this.SwapSquares(this.firstSquare, this.secondSquare);
            document.getElementById(this.firstSquare).classList.remove("highlightedItem");
            this.firstSquare = -1;
            this.secondSquare = -1;
        }
        else {
            console.log("Give a warning message to user");
        }
    }
    
    SpawnSquares() {
        for(let i=0;i < 5; i++) {
            const intPos = Math.floor(Math.random() * this.emptySet.length);
            const randomColor = Math.floor(Math.random() * 5) + 1;
            document.getElementById(this.emptySet[intPos]).style.backgroundColor = this.colorArray[randomColor];
            // emptySet.splice(intPos, 1);
            this.boardAr[this.emptySet[intPos]] = randomColor;
            // TODO: remove intPos indexed element from emptySet array
            this.emptySet.splice(intPos, 1);
        
        }
    
        this.firstSquare = -1;
    }
    
    NewGame() {
        emptySet.length = 0;
        for(let i=0; i < 80; i++) {
            this.boardAr[i] = 0;
            emptySet.push(i);
            document.querySelector(i).style.backgroundColor = "lightgray";
        }
        
        SpawnSquares();
    }

    IsGoalCell(int) {
        if((int % 10) === 0 || (int % 10) === 1 || (int % 10) === 8 || (int % 10) === 9) {
            return true;
        }
        return false;
    }
    
    Collect() {
        if (this.firstSquare > -1 && true /* also add check for disjoint set size >= mss*/ && this.IsGoalCell(this.firstSquare)) { // calls collect
            // Requires disjoint set
            this.firstSquare = -1;
        }
        else if (this.firstSquare == -1){
            
        }
        else if (false /*check disjoint set size*/) {
    
        }
        else if (!this.IsGoalCell(this.firstSquare)) {
        
        }
    
        // TODO: decrement filledSquares by how big the disjoint set was.
        // TODO: increment score
    }
    
    GameOver() {
            
    }
}