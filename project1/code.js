/*
TODO: improve pen performance ( maybe not possible at current level )
TODO: Implement Text
 */

$(document).ready(function(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var drawing = {
		shapes: [], // contain all shapes to be drawn
		redos: [],
		backround: new Image(),
		nextShape: "pen", // String indicator for current mode
		size: 2, // stroke width of current object
		nextColor: "#000000",
		current: new Pen(0, 0, "#000000", 0),
		offX: $("#canvas").offset().left, // the offset of canvas
		offY: $("#canvas").offset().top,

		DrawAll: function () {
			this.Clear();
			ctx.save();
			ctx.drawImage(this.backround, 0, 0);
			for(var i = 0; i < this.shapes.length; i++){
				ctx.strokeStyle = this.shapes[i].color;
				ctx.lineWidth = this.shapes[i].width;
				this.shapes[i].draw();
			}
			ctx.lineWidth = this.current.width;
			ctx.strokeStyle = this.current.color;
			this.current.draw();
			ctx.restore();
		},

		Clear: function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

	};

	var undod = false;
	var pressed = false;
	var cleared = false;
	// event handlers

	$("#canvas").mousedown(function(e){
		if(undod){
			drawing.redos = [];
		}
		canvas.focus();
		pressed = true;
		undod = false;
		if(drawing.nextShape === "rect"){
			drawing.current = new Rect(e.clientX - drawing.offX, e.clientY - drawing.offY, drawing.nextColor, drawing.size);
		}else if(drawing.nextShape === "line"){
			drawing.current = new Line(e.clientX - drawing.offX, e.clientY - drawing.offY, drawing.nextColor, drawing.size);
		}else if(drawing.nextShape === "pen"){
			drawing.current = new Pen(e.clientX - drawing.offX, e.clientY - drawing.offY, drawing.nextColor, drawing.size);
		}else if(drawing.nextShape === "circle"){
			drawing.current = new Circle(e.clientX - drawing.offX, e.clientY - drawing.offY, drawing.nextColor, drawing.size);
		}else if(drawing.nextShape === "text"){
			drawing.current = new myText(e.clientX - drawing.offX, e.clientY - drawing.offY, drawing.nextColor, drawing.size);
		}
	});

	$("#canvas").mousemove(function(e){
		if(pressed){
			drawing.current.dynamicSet(e.clientX - drawing.offX, e.clientY - drawing.offY);
			drawing.DrawAll();
		}
	});

	$("#canvas").mouseup(function(e){
		if(pressed && drawing.nextShape != "text"){
			drawing.shapes.push(drawing.current);
			drawing.DrawAll();
			pressed = false;
		}

	});

	$("#canvas").keydown(function(e){
		if(drawing.nextShape === "text"){
		}
	});

	$("#canvas").mouseleave(function(){
		drawing.shapes.push(drawing.current);
		pressed = false;
	});

	$('#canvas').mouseout(function(){
		pressed = false;
	});

	$('input[name="mode"]').click(function(){
		drawing.nextShape = $('input[name="mode"]:checked').val();
	});

	$('input[name="color"]').click(function(){
		drawing.nextColor = $('input[name="color"]:checked').val();
	});

	$("input[name='size']").change(function(e){
		drawing.size = $("input[name='size']").val();
	});

	$("#save").click(function () {
		canvas.toBlob(function(blob){
			saveAs(blob, "image.png");
		});
	});

	$("#load").change(function(e){
		var reader = new FileReader();
		reader.onload = function(event){
			var img = new Image();
			img.onload = function(){
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img,0,0);
			};
			img.src = event.target.result;
			drawing.backround = img;
		};
		reader.readAsDataURL(e.target.files[0]);
	});

	$("#undo").click(function () {
		drawing.current = new Shape(0, 0, 0, 0);
		if(!undod){
			drawing.shapes.pop();
			undod = true;
		}
		drawing.redos.push(drawing.shapes.pop());
		drawing.DrawAll();
	});

	$("#redo").click(function(){
		if(drawing.redos.length != 0){
			drawing.shapes.push(drawing.redos.pop());
		}
		drawing.DrawAll();
	});

	$("#clear").click(function(){
		drawing.shapes = [];
		drawing.Clear();
	});

	// class constructor functions
	function Shape(x, y, color, width){
		this.x = x;
		this.y = y;
		this.color = color;
		this.width = width;

		this.draw = function(){}
	}

	function myText(){ // named to avoid conflicts
		Shape.apply(this, arguments);
		this.txt = "Write Here";

		this.draw = function(){
			ctx.strokeText(this.txt, this.x, this.y);
			ctx.stroke();
		};

		this.dynamicSet = function(){}
	}

	function Circle(){
		Shape.apply(this, arguments);
		this.ry = 0;
		this.rx = 0;

		this.draw = function(){
			ctx.beginPath();
			for(var i = 0; i < 2 * Math.PI; i += 0.1){
				var xpos = this.x - (this.rx * Math.sin(i)) * Math.sin(0) + (this.rx * Math.cos(i)) * Math.cos(0);
				var ypos = this.y - (this.ry * Math.cos(i)) * Math.sin(0) + (this.ry * Math.sin(i)) * Math.cos(0);

				if( i === 0){
					ctx.moveTo(xpos, ypos);
				}else{
					ctx.lineTo(xpos, ypos);
				}
			}
			ctx.closePath();
			ctx.stroke();
		};

		this.dynamicSet = function(nextX, nextY){
			this.rx = Math.abs(this.x - nextX);
			this.ry = Math.abs(this.y - nextY);
		};
	}

	function Pen(){
		Shape.apply(this, arguments);
		this.segments = [];

		this.draw = function(){
			ctx.save();
			ctx.lineJoin = ctx.lineCap = 'round'; // makes smooth lines at larger sizes
			for(var i = 0; i < this.segments.length; i++){
				this.segments[i].draw();
			}
			ctx.restore()
		};

		this.dynamicSet = function(nextX, nextY){
			var next = new Line(this.x, this.y, this.color, this.width);
			next.dynamicSet(nextX, nextY);
			this.segments.push(next);
			this.x = nextX;
			this.y = nextY;
		};
	}

	function Line(){
		Shape.apply(this, arguments);
		// destination points
		this.dx = this.x;
		this.dy = this.y;

		this.draw = function(){
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.dx, this.dy);
			ctx.closePath();
			ctx.stroke();
		};

		this.dynamicSet = function(nextX, nextY){
			this.dx = nextX;
			this.dy = nextY;
		};
	}

	function Rect(){
		Shape.apply(this, arguments);
		this.length = 0;
		this.height = 0;

		this.draw = function(){
			ctx.strokeRect(this.x, this.y, this.length, this.height);
			ctx.stroke();
		};

		this.dynamicSet = function(nextX, nextY){
			this.length = nextX - this.x;
			this.height = nextY - this.y;
			this.draw();
		};
	}

	// inheritance handilng
	Rect.prototype = new Shape();
	Line.prototype = new Shape();
	Pen.prototype = new Shape();
	Circle.prototype = new Shape();
	Text.prototype = new Shape();

	// forms should never submit
	$("form").submit(function(e){
		e.preventDefault();
	});
});



/*

// changing global
var pressed = false;
	// set up event handlers here


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


	$("#clear").click(function(e){
		e.preventDefault();
		drawing.clear();
	});
}
	*/