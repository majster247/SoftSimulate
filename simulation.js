var W = 400;				// rozmiar ekranu
var H = 600;				
var NUMP = 17;				// ilość punktów
var NUMS = 0;				// liczba sprężyn
var R = 30;					// promień ciała

// A2 - wielkości fizyczne
var pressure = 0;			// początkowe ciśnienie
var PMAX = 6890000;	// ciśnienie docelowe
var KS = 400, KD = 15;		// stała sprężystości i stała tłumienia dla sprężynek
var g = -9.8;				// stała grawitacji
var m = 4;					// masa pojedynczego punktu na powierzchni ciała

// A3 - stan obiektu
var x=[], y=[];				// pozycje
var vx=[], vy=[];			// prędkość punktów
var fx=[], fy=[];			// siły
var nx=[], ny=[];			// wektory normalne
var springs=[];

// A4 - dane do całkowania
var xm1 = [], ym1 = [];		// kopie punktów dla metody Verlet
var xp1 = [], yp1 = [];
var verletInitialized = 0;	// czy wykonano pierwszy krok metody całkowania?
var dt = 0.08;

// A5 - dane dodatkowe
var ctx;
// A6 - inicjalizacja - uruchom po załadowaniu strony
window.onload = function()
{
	// pobierz identyfikatory dla płótna
	var canvas = document.getElementById('canvas');
	canvas.width = W;	// ustaw wielkość płótna
	canvas.height = H;
	ctx = canvas.getContext('2d');	

	// stwórz model
	CreateModel();
	
	
	// pierwsze wywołanie pętli
	loop();
}

// A7 - Odległość dwóch wektorów
function dist(_x1, _y1, _x2, _y2)
{
	return Math.hypot(_x1 - _x2, _y1 - _y2);
}

// A8 - funkcja dodająca sprężynę
function AddSpring( i, j )
{
	springs[ NUMS*3 + 0 ] = i;		// punkt 1
	springs[ NUMS*3 + 1 ] = j;		// punkt 2
	springs[ NUMS*3 + 2] = dist(x[i], y[i], x[j], y[j]);  // odległość w stanie równowagi		
	NUMS++;					// sprężyna została dodana
}

// A9 - Stwórz model, punkty i sprężyny	
function CreateModel()
{	
	for(var i=0 ; i < NUMP ; i++)		// punkty na obwodzie
	{
		x[i] = R * Math.sin(i * (2.0 * Math.PI) /  NUMP  )+W/2;
		y[i] = R * Math.cos(i * (2.0 * Math.PI) /  NUMP  )+H/2;
		vx[i] = vy[i] = 0;
	}

	for(var i=0 ; i < NUMP-1 ; i++)		// tworzymy sprężyny
		AddSpring(i,i+1);   
	AddSpring(i,0);
}
	
// A10 - Procedury graficzne
function line(x1,y1, x2,y2)
{
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();	
}

function resetView()
{
	ctx.clearRect(0,0,W,H);
	ctx.strokeStyle = "rgb(0,0,0)";	
}	

