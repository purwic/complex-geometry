

const clearButton = document.getElementById("clear-button");
const mainDiv = document.getElementById("main-div");
const input = document.getElementById("input")
const colorInput = document.getElementById("color-input")
const lineSizeInput = document.getElementById("line-size-input")


var scaleW = 1;
var scaleZ = 1;
func = input.value





















const config = {
    'lineSize': lineSizeInput.value,
    'color': colorInput.value,
    'mode': 'lineTo',
    'radius': 10,
    'dpi': 10,
    'maxX': 12 * scaleZ,
    'maxY': 12 * scaleZ,
    'maxU': 12 * scaleW,
    'maxV': 12 * scaleW,
    'lastX': 0,
    'lastY': 0,
    'lastU': 0,
    'lastV': 0,
}

var canvasZ = document.getElementById("z");
var ctxZ = canvasZ.getContext("2d");

var canvasW = document.getElementById("w");
var ctxW = canvasW.getContext("2d");

// var drawZ = [];
// var drawW = [];
/* example object in the array drawZ: 
{
    'x': 0,
    'y': 867,
    'color': 'white',
    'lineSize': 5,
}
*/

//creating special functions
const parser = math.parser();
parser.evaluate('infsum(f, z) = ' + generateSum(1800));

parser.evaluate('h(n, z) = 1 / (n * (n + z)) ');
parser.evaluate('H = typed({"Complex": H(z) = z * infsum(h, z)})')



var erase = false;

//когда мышь нажата
canvasZ.onmousedown = function(event) {
    
    //что за кнопка нажата
    if(event.button === 0){
        erase = false;
    } else if(event.button === 2){
        erase = true;
    }   
    
    //когда мышь двигается 
    canvasZ.onmousemove = function(event){

        
        var x = event.offsetX;
        var y = event.offsetY;

        // drawZ.push({
        //     'x': x,
        //     'y': y,
        //     'color': config.color,
        //     'lineSize': config.lineSize,
        // });



        var z = math.complex(invX(x, config.maxX, canvasZ.width), invY(y, config.maxY, canvasZ.height));
        
        parser.evaluate('f = typed({"Complex": f(z) = '+ func +' })');
        var w = parser.evaluate('f('+ z +')');


        const u = canvX(w.re, config.maxU, canvasW.width);
        const v = canvY(w.im, config.maxV, canvasW.height);

        // console.log("z");
        // console.log(drawZ);
        // console.log("w");
        // console.log(drawW);



        // сколько точек между прошлым и текущим значением включая сами эти точки, типа 2 норма
        // а если больше то уже значит некоторые точки проебаны и не отрисованы

        console.log("i")
        console.log(makeDots(config.lastX, config.lastY, canvX(z.re, config.maxX, canvasZ.width), canvY(z.im, config.maxY, canvasZ.height)))


        // console.log(math.range(0,1,0.001))



        // drawW.push({
        //     'x': u,
        //     'y': v,
        //     'color': config.color,
        //     'lineSize': config.lineSize,
        // });




        if (event.shiftKey && config.lastX !== 0 && config.lastY!== 0) {

            draw(ctxZ, 'shiftLine', [x, y], config);
            draw(ctxW, 'shiftLine', [u, v], config);

        }
        else{

            //лкм
            if(!erase){
                //draws
                draw(ctxZ, 'lineTo', [x, y], config);
                draw(ctxW, 'lineTo', [u, v], config);
            }

            //пкм
            else{

            }
        }
        

        config.lastX = x;
        config.lastY = y;
        config.lastU = u;
        config.lastV = v;

    }



    //когда выходит за пределы
    canvasZ.onmouseout = function(event){
        ctxZ.beginPath();
        ctxW.beginPath();
    }
}


canvasZ.onmouseclick = function(event){}


// мышь оторвалась
document.addEventListener("mouseup", () => {
    canvasZ.onmousemove = null;
    ctxZ.beginPath();
    ctxW.beginPath();
});

//отмена контекстного меню
mainDiv.addEventListener('contextmenu', (e) => {e.preventDefault();});

//обработка нажатия кнопки
clearButton.addEventListener("click", () => {

    clear(ctxZ, canvasZ);
    clear(ctxW, canvasW);
    drawZ = [];
    drawW = [];
    config.lastX = 0;
    config.lastY = 0;
    config.lastU = 0;
    config.lastV = 0;

});

document.body.onkeyup = (e) => {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32)
    {

        clear(ctxZ, canvasZ);
        clear(ctxW, canvasW);
        drawZ = [];
        drawW = [];
        config.lastX = 0;
        config.lastY = 0;
        config.lastU = 0;
        config.lastV = 0;

    }
}




input.addEventListener('input', (e) => {
    func = e.target.value
});


colorInput.addEventListener('input', (e) => {
    
    config.color = colorInput.value
})


lineSizeInput.addEventListener('input', (e) => {
    
    config.lineSize = lineSizeInput.value
})

















































function draw(ctx, mode, xy, config) {

    const x = xy[0];
    const y = xy[1];
    const radius = config.radius;
    const color = config.color;
    
    ctx.lineWidth = config.lineSize;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;


    if (mode === 'lineTo') {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    else if (mode === 'circle') {
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    else if (mode ==='shiftLine') {
        if (ctx === ctxZ) {
            ctx.moveTo(config.lastX, config.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        } 

        else if (ctx === ctxW) {
            ctx.moveTo(config.lastU, config.lastV);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

}


function clear(ctx, canvas) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.beginPath();

}

// invert X to math coordinates
function invX(x, maxX, width) {return maxX*(2*x/width - 1);}

// invert Y to math coordinates
function invY(y, maxY, height) {return -maxY*(2*y/height - 1);}

//invert X to canvas coordinates
function canvX(x, maxX, width) {return Math.round(width/2*(x/maxX + 1));}

//invert Y to canvas coordinates
function canvY(y, maxY, height) {return Math.round(height/2*(-y/maxY + 1));}




function generateSum(n){
    var string = "";
    for (var i = 1; i <= n; i++){
        string += "f("+ i + ", z) +";
    }

    // i need to remove 2 last simbols from string
    string = string.substring(0, string.length - 2);
    return string;
}




function makeDots(x1, y1, x2, y2) {
    var dots = [];
    
    // Calculate the difference between the coordinates
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    // Determine the number of dots to create
    var numOfDots = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (var i = 0; i <= numOfDots; i++) {
        var t = i / numOfDots;
        var newX = x1 + dx * t;
        var newY = y1 + dy * t;
        dots.push({ x: newX, y: newY });
    }
    
    return dots;
}























// тыкнуть 2 точки и всё как идея при задании кривой а хотя хуйня тк это же кривая бля хотя не тк отрезок по t норм но t же действительная а так точно бля

// alpha - curve func
// f - z func


async function drawCurve(parser, alpha, f){

    step = 0.001;

    for (t in math.range(0, 1, step)){

        var z = parser.evaluate(alpha + '('+ t +')');
        
        parser.evaluate('f = typed({"Complex": f(z) = '+ func +' })');
        var w = parser.evaluate(alpha + '('+ t +')');


        const u = canvX(w.re, config.maxU, canvasW.width);
        const v = canvY(w.im, config.maxV, canvasW.height);
        
        ctxZ.lineTo(x, y);
        ctxZ.stroke();

    }

}