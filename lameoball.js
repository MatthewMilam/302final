// This file contains the logic for the single player version of Superball. It contains the functions and constructor
// for the single player board
import DisjointSet, * as boardFile from './disjoint.js'


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
        this.highlightedID = -1;

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
    
    
    // This function is called when a user clicks a cell
    SetSwap(id) {
        // No cells have been selected
        if(this.firstSquare == -1 && this.secondSquare == -1 && this.boardAr[id] != 0) {
            this.firstSquare = id;
            this.ChangeHighlight(this.firstSquare);
        }
        // Clicked a cell twice or second square is the same color as first square. Restarts swap process without spawning squares.
        else if(id == this.firstSquare){
            this.ChangeHighlight(this.firstSquare);
            this.firstSquare = -1;
        }
        // First square selected, second square not selected
        else if(this.secondSquare == -1 && this.boardAr[id] != 0) {
            this.secondSquare = id;
            this.highlightedID = -1;

            // Spawns the squares, and resets the first and second selection
            this.SwapSquares(this.firstSquare, this.secondSquare);
            this.firstSquare = -1;
            this.secondSquare = -1;

            this.SpawnSquares();        
        }
        else {
            console.log("Give a warning message to user");
        }
    }

    // Update Disjset is called every time the turn ends (so at the end of spawnsquares()).
    // It deletes the old disjoint set and recreates it to update the values and sizes.
    updateDisjSet() {
        delete this.disjSet;
        this.disjSet = new DisjointSet(80);

        // At this point, there is a new disjoint set with all single nodes pointing to themselves. To update it,
        // these loops iterate through the board. If the square to the right or below the current square has the same
        // color, their disjoint sets are unioned.
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 10; j++) {
                // First if-statement checks if the square is not an empty cell.
                if (this.disjSet.find((i*10) + j) != 0) {
                    // To check the cell to the right, the current cell cannot be on the far right column (j != 9)
                    // and they cannot already be in the same disjoint set (parents cannot be the same) and
                    // they have to be the same color.
                    if (j != 9 && this.disjSet.find((i*10) + j) != this.disjSet.find((i*10) + j + 1)
                    && this.boardAr[(i*10) + j] == this.boardAr[(i*10) + j+1]) {
                        // Unions the squares.
                        this.disjSet.Union((i*10) + j, (i*10) + j + 1);
                    }
                    // Check tile below (similar logic as above but cannot be last row (i != 7).
                    if (i < 7 && this.disjSet.find((i*10) + j) != this.disjSet.find(((i+1)*10) + j) 
                    && this.boardAr[(i*10) + j] == this.boardAr[((i+1) * 10) +j]) {
                        // Unions squares
                        this.disjSet.Union((i*10) + j, ((i+1)*10) + j);
                    }
                }
            }
        }
    }
    

    SpawnSquares() {
        // To spawn squares, it starts with 5 squares. If there is fewer than 5 empty spaces, the number to spawn is decreased.
        let numToSpawn = 5;
        if (this.filledSquares > 75) numToSpawn = 80 - this.filledSquares;

        // This loop repeats for each new tile. It picks a random index from teh emptySet array. It also chooses
        // a random color. It then updates this empty tile to be filled by a color, updates the board array,
        // and removes the tile from the emptySet array.
        for(let i=0; i < numToSpawn; i++) {
            const intPos = Math.floor(Math.random() * this.emptySet.length);
            const randomColor = Math.floor(Math.random() * 5) + 1;
            document.querySelector(`[data-number="${this.emptySet[intPos]}"`).style.backgroundColor = this.colorArray[randomColor];
            this.boardAr[this.emptySet[intPos]] = randomColor;
            // TODO: remove intPos indexed element from emptySet array
            this.emptySet.splice(intPos, 1);
        }

        if (numToSpawn != 5) {
            let overlay = document.getElementById("gameOverOverlay");
            overlay.style.display = "flex"
                
            // Adds a transition for the overlay
            setTimeout(function() {
                overlay.style.opacity = "1";
            }, 100);
        }
    
        // The first square selection is reset in case the player had that selected, and the disjoint set is updated with
        // the new value and the number of filled squares is incremented.
        this.firstSquare = -1;
        this.updateDisjSet();
        this.filledSquares += numToSpawn;

    }
    
    // Function to reset the game by resetting all the data, resetting the HTML, and adding the game over overlay
    NewGame() {
        //Reset data
        this.emptySet.length = 0;
        this.filledSquares = 0;
        this.disjSet = new DisjointSet(80);
        
        //Reset Score
        this.score = 0;
        document.getElementById("scoreElement").innerHTML = this.score;
        
        //Reset HTML
        for(let i=0; i < 80; i++) {
            this.boardAr[i] = 0;
            this.emptySet.push(i);
            document.querySelector(`[data-number="${i}"]`).style.backgroundColor = this.colorArray[0];
        }
        
        //Add game over overlay
        let overlay = document.getElementById("gameOverOverlay");
        overlay.style.display = "none"
        overlay.style.opacity = "0";

        //Spawns squares for the next new game
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
        // This if-statement checks to see if the user called the function correctly. If so, it completes the collect call.
        if (this.firstSquare > -1 && this.disjSet.getParentSize(this.firstSquare) >= this.mss && this.IsGoalCell(this.firstSquare)) { // calls collect
            // Squares are removed.
            let scoreMultiplier = this.scoreArray[this.boardAr[this.firstSquare]];
            let squaresRemoved = 0;
            for (let i = 0; i < 80; i++) {
                // Checks for any squares whose parent tile is the same as the parent of the square collected.
                if (this.disjSet.find(i) == this.disjSet.find(this.firstSquare)) {

                    // Color is removed, arrays and values updated.
                    document.querySelector(`[data-number="${i}"`).style.backgroundColor =  "silver";
                    this.boardAr[i] = 0;
                    this.emptySet.push(i); 
                    this.filledSquares--;
                    squaresRemoved++;
                }
            }
            
            // Highlight is removed from the scored cell and selected square is no longer selected.
            this.ChangeHighlight(this.firstSquare);
            this.firstSquare = -1;


            this.SpawnSquares();

            // Increment score:
            this.score += scoreMultiplier * squaresRemoved;
             
            //change score variable
            document.getElementById("scoreElement").innerHTML = this.score;
        }
        // These are warning messages in case the player does not know the rules.
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

    DisableButtons() {
        // Get all button elements on the page
        const buttons = document.getElementsByTagName('button');

        // Loop through all the button elements and disable them
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }

    EnableButtons() {
        // Get all button elements on the page
        const buttons = document.getElementsByTagName('button');

        // Loop through all the button elements and enable them
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }
}