var W = 800;
var H = 600;
var NUMP = 17;
var NUMS = 0;
var R= 30;

//Psyhic variables
var Pressure = 0;
var PMAX = 6890000;
var KS = 400, KD = 15;
var g=-9.8;
var m=4;

//Object status
var x=[], y=[]
var vx=[], vy=[]
var fx=[], fy=[]
var nx=[], ny=[]
var springs = [];

//Integration variables
var xm1 = [], ym1 = [];
var xp1 = [], yp1 = [];
var VerletInitialized = 0;
var dt=0.08;

//Extra data

var ctx;

//Init loop

window.onload = function() {
    var canvas = document.getElementById("canvas") ;
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d");

    CreateModel();

    loop();
}



function dist(_x1,_y1,_x2,_y2){
    return Math.hypot(_x1-_x2,_y1-_y2);
}

function addSpring(i, j){
    springs[NUMS*3 + 0]=i;
    springs[NUMS*3 + 1]=j;
    springs[NUMS*3 + 2]=dist(x[i],y[i],x[j],y[j]);
    NUMS++;
}

function CreateModel(){
    for(var i=0; i<NUMP; i++){
        x[i] = R * Math.sin(i * (2.0 * Math.PI) / NUMP)+W/2;
        y[i] = R * Math.cos(i * (2.0 * Math.PI) / NUMP)+H/2;
        vx[i] = vy[i] = 0;
    }

    for(var i=0; i<NUMP-1; i++){
        addSpring(i,i+1);
    }
    addSpring(i, 0);
}

function line(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function resetView(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = "#000000";
}


loop = function(){
    // here ad procedure for loop
    

    requestAnimationFrame(loop);
}
