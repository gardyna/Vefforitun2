/**
 * Created by Dagur on 1/13/2015.
 */

// CONSTANTS that for some reason wouldn't initialize within objects
var canvas, ctx;


var drawing = {
	shapes: [],
	nextShape: "pen",
	nextColor: "#000000",
	startX: 0,
	startY: 0,
	current: new Shape(0,0,0),


	drawAll: function(){
		var width = ctx.lineWidth;
		for(var i = 0; i < this.shapes.length; ++i){
			ctx.strokeStyle = drawing.shapes[i].color;
			ctx.lineWidth = drawing.shapes[i].size;
			drawing.shapes[i].draw();
		}
		ctx.lineWidth = width;
	},

	clear: function(){
		//TODO: implement
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
};

// changing global
var pressed = false;

function init(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	var offX = $("#canvas").offset();
	var offY = offX.top;
	var size = 2;
	offX = offX.left;
	// set up event handlers here
	$("input[type='number']").change(function(e){
		size = $("input[type='number']").val();
		e.preventDefault();
	});

	$('input[name="mode"]').click(function(){
		drawing.nextShape = $('input[name="mode"]:checked').val();
	});

	$('input[name="color"]').click(function(){
		drawing.nextColor = $('input[name="color"]:checked').val();
	});

	$('#canvas').mousedown(function(e){
		pressed = true;
		//TODO: implement
		if(drawing.nextShape === 'rect'){
			drawing.current = new Rect(e.clientX - offX, e.clientY - offY, drawing.nextColor, size);
		}else if(drawing.nextShape === 'line'){
			drawing.current = new Line(e.clientX - offX, e.clientY - offY, drawing.nextColor, size);
		}else if(drawing.nextShape === "pen"){
			drawing.current = new Pen(e.clientX - offX, e.clientY - offY, drawing.nextColor, size);
		}
		drawing.drawAll();
	});

	$('#canvas').mousemove(function(e){
		// TODO: implement
		if(pressed){
			drawing.clear();
			ctx.strokeStyle = drawing.current.color;
			drawing.drawAll();
			drawing.current.dynamicDraw(e.clientX - offX, e.clientY - offY);


		}
	});

	$("#canvas").mouseup(function (e) {
			drawing.clear();
			drawing.shapes.push(drawing.current);
			drawing.drawAll();
		pressed = false;
	});

	$('#canvas').mouseout(function(e){
		pressed = false;
	});

	$("#clear").click(function(e){
		e.preventDefault();
		drawing.clear();
	});
}


// class contructor functions
function Shape(x, y, color, size){
	this.x = x;
	this.y = y;
	this.color = color;
	this.size = size;
}

function Rect(x, y, color, size){
	Shape.apply(this, [x, y, color, size]);
	this.length = 0;
	this.height = 0;

	this.dynamicDraw = function(x, y){
		this.length = x - this.x;
		this.height = y - this.y;
		// for some unexplainable reason calling this.draw causes weird drawing errors
		ctx.strokeRect(this.x, this.y, this.length, this.height);
		ctx.stroke();
	};

	this.draw = function( ){
		ctx.strokeRect(this.x, this.y, this.length, this.height);

		ctx.stroke();
	}
}

function Line(x, y, color, size){
	Shape.apply(this, [x, y, color, size]);

	this. endX = 0;
	this.endY = 0;

	this.dynamicDraw = function(x, y){
		this.endX = x;
		this.endY = y;
		this.draw();
	};

	this.draw = function(){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);
		ctx.closePath();
		ctx.stroke();
	}
}

function Pen(x, y, color, size){
	Shape.apply(this, [x, y, color, size]);

	this.dynamicDraw = function(x, y){

	};

	this. draw = function(){

	}
}


// inheritances
Rect.prototype = new Shape();
Line.prototype = new Shape();
Pen.prototype = new Shape();