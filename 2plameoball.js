// Things that need to be coded

// Things to do before start on 2 player, change the game over logic to fill the board then show game over

// Change main to reassign board when they want to play two player mode

// Superball board with functions
// Note: Main will have to be changed to reassign the board Object to be a 2 player board Object. That will allow the main.js 
// buttons to call functions from the two player mode object instead of the one player mode object. It will also allow us
// to not have to remake all the buttons, and instead just have them call the different functions.


import DisjointSet, * as boardFile from './disjoint.js'

export default class TwoPlayerSuperballBoard {
    constructor() {
        this.disjSet = new DisjointSet(80);

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
        this.highlightedID = -1;
        for (let i = 0; i < 80; i++) {
            this.emptySet.push(i);
            this.boardAr.push(0);
            // this.emptySet[i] = i;
            // this.boardAr[i] = 0;
        }
    }

    ChangeHighlight(id) {
        const element = document.querySelector(`[data-number="${id}"]`);
        const originalColor = getComputedStyle(element).backgroundColor;
        const colorArr = originalColor.substring(4, originalColor.length - 1).split(",").map(n => parseInt(n, 10));
        const [r, g, b] = colorArr;
        console.log("highlightedID", this.highlightedID);
        if(this.highlightedID == -1) {
            this.highlightedID = id;
            const darkerColor = `rgb(${Math.max(r - 100, 0)}, ${Math.max(g - 100, 0)}, ${Math.max(b - 100, 0)})`;
            element.style.backgroundColor = darkerColor;
        }
        else {
            this.highlightedID = -1;
            element.style.backgroundColor = this.colorArray[this.boardAr[id]];
        }
    }

    SwapSquares(firstSquareInput, secondSquareInput) {
        //change HTML
        let tempSetting = this.colorArray[this.boardAr[firstSquareInput]];
        document.querySelector(`[data-number="${firstSquareInput}"]`).style.backgroundColor = this.colorArray[this.boardAr[secondSquareInput]];
        document.querySelector(`[data-number="${secondSquareInput}"]`).style.backgroundColor = tempSetting;
    
        //change JS data
        let tempVar = this.boardAr[firstSquareInput];
        this.boardAr[firstSquareInput] = this.boardAr[secondSquareInput];
        this.boardAr[secondSquareInput] = tempVar;
    }
    
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
                let overlay = document.getElementById("overlay");
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
                    // Check right cell
                    if (j != 9 && j != 4 && this.disjSet.find((i*10) + j) != this.disjSet.find((i*10) + j + 1)
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
        this.filledSquares += 5;
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
            document.querySelector(`[data-number="${i}"]`).style.backgroundColor = "rgb(183, 183, 183)";     // Why does this color look wrong? Gainsboro or lightgrey?
        }
        

        let overlay = document.getElementById("overlay");
        overlay.style.display = "none"
        overlay.style.opacity = "0";

        this.SpawnSquares();
    }

    IsGoalCell(int) {
        if((int % 10) === 0 || (int % 10) === 1 || (int % 10) === 8 || (int % 10) === 9) {
            return true;
        }
        return false;
    }
    
    Collect() {
        function displayWarningMessage(message) {
            const warningMessageElement = document.getElementById("WarningMessage");
            warningMessageElement.innerText = message;
            warningMessageElement.style.opacity = 1;
        
            setTimeout(() => {
                warningMessageElement.style.transition = 'opacity 1s linear 0s'; // Add this line
                warningMessageElement.style.opacity = 0;
            }, 1000);
        }
        if (this.firstSquare > -1 && this.disjSet.getParentSize(this.firstSquare) >= this.mss && this.IsGoalCell(this.firstSquare)) { // calls collect
            // Squares are removed.
            let scoreMultiplier = this.scoreArray[this.boardAr[this.firstSquare]];
            let squaresRemoved = 0;
            for (let i = 0; i < 80; i++) {
                if (this.disjSet.find(i) == this.disjSet.find(this.firstSquare)) {
                    document.querySelector(`[data-number="${i}"`).style.backgroundColor =  "gainsboro";
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

/*

Notes on 2 player class (written by matthew 5/2):
 - Disjoint sets size function was altered to not merge disjoint sets along the center y-axis of the board.
*/