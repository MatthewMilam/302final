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
        this.emptySetL = [];
        this.emptySetR = [];
        
        this.filledSquaresL = 0;
        this.filledSquaresR = 0;
        this.mss = 5;
        this.score = 0;
        this.colorArray = ["gainsboro", "darkorchid", "aqua", "yellow", "crimson", "chartreuse"];
        this.scoreArray = [0, 2, 3, 4, 5, 6];
        this.firstSquare = -1;
        this.secondSquare = -1;
        this.highlightedID = -1;
        for (let i = 0; i < 80; i++) {
            if (i % 10 < 5) this.emptySetL.push(i);
            else this.emptySetR.push(i);

            this.boardAr.push(0);
            
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

        function displayWarningMessage(message) {
            const warningMessageElement = document.getElementById("WarningMessage");
            warningMessageElement.innerText = message;
            warningMessageElement.style.opacity = 1;
        
            setTimeout(() => {
                warningMessageElement.style.transition = 'opacity 1s linear 0s'; // Add this line
                warningMessageElement.style.opacity = 0;
            }, 1000);
        }

        // Added for 2player mode. Sends error message if player tries to 
        if (this.boardAr[id] != 0 && this.IsRightGoalCell(id)) {
            displayWarningMessage("Player cannot access opponent's goal cells.");
            this.firstSquare = -1;
            this.secondSquare = -1;
        }
        //both not selected
        else if(this.firstSquare == -1 && this.secondSquare == -1 && this.boardAr[id] != 0) {
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
                this.endTurn();
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
                if (this.boardAr[(i*10) + j] != 0) {
                    // Check right cell
                    // This is different from 1 player version in that sets aren't unioned across middle line.
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
    
    // This is different from 1 player version. 2 squares per side spawn.
    SpawnSquares() {
        // Left code
        let numToSpawn = 2;
        if (this.filledSquaresL > 38) numToSpawn = 40 - this.filledSquaresL;
        for(let i=0; i < numToSpawn; i++) {
            const intPos = Math.floor(Math.random() * this.emptySetL.length);
            const randomColor = Math.floor(Math.random() * 5) + 1;
            document.querySelector(`[data-number="${this.emptySetL[intPos]}"`).style.backgroundColor = this.colorArray[randomColor];
            this.boardAr[this.emptySetL[intPos]] = randomColor;
            // TODO: remove intPos indexed element from emptySet array
            this.emptySetL.splice(intPos, 1);
        }
    
        this.firstSquare = -1;
        this.filledSquaresL += numToSpawn;

        // Right code
        numToSpawn = 2;
        if (this.filledSquaresR > 38) numToSpawn = 40 - this.filledSquaresR;
        for(let i=0; i < numToSpawn; i++) {
            const intPos = Math.floor(Math.random() * this.emptySetR.length);
            const randomColor = Math.floor(Math.random() * 5) + 1;
            document.querySelector(`[data-number="${this.emptySetR[intPos]}"`).style.backgroundColor = this.colorArray[randomColor];
            this.boardAr[this.emptySetR[intPos]] = randomColor;
            // TODO: remove intPos indexed element from emptySet array
            this.emptySetR.splice(intPos, 1);
        }
    
        this.firstSquare = -1;
        this.filledSquaresR += numToSpawn;


        this.updateDisjSet();
    }
    
    NewGame() {
        this.emptySetL.length = 0;
        this.emptySetR.length = 0;
        this.filledSquaresL = 0;
        this.filledSquaresR = 0;
        this.disjSet = new DisjointSet(80);
        this.firstSquare = -1;
        this.secondSquare = -1;
        this.highlightedID = -1;
        
        //Reset Score
        this.score = 0;
        document.getElementById("scoreElement").innerHTML = this.score;

        for(let i = 0; i < 80; i++) {
            if (i % 10 < 5) this.emptySetL.push(i);
            else this.emptySetR.push(i);

            this.boardAr[i] = 0;
            document.querySelector(`[data-number="${i}"]`).style.backgroundColor = "rgb(183, 183, 183)";
        }
        

        let overlay = document.getElementById("overlay");
        overlay.style.display = "none";
        overlay.style.opacity = "0";

        this.SpawnSquares();
    }

    IsGoalCell(int) {
        if((int % 10) === 0 || (int % 10) === 1 || (int % 10) === 8 || (int % 10) === 9) {
            return true;
        }
        return false;
    }

    IsLeftGoalCell(int) {
        if(int > 19 && int < 60 && ((int % 10) === 0 || (int % 10) === 1)) {
            return true;
        }
        return false;
    }

    IsRightGoalCell(int) {
        if(int > 19 && int < 60 && ((int % 10) === 8 || (int % 10) === 9)) {
            return true;
        }
        return false;
    }
    
    Collect() {
        console.log("TEST OUTPUT 22222222");
        function displayWarningMessage(message) {
            const warningMessageElement = document.getElementById("WarningMessage");
            warningMessageElement.innerText = message;
            warningMessageElement.style.opacity = 1;
        
            setTimeout(() => {
                warningMessageElement.style.transition = 'opacity 1s linear 0s'; // Add this line
                warningMessageElement.style.opacity = 0;
            }, 1000);
        }
        if (this.firstSquare > -1 && this.disjSet.getParentSize(this.firstSquare) >= this.mss && this.IsLeftGoalCell(this.firstSquare)) { // calls collect
            // Squares are removed.
            let scoreMultiplier = this.scoreArray[this.boardAr[this.firstSquare]];
            let squaresRemoved = 0;
            for (let i = 0; i < 80; i++) {
                if (this.disjSet.find(i) == this.disjSet.find(this.firstSquare)) {
                    document.querySelector(`[data-number="${i}"`).style.backgroundColor = "gainsboro";
                    this.boardAr[i] = 0;
                    this.emptySetL.push(i);
                    this.filledSquaresL--;
                    squaresRemoved++;
                }
            }
            
            // document.querySelector(`[data-number="${this.firstSquare}"]`).classList.remove("highlightedItem");
            this.ChangeHighlight(this.firstSquare);
            this.firstSquare = -1;

            
            this.endTurn();

            // Increment score:
            this.score += scoreMultiplier * squaresRemoved;
             
            //change score variable
            document.getElementById("scoreElement").innerHTML = this.score;
        }
        else if (this.firstSquare == -1){
            displayWarningMessage("No square has been selected to score.");
        }
        else if (!this.IsLeftGoalCell(this.firstSquare) && !this.IsRightGoalCell(this.firstSquare)) {
            displayWarningMessage("Player tried to score a non goal cell.");
        }
        else if (!this.IsLeftGoalCell(this.firstSquare)) {
            displayWarningMessage("Player tried to score in opponent's goal cell.");
        }
        else if (this.disjSet.getParentSize(this.firstSquare) < this.mss) {
            displayWarningMessage("Size of disjoint set is less than 5.")
        }
    
    }

    
    endTurn() {
        this.SpawnSquares();
        this.computerTurn();
        //this.SpawnSquares();
    }

    computerTurn() {
        // Easy Mode
        // TODO: Score if possible
        // TODO: 

        // Hard Mode
        // TODO: swap, redo disjoint set, create integer value for the board, store, swap back, repeat for all swaps.
        // Calculating swap score: Take each disjoint set size, square it, if its computer's side, add, if not, subtract.
        // Take best move, perform swap.

        let maxScore = -10000000; // TODO: how to get lowest int value.
        let maxFirst = 0;
        let maxSecond = 0;
        let score = 0;
        let temp = 0;

        let tileToScore = 0;
        let sizeScored = 0;

        for (let i = 20; i < 60; i++) {
            if (this.IsRightGoalCell(i) && this.disjSet.getParentSize(i) >= sizeScored) {
                sizeScored = this.disjSet.sizes[this.disjSet.find(i)];
                tileToScore = i;
            }
        }

        if (sizeScored >= this.mss) {
            let scoreMultiplier = this.scoreArray[this.boardAr[tileToScore]];
            let squaresRemoved = 0;
            for (let i = 0; i < 80; i++) {
                if (this.disjSet.find(i) == this.disjSet.find(tileToScore)) {
                    document.querySelector(`[data-number="${i}"`).style.backgroundColor = "gainsboro";
                    this.boardAr[i] = 0;
                    this.emptySetR.push(i);
                    this.filledSquaresR--;
                    squaresRemoved++;
                }
            }

            // Increment score:
            this.score -= scoreMultiplier * squaresRemoved;
             
            //change score variable
            document.getElementById("scoreElement").innerHTML = this.score;

            return;
        }
        else {

        }


        for (let i = 0; i < 79; i++) {
            for (let j = i + 1; j < 80; j++) {
                if (this.boardAr[i] != 0 && this.boardAr[j] != 0 && this.boardAr[i] != this.boardAr[j]
                    && !this.IsLeftGoalCell(i) && !this.IsLeftGoalCell(j)) {
                    
                    // Swap squares
                    temp = this.boardAr[i];
                    this.boardAr[i] = this.boardAr[j];
                    this.boardAr[j] = temp;

                    // Update disjoint sets
                    this.updateDisjSet();

                    // Score the board.
                    score = this.scoreBoard();

                    // Update best move if score is the max score.
                    if (score > maxScore) {
                        maxScore = score;
                        maxFirst = i;
                        maxSecond = j;
                    }

                    // Swap squares back.
                    this.boardAr[j] = this.boardAr[i];
                    this.boardAr[i] = temp;
                    
                }
            }
        }

        this.SwapSquares(maxFirst, maxSecond);

        // Update colors on screen.
        //let tempSetting = this.colorArray[this.boardAr[maxFirst]];
        //document.querySelector(`[data-number="${maxFirst}"]`).style.backgroundColor = this.colorArray[this.boardAr[maxSecond]];
        //document.querySelector(`[data-number="${maxSecond}"]`).style.backgroundColor = tempSetting;

        // Peform best move.
        //temp = this.boardAr[maxFirst];
        //this.boardAr[maxFirst] = this.boardAr[maxSecond];
        //this.boardAr[maxSecond] = temp;

        this.updateDisjSet();

        console.log("Move " + maxFirst + " and " + maxSecond + " with score " + maxScore);

    }

    scoreBoard() {
        let score = 0;
        for (let i = 0; i < 80; i++) {
            if (this.disjSet.sizes[this.disjSet.find(i)] > 0) {
                if (i % 10 < 5) {
                    score -= (this.disjSet.sizes[this.disjSet.find(i)] * this.disjSet.sizes[this.disjSet.find(i)]);
                }
                else {
                    score += (this.disjSet.sizes[this.disjSet.find(i)] * this.disjSet.sizes[this.disjSet.find(i)]);
                }
                this.disjSet.sizes[this.disjSet.find(i)] = 0;
            }
        }

        return score;
    }

    
    GameOver() {
        if(this.filledSquaresL > 38 && this.filledSquaresR > 38) {
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
 - emptySet and filledSquares were split into left and right versions of each.
 - Collect changed (uses IsLeftGoalCell now)

 Things to do:
 - Add computer move (write function)
 - Integrate computer moves into the other code (currently we only call spawnsquares at the end of turns. Do we also )

5/7 - More things to do:
 - Change move scoring system to make clumps attached to goalcells more important.
 - Change order of turns... How many moves, how many spawns.
 - If 2 move at a time, need to make player able to move twice.

 - Scoring system for 2player mode (currently when computer scores, score goes negative).
 - fix bug with grey color (when scoring, two greys are different...)
 - spawning squares bug in newgame... won't work.
 */