// A11 - pętla symulacji
loop=function() 
{

		// A12 - Siła grawitacji
		for(var i=0; i<NUMP; i++)
		{
			fx[i] = 0;
			fy[i] = -m*g;
		}
		
		// A13 - siła sprężystości
		var x1,x2,y1,y2;
		var fs;				// siła sprężystości
		var dvx, dvy;		// różnica prędkości
		var Fx, Fy;			// wartości siły

		for(var i=0 ; i < NUMS ; ++i)					// pętla po sprężynach
		{
			var p1 = springs[i*3+0];					// indeks punktu 1
			var p2 = springs[i*3+1];
			var d0 = springs[i*3+2];					// odległość równowagowa

			x1 = x[ p1 ];	y1 = y[ p1 ];				// współrzędne punktów
			x2 = x[ p2 ];	y2 = y[ p2 ];					
			var d = dist(x1, y1, x2, y2);				// długość sprężyny
								
			if(d > 0)		
			{
				var tx = (x1 - x2) / d;					// wektor jednostkowy 
				var ty = (y1 - y2) / d;					// od punktu 2 do 1

				dvx = vx[p1] - vx[p2];					// różnica prędkości
				dvy = vy[p1] - vy[p2];

				fs = (d - d0)*KS;						// siła sprężystości Hooke'a
				fs = fs + ( dvx * tx + dvy * ty )*KD;	// tłumienie sprężyny (wzór 2.18)

				Fx = tx * fs;							// wartość siły "x"
				Fy = ty * fs;

				fx[ p1 ] -= Fx;	fy[ p1 ] -= Fy;			// dodaj siłę dla punktu 1
				fx[ p2 ] += Fx;	fy[ p2 ] += Fy;			// j. w. dla punktu 2

				nx[i] =  ty;							// wyznacz wektor normalny z obrotu
				ny[i] =  -tx;							// tx,ty
			}	// warunek d>0
		}	// pętla po sprężynach (for)	

		// A14 - oblicza objętość ciała
		var volume = 0;
		for(var i=0 ; i<NUMS ; i++)
		{
			var p1 = springs[i*3+0];
			var p2 = springs[i*3+1];
			x1 = x[ p1 ];		y1 = y[ p1 ];				
			x2 = x[ p2 ];		y2 = y[ p2 ];		
			d = dist(x1, y1, x2, y2);					// długość sprężyny		
			volume += 0.5 * (x1 + x2) * nx[i] * d;	// wzór 2.23 z 2.9.5
		}


		if(pressure < PMAX)	// pompowanie
			pressure = pressure + 0.01 * PMAX;
		// A15 - ciśnienie
		var pressurev;
		for(i=0 ; i<NUMS ; i++)
		{
			var p1 = springs[i*3+0];			// pobierz punkty sprężyny
			var p2 = springs[i*3+1];
			x1 = x[ p1 ];		y1 = y[ p1 ];	// współrzędne punktów
			x2 = x[ p2 ];		y2 = y[ p2 ];		
			d = dist(x1, y1, x2, y2);			// długość sprężyny	
			pressurev = 0.5  * pressure * (1.0/volume);		// wartość siły ciśnienia
			fx[ p1 ] += nx[i] * pressurev;		fy[ p1 ] += ny[i] * pressurev;	 // siła
			fx[ p2 ] += nx[i] * pressurev;		fy[ p2 ] += ny[i] * pressurev;
		}		

		
		
		// A16 całkowanie 
		if(verletInitialized == 0)
		{
			verletInitialized = 1;
			
			for(var i=0; i<NUMP; i++)
			{
				xp1[i] = x[i]+dt*dt*fx[i]/m;				// wzór 2.25
				yp1[i] = y[i]+dt*dt*fy[i]/m;
			}
		}
		else
		{	// wykonuj tylko dla iteracji > 0
			var YBOTTOM = H-50;							// pozycja podłogi
			var KSCOLLISION = 220;						// sprężystość przy odbiciu
			for(var i=0; i<NUMP; i++)
			{	
				// wirtualna sprężyna (kolizje ze ścianą)
				if(y[i]>YBOTTOM)	{ 		fy[i] = fy[i] - KSCOLLISION*(y[i]-YBOTTOM);		}
								
				// całkuj równania ruchu metodą Verlet
				xp1[i] = 2*x[i] - xm1[i] + dt*dt*fx[i]/m;		// równanie 2.24
				yp1[i] = 2*y[i] - ym1[i] + dt*dt*fy[i]/m;				
			}
		}
		
		// A17 przepisanie stanów dla metody Verlet i obliczenie prędkości
		for(var i=0; i<NUMP; i++)
		{
			xm1[i] = x[i];
			ym1[i] = y[i];
			x[i] =	xp1[i];
			y[i] = 	yp1[i];	

			vx[i] = (x[i] - xm1[i]) / (2*dt);
			vy[i] = (y[i] - ym1[i]) / (2*dt);			
		}

		// A18 - rysowanie ciała na płótnie
		resetView();

		// rysuj ciało miękkie
		for(i=0 ; i<NUMS ; i++)
		{
			var p1 = springs[i*3+0];			// pobierz punkty sprężyny
			var p2 = springs[i*3+1];
			x1 = x[ p1 ];		y1 = y[ p1 ];	// współrzędne punktów
			x2 = x[ p2 ];		y2 = y[ p2 ];		
			line(x1, y1, x2, y2);				// rysuj sprężynę
		}

		// narysuj logo

		// A19 ponowne wykonanie pętli
		requestAnimationFrame(loop);
};



