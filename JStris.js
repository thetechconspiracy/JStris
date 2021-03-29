/*
* JStris
* Written by Joseph Still
* Copyright 2021
* This software is licensed under the MIT license, a copy of which is avaliable below.
*/

/*
MIT License

Copyright (c) 2021 Joseph Trask Still

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const debug = true;

const canvas = document.querySelector('.JStrisCanvas');
const cWidth = canvas.width = window.innerWidth;
const cHeight = canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d'); //We only need 2D rendering for the falling block game.

ctx.fillStyle = 'rgb(180,180,180)'; //A fairly nice gray
ctx.fillRect(0,0,cWidth,cHeight);

//Dimensions for the game board.  Maybe add the ability to change these in the game?
var width = 10;
var height = 20;


//Game variables
var score = 0;
var lines = 0;
var level = 1;

//Initialize game board
var board = [];

for(let y = 0; y < height; ++y){
    board.push([0]);
    for(let x = 0; x < width; ++x){
        board[y][x] = 0;
    }
}

//Determine how large squares need to be
const padding = 20; //20px padding

//Center elements
//640px wide should be enough for anybody
const horizPad = Math.floor((cWidth-padding-800)/2)




//Determine the vertical dimension.  This will imply horiziontal sizing as well
var pxHeight = cHeight - (padding * 2);//Padding for top and bottom.

const squareSize = Math.floor(pxHeight/height);

const dimX = squareSize * width;
const dimY = squareSize * height;

board[4][5] = 3;
//Initial board, scoreboard drawing
drawBoard();
drawScoreboard();

drawPiece(1,3,3,3);


function drawBoard(){
    //Draw the game board
    var altColor = false; //Slightly darken the square to give a checkerboard effect
    var invertStart = (width % 2 == 0)
    
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(horizPad, padding, 800, dimY);
    
    var posX = horizPad;//Start in the padded area, not the edge of the screen.  These will increase.
    var posY = padding
    
    for(let x = 0; x < height; ++x){
        posX = horizPad;
        for(let y = 0; y < width; ++y){
            if(board[x][y] != 0)
                switch(board[x][y]){
                    case 1:
                        ctx.fillStyle = 'green';
                        break;
                    case 2:
                        ctx.fillStyle = 'blue';
                        break;
                    case 3:
                        ctx.fillStyle = 'red';
                        break;
                    case 4:
                        ctx.fillStyle = 'pink';
                        break;
                    case 5:
                        ctx.fillStyle = 'yellow';
                        break;
                    case 6:
                        ctx.fillStyle = 'purple';
                        break;
                    case 7:
                        ctx.fillStyle = 'aqua';
                        break;
                }
            else{
                if(altColor)
                    ctx.fillStyle = 'rgb(100,100,100)';
                else
                    ctx.fillStyle = 'rgb(120,120,120)';
            }

            ctx.fillRect(posX, posY, squareSize, squareSize);
            altColor = !altColor;//Invert the boolean value
            
            posX += squareSize;
        }
        if(invertStart)
            altColor = !altColor;
        posY += squareSize
    }
}

function drawScoreboard(){
    //Draw other game elements
    //Set the initial raster positions
    const rasterPosXStart = horizPad + dimX;
    const rasterPosYStart = padding;

    ctx.fillStyle = 'black';
    ctx.fillRect(rasterPosXStart, rasterPosYStart, 800-dimX, dimY);

    let rasterPosX = rasterPosXStart + padding;
    let rasterPosY = rasterPosYStart + padding;


    rasterPosY += 36;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillStyle = 'white';
    ctx.font = "36px arial";
    ctx.fillText("Score", rasterPosX, rasterPosY);
    ctx.fill()

    rasterPosY += 30;
    ctx.font = "24px arial";
    ctx.fillText(score, rasterPosX, rasterPosY);
    rasterPosY += 48;

    rasterPosY += 36;
    ctx.font = "36px arial";
    ctx.fillText("Lines", rasterPosX, rasterPosY);
    rasterPosY += 30;

    ctx.font = "24px arial";
    ctx.fillText(lines, rasterPosX, rasterPosY);
    rasterPosY += 48;

    rasterPosY +=36;
    ctx.font = "36px arial";
    ctx.fillText("Level", rasterPosX, rasterPosY);
    rasterPosY += 30;

    ctx.font = "24px arial";
    ctx.fillText(level, rasterPosX, rasterPosY);
    rasterPosY += 48;

    rasterPosY += 36;
    ctx.font = "36px arial";
    ctx.fillText("Next", rasterPosX, rasterPosY);


    //Show the position of the raster.  Mainly for debugging
    if(debug){
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.arc(rasterPosX,rasterPosY,3,0,6.28318,false);
        ctx.fill();
    }
}
//Functions to draw pieces
/*
*type:
    1: L
    2: J
    3: T
    4: S
    5: Z
    6: I
    7: O
*posX and posY are the coordinates on the board, starting from the top-left square.  Zero indexed.
*rot:
    0: normal
    1: 90 clockwise
    2: 180
    3: 270 clockwise
*/

