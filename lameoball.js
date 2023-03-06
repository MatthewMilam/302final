// File holding logic for lame-o-ball game

let boardAr = new Array(80);


// Colors: White(1), Purple(2), Blue(3), Yellow(4), Red(5), Green(6)
var elem = document.querySelector('#gridItemTemplate');
for (let i = 0; i < 80; i++) {
    boardAr[i] = 1;
    var clone = elem.cloneNode(true);
    clone.class = 'gridItem';
    elem.after(clone);
}
elem.remove();


// Loop repeats every turn. Finds 5 random blank squares and makes them a random color. Takes in input from the user.


// checking if any  blank squares
for (let i=0; i < 80; i++) {

}

