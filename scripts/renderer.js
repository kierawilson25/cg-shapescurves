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
		//var rect = {
		var left_bottom = {x: 200, y: 100};
		var right_top = {x: 700, y: 400};
		var color = [75, 0 ,130, 255];
		//}
		this.drawRectangle(left_bottom, right_top, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {

    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {

    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {

    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        //drawLine(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
		//topleft to top right
		this.drawLine(left_bottom.x, right_top.y, right_top.x, right_top.y, color, framebuffer);
		//top right to bottom right
		this.drawLine(right_top.x, right_top.y, right_top.x, left_bottom.y, color, framebuffer);
		//bottom right to bottom left
		this.drawLine(right_top.x, left_bottom.y, left_bottom.x, left_bottom.y, color, framebuffer);
		//bottom left to top left
		this.drawLine(left_bottom.x, left_bottom.y, left_bottom.x, right_top.y, color, framebuffer);
		
		
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCirle(center, radius, color, framebuffer) {
        
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
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
