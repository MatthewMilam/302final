// This file contains the logic for the single player version of Superball. It contains the functions and constructor
// for the single player board
import DisjointSet, * as boardFile from './disjoint.js'

export default class SuperballBoard {
    constructor() {
        this.disjSet = new DisjointSet(80);

        this.boardAr = [];      // The board array holds values 0 to 5 which keeps track of the color in that square.
        this.emptySet = [];     // Emptyset is an array holding all indicies of squares that are empty.
        this.filledSquares = 0;
        this.mss = 5;
        this.score = 0;
        this.colorArray = ["silver", "darkorchid", "aqua", "yellow", "crimson", "chartreuse"]; // Colors of each boardAr value.
        this.scoreArray = [0, 2, 3, 4, 5, 6];   // Holds the score bonuses of each color.
        this.firstSquare = -1;  
        this.secondSquare = -1;     // These two hold the index that has been selected by the user to swap.
        //this.highlightedID = -1;

        // To start the game, emptySet holds all values 0-79 since all squares are empty, and the boardArray is filled
        // with zeros.
        for (let i = 0; i < 80; i++) {
            this.emptySet.push(i);
            this.boardAr.push(0);
        }
    }

    // Function which takes in the cell id, then either highlights it if its currently highlighted, or removes the highlight
    ChangeHighlight(id) {
        // Get the cell HTML element, get the RGB value, then assign the value to an array, then assign the new color
        const element = document.querySelector(`[data-number="${id}"]`);
        const originalColor = getComputedStyle(element).backgroundColor;
        const colorArr = originalColor.substring(4, originalColor.length - 1).split(",").map(n => parseInt(n, 10));
        const [r, g, b] = colorArr;
        
        // This statement means that no square has been selected before calling this function, so it darkens the
        // current selected squares (which is at index "ID").
        if(this.highlightedID == -1) {
            this.highlightedID = id;
            const darkerColor = `rgb(${Math.max(r - 100, 0)}, ${Math.max(g - 100, 0)}, ${Math.max(b - 100, 0)})`;
            element.style.backgroundColor = darkerColor;
        }
        // This means a square is already dark when calling the function, so either someone is clicking a square
        // twice or swapping two squares. Both cases have an outcome of no darkened squares.
        else {
            this.highlightedID = -1;
            // To remove the highlight, just set it back to the color it is in the board array instead of adding to the RGB value
            element.style.backgroundColor = this.colorArray[this.boardAr[id]];
        }
    }

    // Swaps two cells, by first swapping the data in JS and then swaps the colors in HTML
    SwapSquares(firstSquareInput, secondSquareInput) {
        //change JS data
        let tempVar = this.boardAr[firstSquareInput];
        this.boardAr[firstSquareInput] = this.boardAr[secondSquareInput];
        this.boardAr[secondSquareInput] = tempVar;

        // Update colors.
        document.querySelector(`[data-number="${firstSquareInput}"]`).style.backgroundColor = this.colorArray[this.boardAr[firstSquareInput]];
        document.querySelector(`[data-number="${secondSquareInput}"]`).style.backgroundColor = this.colorArray[this.boardAr[secondSquareInput]];
    }
    
    
    // This function is called when 
    SetSwap(id) {
        //both not selected
        if(this.firstSquare == -1 && this.secondSquare == -1 && this.boardAr[id] != 0) {
            this.firstSquare = id;
            //console.log(id);
            this.ChangeHighlight(this.firstSquare);
        }
        // Clicked a cell twice or second square is the same color as first square. Restarts swap process without spawning squares.
        else if((id == this.firstSquare) || (this.boardAr[this.firstSquare] == this.boardAr[id])){
            this.ChangeHighlight(this.firstSquare);
            this.firstSquare = -1;
        }
        //first square selected, second square not selected
        else if(this.secondSquare == -1 && this.boardAr[id] != 0) {
            this.secondSquare = id;
            // this.ChangeHighlight(this.firstSquare);
            this.highlightedID = -1;
            this.SwapSquares(this.firstSquare, this.secondSquare);
            this.firstSquare = -1;
            this.secondSquare = -1;

            if (this.GameOver()) {
                let overlay = document.getElementById("gameOverOverlay");
                overlay.style.display = "flex"
                setTimeout(function() {
                    overlay.style.opacity = "1";
                }, 100);
                // this.NewGame();
            }
            else {
                this.SpawnSquares();
            }
        
        }
        else {
            console.log("Give a warning message to user");
        }
    }

