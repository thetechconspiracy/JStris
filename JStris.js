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

//Game variables
var score = 0;
var lines = 0;

//Dimensions for the game board.  Maybe add the ability to change these in the game?
var width = 10;
var height = 20;

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
        if(altColor)
            ctx.fillStyle = 'rgb(100,100,100)';
        else
            ctx.fillStyle = 'rgb(120,120,120)';
        ctx.fillRect(posX, posY, squareSize, squareSize);
        altColor = !altColor;//Invert the boolean value
        
        posX += squareSize;
    }
    if(invertStart)
        altColor = !altColor;
    posY += squareSize
}

drawScoreboard();

function drawScoreboard(){
    //Draw other game elements
    //Set the initial raster positions
    const rasterPosXStart = horizPad + dimX;
    const rasterPosYStart = padding;

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
    ctx.fillText("Next", rasterPosX, rasterPosY);


    //Show the position of the raster.  Mainly for debugging
    if(debug){
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.arc(rasterPosX,rasterPosY,3,0,6.28318,false);
        ctx.fill();
    }
}