//Draws the piece, as well as checking collision.  Returns true if piece has landed
function drawPiece(type, posX, posY, rot){
    if(type < 1 || type > 7)
        return;//Invalid type
    rot = rot % 4; //No matter how high rotation gets, it can't exceed 4
    ctx.beginPath();
    let rasterX = horizPad;
    let rasterY = padding;
    for(let i = 0; i < posX; ++i){
        rasterX += squareSize;
    }
    for(let i = 0; i < posY; ++i){
        rasterY += squareSize;
    }

    ctx.moveTo(rasterX, rasterY);

    ctx.fillStyle = 'pink';
    ctx.arc(rasterX,rasterY,3,0,6.28318,false);
    ctx.fill();


    switch(type){
        
        case 1://L
            //Draw piece
            ctx.fillStyle = 'green';
            switch(rot){
                case 0:
                    ctx.lineTo(rasterX + squareSize*3, rasterY);
                    rasterX += squareSize*3;
                    ctx.lineTo(rasterX, rasterY+squareSize*2);
                    rasterY += squareSize*2;
                    ctx.lineTo(rasterX - squareSize, rasterY);
                    rasterX -= squareSize;
                    ctx.lineTo(rasterX, rasterY-squareSize);
                    rasterY -= squareSize;
                    ctx.lineTo(rasterX - squareSize * 2, rasterY);
                    rasterX -= squareSize * 2;
                    ctx.lineTo(rasterX, rasterY - squareSize);
                    rasterY -= squareSize;
                    ctx.fill();
                    
                    
                    //Check collision
                    if(board[posX+2][posY + 2] != 0 || 
                        board[posX+1][posY + 1] != 0 ||
                        board[posX+1][posY] != 0 ||
                        posY + 1 > height){
                        //Piece has landed
                        board[posY][posX] = 1;
                        board[posY][posX+1] = 1;
                        board[posY][posX+2] = 1;
                        board[posY+1][posX+2] = 1;
                        return true;
                    } else return false;
                case 1:
                    rasterX += squareSize;
                    rasterY += squareSize;
                    ctx.moveTo(rasterX, rasterY);
                    rasterX += squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY -= squareSize * 2;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX += squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY += squareSize * 3;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX -= squareSize * 2;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY -= squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    ctx.fill()

                    //Check collision
                    if(board[posX+2][posY+1] != 0 ||
                        board[posX+2][posY+2] != 0 ||
                        posY + 2 > height){
                            board[posY+1][posX+1] = 1;
                            board[posY+1][posX+2] = 1;
                            board[posY][posX+2] = 1;
                            board[posY-1][posX+2] = 1;
                            return true;
                    }else return false;
                case 2:
                    ctx.moveTo(rasterX, rasterY);
                    rasterY += squareSize * 2;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX += squareSize * 3;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY -= squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX -= squareSize * 2;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY -= squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX -= squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    ctx.fill();


                    //Check collison
                    if(board[posY+2][posX] != 0 ||
                        board[posY+2][posX+1] != 0 ||
                        board[posY+2][posX+2] != 0 ||
                        posY + 1 > height){
                            board[posY][posX] = 1;
                            board[posY+1][posX] = 1;
                            board[posY+1][posX+1] = 1;
                            board[posY+1][posX+2] = 1;
                            return true;
                        }else return false;
                case 3:
                    rasterX += squareSize;
                    ctx.moveTo(rasterX, rasterY);
                    rasterX += squareSize * 2;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY += squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX -= squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY += squareSize * 2;
                    ctx.lineTo(rasterX, rasterY);
                    rasterX -= squareSize;
                    ctx.lineTo(rasterX, rasterY);
                    rasterY -= squareSize * 3;
                    ctx.lineTo(rasterX, rasterY);
                    ctx.fill();
                    
                    
                    //Check collision
                    if(board[posY+3][posX+1] != 0 ||
                        board[posY+1][posX+2] != 0||
                        posY + 2 > height)
                    {
                        board[posY][posX+1] = 1;
                        board[posY][posX+2] = 1;
                        board[posY+1][posX+1] = 1;
                        board[posY+2][posX+1] = 1;
                    }else return false;
            }
            

            break;
        case 2://J
            ctx.fillStyle = 'blue';
            break;
        case 3://T
            ctx.fillStyle = 'red';
            break;
        case 4://S
            ctx.fillStyle = 'pink';
            break;
        case 5://Z
            ctx.fillStyle = 'yellow';
            break;
        case 6://I
            ctx.fillStyle = 'purple';
            break;
        case 7://O
            ctx.fillStyle = 'aqua';
            break;
    }
    
}

function rotatePiece(){
    //Check collison.  If there is, move the piece up so it is on top of the set pieces.
    console.log("Not implemented yet");
}

/*type:
    1: L
    2: J
    3: T
    4: S
    5: Z
    6: I
    7: O
*/
function drawNext(type){
    console.log();
}