    // Update Disjset is called everytime the turn ends (so at the end of spawnsquares()). 
    updateDisjSet() {
        delete this.disjSet;
        this.disjSet = new DisjointSet(80);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 10; j++) {
                if (document.querySelector(`[data-number="${(i*10) + j}"]`).style.backgroundColor != "") {
                    // Check right cell.
                    if (j != 9 && this.disjSet.find((i*10) + j) != this.disjSet.find((i*10) + j + 1)
                    && this.boardAr[(i*10) + j] == this.boardAr[(i*10) + j+1]) {
                            this.disjSet.Union((i*10) + j, (i*10) + j + 1);
                    }
                    // Check below
                    if (i < 7 && this.disjSet.find((i*10) + j) != this.disjSet.find(((i+1)*10) + j) 
                    && this.boardAr[(i*10) + j] == this.boardAr[((i+1) * 10) +j]) {
                            this.disjSet.Union((i*10) + j, ((i+1)*10) + j);
                    }
                }
            }
        }
    }
    
    SpawnSquares() {
        let numToSpawn = 5;
        if (this.filledSquares > 75) numToSpawn = 80 - this.filledSquares;
        for(let i=0; i < numToSpawn; i++) {
            const intPos = Math.floor(Math.random() * this.emptySet.length);
            const randomColor = Math.floor(Math.random() * 5) + 1;
            document.querySelector(`[data-number="${this.emptySet[intPos]}"`).style.backgroundColor = this.colorArray[randomColor];
            this.boardAr[this.emptySet[intPos]] = randomColor;
            // TODO: remove intPos indexed element from emptySet array
            this.emptySet.splice(intPos, 1);
        }
    
        this.firstSquare = -1;
        this.updateDisjSet();
        this.filledSquares += numToSpawn;
    }
    
    NewGame() {
        this.emptySet.length = 0;
        this.filledSquares = 0;
        this.disjSet = new DisjointSet(80);
        
        //Reset Score
        this.score = 0;
        document.getElementById("scoreElement").innerHTML = this.score;

        for(let i=0; i < 80; i++) {
            this.boardAr[i] = 0;
            this.emptySet.push(i);
            document.querySelector(`[data-number="${i}"]`).style.backgroundColor = this.colorArray[0];
        }
        

        let overlay = document.getElementById("gameOverOverlay");
        overlay.style.display = "none"
        overlay.style.opacity = "0";

        this.SpawnSquares();
    }

    // Arithmetic to check if an index is located at a goal cell. Goal cells start at index 20 and end at 59 and
    // are either the first 2 or last two columns, so modular arithmetic determines whether it is valid or not.
    IsGoalCell(int) {
        if(int > 19 && int < 60 && ((int % 10) === 0 || (int % 10) === 1 || (int % 10) === 8 || (int % 10) === 9)) {
            return true;
        }
        return false;
    }
    
    // This function is called when the user clicks the collect buton. To work, it must be called when the player
    // has previously selected a square in a goal cell, and the size of the square's cluster is >= 5. It will then
    // remove all square in that cluster and give the player points for the score.
    Collect() {
        // This function displayWarningMessage is used later to display a warning if the user scored when it was
        // not possible. It alters the CSS data to add text to the row below the gameboard.
        function displayWarningMessage(message) {
            //Gets the warning message HTML element, changes it to be the message, and makes it visible
            const warningMessageElement = document.getElementById("WarningMessage");
            warningMessageElement.innerText = message;
            warningMessageElement.style.opacity = 1;
        
            // Waits 1 second, adds the transition, then makes it invisible again
            setTimeout(() => {
                warningMessageElement.style.transition = 'opacity 1s linear 0s'; // Add this line
                warningMessageElement.style.opacity = 0;
            }, 1000);
        }

        // This if-statement checks to see if the user called the function correctly. If so, it completes the collect call.
        if (this.firstSquare > -1 && this.disjSet.getParentSize(this.firstSquare) >= this.mss && this.IsGoalCell(this.firstSquare)) { // calls collect
            // Squares are removed.
            let scoreMultiplier = this.scoreArray[this.boardAr[this.firstSquare]];
            let squaresRemoved = 0;
            for (let i = 0; i < 80; i++) {
                if (this.disjSet.find(i) == this.disjSet.find(this.firstSquare)) {
                    document.querySelector(`[data-number="${i}"`).style.backgroundColor =  "silver";
                    this.boardAr[i] = 0;
                    this.emptySet.push(i); // Question: does emptySet need to be in order? Right now it wont be.
                    this.filledSquares--;
                    squaresRemoved++;
                }
            }
            
            // document.querySelector(`[data-number="${this.firstSquare}"]`).classList.remove("highlightedItem");
            this.ChangeHighlight(this.firstSquare);
            this.firstSquare = -1;


            this.SpawnSquares();

            // Increment score:
            this.score += scoreMultiplier * squaresRemoved;
             
            //change score variable
            document.getElementById("scoreElement").innerHTML = this.score;
        }
        else if (this.firstSquare == -1){
            displayWarningMessage("No square has been selected to score.");
        }
        else if (!this.IsGoalCell(this.firstSquare)) {
            displayWarningMessage("Player tried to score a non goal cell.");
        }
        else if (this.disjSet.getParentSize(this.firstSquare) < this.mss) {
            displayWarningMessage("Size of disjoint set is less than 5.")
        }
    
    }
    
    GameOver() {
        if(this.filledSquares > 75) {
            return true;
        }
        return false;
    }

    DisableButtons() {
        // get all button elements on the page
        const buttons = document.getElementsByTagName('button');

        // loop through all the button elements and disable them
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }

    EnableButtons() {
        // get all button elements on the page
        const buttons = document.getElementsByTagName('button');

        // loop through all the button elements and disable them
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }



    ConsoleLogBoard() {
        for(let i = 0; i < 79; i++) {
            console.log(this.boardAr[i])
        }
    }
}

/* What to get done
1. Finish superball functions
   - add 5 different colors (get random color), function to select random color (rpbgy) MATTHEW (done)
   - Swapping fix (shouldn't be able to swap any non-colored squares) BRYCE (done)
   - fix collect button to hold a collect function - make collect have to be called on goal cell. MATTHEW (done)
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

// Completed by Matthew on 4/15:
// 1. Added error commands on score function
// 2. Implemented disjoint set using geeksforgeeks code.
// 3. Added sizes array to disjoint.js to help with keeping track of sizes of disjoint sets.
// 4. Debugged setswap so that clicking the same square twice does not spawn squares.
// 5. 

// question: are we still using filledSquares? 
// also: how does spawn squares work with less than 5 slots left? does game end or does the board fill?

// Still todo
// 1. Add increment score to score() function, show score on the page.
// 2. End the game when necessary.