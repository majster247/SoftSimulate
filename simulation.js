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


    //Power calculation

    for(var i=0; i<NUMP; i++){
        fx[i]=0;
        fy[i]=-m*g;
    }

    var x1, x2, y1, y2;
    var fs;
    var dvx, dvy;
    var Fx, Fy;
    
    for(var i=0; i<NUMS; i++){
        var p1 = springs[i*3 + 0];
        var p2 = springs[i*3 + 1];
        var d0 = springs[i*3 + 2];

        x1 = x[p1]; y1 = y[p1];
        x2 = x[p2]; y2 = y[p2];
        var d=dist(x1,y1,x2,y2);
    

        if(d>0){
            var tx = (x2-x1)/d;
            var ty = (y2-y1)/d;

            dvx = vx[p1]-vx[p2];
            dvy = vy[p1]-vy[p2];

            fs = (d - d0)*KS;
            fs = fs + (dvx*tx + dvy*ty)*KD;

            Fx = tx*fs;
            Fy = ty*fs;

            fx[p1] -= Fx; fy[p1] -= Fy;
            fx[p2] += Fx; fy[p2] += Fy;

            nx[i] = ty;
            ny[i] = -tx;
        }
    }

    //capacities of the bodies
    var volume = 0;
    for(var i=0; i<NUMS; i++){
        var p1 = springs[i*3 + 0];
        var p2 = springs[i*3 + 1];
        
        x1 = x[p1]; y1 = y[p1];
        x2 = x[p2]; y2 = y[p2];
        d = dist(x1,y1,x2,y2);
        volume += 0.5 * Math.abs(x1 - x2) * Math.abs(nx[i])*(d);
    }

    //change of pressure

    if(pressure<PMAX){
        pressure = pressure + 0.01 * PMAX;
    }

    var pressurev;
    for(var i=0; i<NUMS; i++){
        var p1=springs[i*3 + 0];
        var p2=springs[i*3 + 1];
        x1 = x[p1]; y1 = y[p1];
        x2 = x[p2]; y2 = y[p2];
        d = dist(x1,y1,x2,y2);
        pressurev = 0.5 * d * pressure * (1.0/volume);
        fx[p1] += pressurev * nx[i]; fy[p1] += pressurev * ny[i];
        fx[p2] += pressurev * nx[i]; fy[p2] += pressurev * ny[i];
    }

    //Integration
    if(VerletInitialized==0){
        VerletInitialized=1;
        for(var i=0; i<NUMP; i++){
            xp1[i] = x[i]+dt*dt*fx[i]/m;
            yp1[i] = y[i]+dt*dt*fy[i]/m;
        }
    }else{
        var YBOTTOM = 50;
        var KSCOLLISION = 220;
        for(var i=0; i<NUMP; i++){
            if(y[i]<YBOTTOM){ fy[i] = f[i] - KSCOLLISION*(y[i]-YBOTTOM); }

            xp1[i] = 2*x[i] - xm1[i] + dt*dt*fx[i]/m;
            yp1[i] = 2*y[i] - ym1[i] + dt*dt*fy[i]/m;
        }
    }

    for(var i=0; i<NUMP; i++){
        xm1[i] = x[i];
        ym1[i] = y[i];
        x[i] = xp1[i];
        y[i] = yp1[i];

        vx[i] = (x[i]-xm1[i])/(2*dt);
        vy[i] = (y[i]-ym1[i])/(2*dt);
    }

    //Draw

    resetView();

    for(var i=0; i<NUMS; i++){
        var p1 = springs[i*3 + 0];
        var p2 = springs[i*3 + 1];

        x1 = x[p1]; y1 = y[p1];
        x2 = x[p2]; y2 = y[p2];
        line(x1,y1,x2,y2);
    }



    requestAnimationFrame(loop);
}
