// TODO: update goal cell function. 


import DisjointSet, * as boardFile from './disjoint.js'

export default class SuperballBoard {
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
        //change JS data
        let tempVar = this.boardAr[firstSquareInput];
        this.boardAr[firstSquareInput] = this.boardAr[secondSquareInput];
        this.boardAr[secondSquareInput] = tempVar;

        // Update colors.
        document.querySelector(`[data-number="${firstSquareInput}"]`).style.backgroundColor = this.colorArray[this.boardAr[firstSquareInput]];
        document.querySelector(`[data-number="${secondSquareInput}"]`).style.backgroundColor = this.colorArray[this.boardAr[secondSquareInput]];
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
            document.querySelector(`[data-number="${i}"]`).style.backgroundColor = "rgb(183, 183, 183)";     // Why does this color look wrong? Gainsboro or lightgrey?
        }
        

        let overlay = document.getElementById("gameOverOverlay");
        overlay.style.display = "none"
        overlay.style.opacity = "0";

        this.SpawnSquares();
    }

    IsGoalCell(int) {
        if(int > 19 && int < 60 && ((int % 10) === 0 || (int % 10) === 1 || (int % 10) === 8 || (int % 10) === 9)) {
            return true;
        }
        return false;
    }
    
    Collect() {
        console.log("TEST OUTPUT");
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