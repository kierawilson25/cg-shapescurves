class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
		this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
		
		var left_bottom = {x: 150, y: 150};
		var right_top = {x: 650, y: 450};
		var color = [0, 255 , 255, 255];
		
		this.drawRectangle(left_bottom, right_top, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
		
	var center = {x: 400, y: 300};
	var radius = 200;
	var color = [0, 255, 0, 255];
	var radius1 = 150;
	var radius2 = 100;
	var radius3 = 50;
	var radius4 = 1;
	this.drawCirle(center, radius, color, framebuffer);
	this.drawCirle(center, radius1, color, framebuffer);
	this.drawCirle(center, radius2, color, framebuffer);
	this.drawCirle(center, radius3, color, framebuffer);
	this.drawCirle(center, radius4, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
	var pt0 = {x:150, y: 300};
	var pt1 = {x:200, y: 500};
	var pt2 = {x:550, y: 550};
	var pt3 = {x:650, y: 300};
	var color = [195,88,245,255];
	this.drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer);
	
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
		this.drawName(framebuffer);
    }

    drawRectangle(left_bottom, right_top, color, framebuffer) {
		var topLeft = {x: left_bottom.x, y: right_top.y};
		var bottomRight = {x: right_top.x, y: left_bottom.y};
		var corners = [topLeft, bottomRight, right_top, left_bottom];
		var i = 0;
		var showPoints = {x: 0, y:0};
		
		//topleft to top right
		this.drawLine(left_bottom.x, right_top.y, right_top.x, right_top.y, color, framebuffer);
		//top right to bottom right
		this.drawLine(right_top.x, right_top.y, right_top.x, left_bottom.y, color, framebuffer);
		//bottom right to bottom left
		this.drawLine(right_top.x, left_bottom.y, left_bottom.x, left_bottom.y, color, framebuffer);
		//bottom left to top left
		this.drawLine(left_bottom.x, left_bottom.y, left_bottom.x, right_top.y, color, framebuffer);
		if(this.show_points == true){
			for(i; i< corners.length; i++){
				this.drawEndPoints(corners[i], framebuffer);
			}
		}
    }

 
    drawCirle(center, radius, color, framebuffer) {
        var radians = (2*Math.PI/this.num_curve_sections);
		var i =0;
		var currAngle = 0;
		var pt0x; 
		var pt0y;
		var pt1x;
		var pt1y;
		var showPoints = {x: 0, y:0};
		
		//for loop to draw given amount of lines
		for(i; i< this.num_curve_sections; i ++){
			//calculate first point
			pt0x = Math.round(center.x + (radius*Math.cos(currAngle)));
			pt0y = Math.round(center.y + (radius*Math.sin(currAngle)));
			//calculate second point 
			pt1x = Math.round(center.x + (radius*Math.cos(currAngle+radians)));
			pt1y = Math.round(center.y + (radius*Math.sin(currAngle+radians)));
			//increment currAngle
			currAngle += radians;
			//draw the lines
			this.drawLine(pt0x, pt0y, pt1x, pt1y, color, framebuffer);
			
			//show points
			if(this.show_points == true){
				showPoints.x = pt0x;
				showPoints.y = pt0y;
				this.drawEndPoints(showPoints, framebuffer);

			}
			
		}
		
			
    }


    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        var t = 0;
		var j = 0;
		var tDistance= 1.0/this.num_curve_sections;
		var pt0x; 
		var pt0y;
		var pt1x;
		var pt1y;
		var showPoints = {x: 0, y:0};
		if(this.show_points == true){
				this.drawEndPoints(pt1, framebuffer);
				this.drawEndPoints(pt2, framebuffer);
				this.drawEndPoints(pt3, framebuffer);
	
			}
	
		for(j; j< this.num_curve_sections; j ++){
			//calculate first point
			pt0x = Math.round(Math.pow(1- t, 3)*pt0.x+3*Math.pow(1-t, 2)*Math.pow(t, 2)*pt2.x+Math.pow(t,3)*pt3.x);
			pt0y = Math.round(Math.pow(1- t, 3)*pt0.y+3*Math.pow(1-t, 2)*Math.pow(t, 2)*pt2.y+Math.pow(t,3)*pt3.y);
			//increment t
			t += tDistance;
			//calculate Second point
			pt1x = Math.round(Math.pow(1- t, 3)*pt0.x+3*Math.pow(1-t, 2)*Math.pow(t, 2)*pt2.x+Math.pow(t,3)*pt3.x);
			pt1y = Math.round(Math.pow(1- t, 3)*pt0.y+3*Math.pow(1-t, 2)*Math.pow(t, 2)*pt2.y+Math.pow(t,3)*pt3.y);
			//draw the line
			this.drawLine(pt0x, pt0y, pt1x, pt1y, color, framebuffer);	
			//show points
			if(this.show_points == true){
				showPoints.x = pt0x;
				showPoints.y = pt0y;
				this.drawEndPoints(showPoints, framebuffer);
			}
		
		}
    }

	drawName(framebuffer){
		var namei = {x: 230, y: 320};
		var namea = {x: 680, y: 170};
		//points for e curve
		var pt0 = {x:400, y: 300};
		var pt1 = {x:800, y: 500};
		var pt2 = {x:800, y: 600};
		var pt3 = {x:400, y: 100};
	
		var temp = {x: 0, y: 0};
		
		//kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
		this.drawLine(50, 100, 50, 500, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 50;
			temp.y = 100;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 50;
			temp.y = 500;
			this.drawEndPoints(temp, framebuffer);
		}
		this.drawLine(50, 300, 180, 480, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 50;
			temp.y = 300;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 180;
			temp.y = 480;
			this.drawEndPoints(temp, framebuffer);
		}
		this.drawLine(50, 300, 180, 100, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 50;
			temp.y = 300;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 180;
			temp.y = 100;
			this.drawEndPoints(temp, framebuffer);
		}
		//iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
		this.drawLine(230, 100, 230, 300, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 230;
			temp.y = 100;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 230;
			temp.y = 300;
			this.drawEndPoints(temp, framebuffer);
		}
		this.drawCirle(namei, 3, [255, 0, 174, 255], framebuffer);
		//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
		this.drawBezierCurve(pt0, pt1, pt2, pt3, [255, 0, 174, 255], framebuffer);
		this.drawLine(270, 200, 400, 200, [255, 0, 174, 255], framebuffer);if(this.show_points == true){
			temp.x = 270;
			temp.y = 200;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 400;
			temp.y = 200;
			this.drawEndPoints(temp, framebuffer);
		}
		
		//rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
		this.drawLine(440, 100, 440, 300, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 440;
			temp.y = 100;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 440;
			temp.y = 300;
			this.drawEndPoints(temp, framebuffer);
		}
		this.drawLine(440, 250, 490, 300, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 440;
			temp.y = 250;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 490;
			temp.y = 300;
			this.drawEndPoints(temp, framebuffer);
		}
		this.drawLine(490, 300, 540, 250, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 490;
			temp.y = 300;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 540;
			temp.y = 250;
			this.drawEndPoints(temp, framebuffer);
		}
		//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 
		this.drawCirle(namea, 70, [255, 0, 174, 255], framebuffer);
		this.drawLine(750, 100, 750, 250, [255, 0, 174, 255], framebuffer);
		if(this.show_points == true){
			temp.x = 750;
			temp.y = 100;
			this.drawEndPoints(temp, framebuffer);
			temp.x = 750;
			temp.y = 250;
			this.drawEndPoints(temp, framebuffer);
		}	
	
	}
	/////////////////////////////////////////////////////////////////////////////////////
	drawEndPoints(center, framebuffer) {
        var radians = (2*Math.PI/this.num_curve_sections);
		var i =0;
		var currAngle = 0;
		var pt0x; 
		var pt0y;
		var pt1x;
		var pt1y;
		var radius = 3;
		var color = [245, 135,56, 255];
		
		//for loop to draw given amount of lines
		for(i; i< this.num_curve_sections; i ++){
			//calculate first point
			pt0x = Math.round(center.x + (radius*Math.cos(currAngle)));
			pt0y = Math.round(center.y + (radius*Math.sin(currAngle)));
			//calculate second point 
			pt1x = Math.round(center.x + (radius*Math.cos(currAngle+radians)));
			pt1y = Math.round(center.y + (radius*Math.sin(currAngle+radians)));
			//increment currAngle
			currAngle += radians;
			//draw the lines
			this.drawLine(pt0x, pt0y, pt1x, pt1y, color, framebuffer);
			
		}
		
			
    }
	
	//////////////////////////////////////////////////////////////////////////////////////
    drawLine(pt0, pt1, color, framebuffer)
    {
        drawLine(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
    }
        
    drawLine( x0, y0, x1, y1, color, framebuffer) // change to be pt0.y etc
    {
	
		if(Math.abs(y1-y0) <= Math.abs(x1 -x0))
        {
			if(x0 < x1)
            {
				this.drawLineLow(x0, y0, x1, y1, color, framebuffer);
			}
			else
            {
				this.drawLineLow(x1, y1, x0, y0, color, framebuffer);
			}
		}
		else
        {
			if (y0 < y1) 
            {
				this.drawLineHigh(x0, y0, x1,y1, color, framebuffer);
			}
			else
            {
				this.drawLineHigh(x1, y1, x0, y0, color, framebuffer);
			}
		}
	}
	
	drawLineLow(x0, y0, x1, y1, color, framebuffer)
	{
		
		var A = y1 -y0;
		var B = -(x1 - x0);
		var iy = 1; //incrementing y
		if(A<0){
			
			iy = -1; //this way we are actually subracting
			A *= -1; //flips the slope 
		}
		var D = 2*A + B;
		var y = y0;
		var x = x0;
		
		while(x <= x1)
		{
			this.setFramebufferColor(framebuffer, this.pixelIndex(x,y, framebuffer), color);
			x += 1;
			if(D <= 0)
			{
				D += 2 * A;
			}
			else
			{
				D += 2 * A + 2 * B;
				y += iy;
            }	
		}
	}
	
	drawLineHigh(x0, y0, x1, y1, color, framebuffer)
	{

		var A = x1 -x0;
		var B = y0 -y1;
		var ix = 1; //incrementing x
		if(A < 0)
        {
			ix = -1; //this way we are actually subracting
			A *= -1; //flips the slope 
		}
		var D = 2*A + B;
		var y = y0;
		var x = x0;
		
		while(y < y1)
		{
			
			this.setFramebufferColor(framebuffer, this.pixelIndex(x,y, framebuffer), color);
			y+=1;
			if(D <= 0)
			{
				D += (2 * A);
			}
			else
			{
				D += (2 * A + 2 * B);
				x += ix;
			}	
		}
	}
	
	setFramebufferColor(framebuffer, px, color)
	{
		
		framebuffer.data[px + 0]= color[0];
		framebuffer.data[px +1] = color[1];
		framebuffer.data[px +2]=color[2];
		framebuffer.data[px +3] = color[3];
	}
	
	pixelIndex(x,y, framebuffer)
	{
		return 4* y * framebuffer.width + 4 * x;
	}
    
};

