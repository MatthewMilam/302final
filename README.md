## Documentation
Matthew Milam and Bryce Richards
Final Project: Superball Browser Game
May 9, 2023
This project utilizes the languages HTML, CSS, and Javascript to make Superball into a playable browser game.
This version will include normal superball as well as a 2-player verison against multiple AI difficulties.
The 2 player version is similar to Superball, but instead each player gets one scoring zone. Each player can
move any tiles except those in the other's scoring zone, and can only collect in one's own scoring zone. 2 tiles
spawn on each half of the board, instead of 5 randomly, and the goal is to score more points than your opponent
before your side of the board fills up. Once a player's side fills up, the other player can keep playing on his side
until that fills up. The player with more points scored wins (this is implemented by the score increasing when the 
player scores and the score decreasing when the AI scores. A positive score means you won). Also a small change is that
neithe player can swap with an empty cell (to make it more strategic).

Bryce Time Log:
 - Mar 4
    30 minutes, Meeting with Matthew, setting up github and starting files
 - Mar 6
    30 minutes, Adding HTML containers and CSS styling
 - Mar 7
    15 minutes, Adding two JavaScript functions 
 - Mar 30
    1 hour, separated files apart to have a more OOP structure
 - April 11
    30 minutes, Rewrote the code to use the "data-number" attribute in HTML instead of an HTML id attribute
 - April 18
    30 minutes, Edited the UI
 - April 24
    30 minutes, Added a shadow selection instead of outline, added Score functionality
 - April 26
    30 minutes, Fixed highlight bugs and added warning messages
 - May 1
    2 hours, Added game over screen, fixed bugs, set up 2 player structure
 - May 7
    30 minutes, Worked on adding the ability to change game mode
 - May 8
    30 minutes, Added menu for easy and hard
 - May 9
    1 hour, Commenting, improved the tutorial section look, and changed 2p goal cells look



Matthew Time Log:
 - March 4
    2 hours: Meeting with Bryce, setting up github and starting files, planning project
 - March 5
    2 hours: Learning basics of Javascript / researching disjoint sets before starting project.
 - March 27
    30 minutes: Added goals and timeline for what each of us needs to get done.
 - March 28
    1 hour: Added class constructor for Superball board and implemented skeleton for collect() and spawnsquares().
 - April 16
    4 hours: Added disjoint sets class and implemented it into superball board class functions. Improved collect function.
 - April 26
    30 minutes: Added notes from TA's and debugged some.
 - May 2
    4 hours: Started implementation of 2 player version (skeleton code), made collect and spawn squares in 2 player code.
 - May 7
    5 hours: Small changes to 2player code, implemented half of hard AI code.
 - May 8
    4 hours: readme, 2 player debugging, wrote 2 player computer scoring function, made easy AI, adding 2 player delay, lots of small debugging.
 - May 9
    1 hours: commenting javascript files, last debugging
 - May 11
    1 hour: commenting, time logging