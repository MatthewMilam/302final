## Documentation
Matthew Milam and Bryce Richards
Final Project: Superball Browser Game

## Description
This project utilizes the languages HTML, CSS, and Javascript to make Superball into a playable browser game.
This version will include normal superball as well as a 2-player verison against multiple AI difficulties.
The 2 player version is similar to Superball, but instead each player gets one scoring zone. Each player can
move any tiles except those in the other's scoring zone, and can only collect in one's own scoring zone. 2 tiles
spawn on each half of the board, instead of 5 randomly, and the goal is to score more points than your opponent
before your side of the board fills up. Once a player's side fills up, the other player can keep playing on his side
until that fills up. The player with more points scored wins (this is implemented by the score increasing when the 
player scores and the score decreasing when the AI scores. A positive score means you won).

## Github link: 
https://github.com/MatthewMilam/302final

## User manual
1. Open any browser
2. Visit http://volweb2.utk.edu/~bricha37/

## Meetings (Both were present for all)
 - Mar 4 1:30, Figuring out what to do for our project and talking about general goals, 2 hours
    - We decided that Matthew would be more backend focused, and Bryce would be more frontend focused
 - Mar 27 3:00, Discussing how Superball should play and what work needs to be done for single player to be finished, 1 hour
    - We decided that Matthew would add the disjoint set/logic functionality, and Bryce would implement interactions with the HTML/CSS
 - Mar 29, 4:00, Discussing how were going to structure code, and make it more modular, 1 hour 30 minutes
    - Nothing in terms of work was changed, we just had to discuss how we were going to do things
 - April 21, 3:30, Discussing what the multiplayer game was going to be / how it would play 2 hours
    - We both agreed on the current version of two player superball conceptually
 - May 1, 4:00, Discussing what needs to be done for multiplayer code, 1 hour
    - We decided Matthew would code the AI logic, and Bryce would add the two player visual elements
 - May 8, 4:00, Discussed what need to be done for 2 player, what bugs should be fixed, and whats left to be done, 1 hour
    - Nothing in terms of work was changed
 - May 9, 10:30am, Made sure everything was functioning before demo day and added comments, 30 minutes
    - Nothing in terms of work was changed

## Time Log
Bryce Time Log:
 - Mar 4
    - 2 hours, Meeting with Matthew, setting up github and starting files
 - May 5
    - 1 hour, learning about HTML/CSS and how to use flexbox
 - Mar 6
    - 30 minutes, Adding HTML containers and CSS styling
 - Mar 7
    - 2 hours, Adding JavaScript functions and interactions with HTML
 - Mar 30
    - 2 hours, separated files apart to have a more OOP structure
 - April 11
    - 30 minutes, Rewrote the code to use the "data-number" attribute in HTML instead of an HTML id attribute
 - April 12
    - 1 hour, fixed various bugs
 - April 18
    - 30 minutes, Edited the UI
 - April 24
    - 30 minutes, Added a shadow selection instead of outline, added Score functionality
 - April 26
    - 2 hours, Fixed highlight bugs, added warning messages, added more of a tutorial
 - May 1
    - 2 hours, Added game over screen, fixed bugs, set up 2 player structure
 - May 7
    - 1 hour, Worked on adding the ability to change game mode
 - May 8
    - 1 hour minutes, Added menu for easy and hard
 - May 9
    - 2 hour, Commenting, improved the tutorial section look, and changed 2p goal cells look
 - May 11
    - 2 hour, Finished commenting, adding a time log, and also added a small change to the game menu screen



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