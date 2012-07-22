window.onload = function () {
    /* COLOR PICKER IMPLEMENTATION */
    var reg = /^#(.)\1(.)\2(.)\3$/;
    var DEFAULT_COLOR = "gray";
    
    // this is where colorpicker created
    var div = $('#colorpicker');
    var cp = Raphael.colorpicker(div.offset().left, div.offset().top, 250, DEFAULT_COLOR, document.getElementById('colorpicker'));

    var img;
    var width;
    var height;
    var fg;
    var buffer;
    var drawingCanvas = document.getElementById('tinted_logo');
    var x = drawingCanvas.getContext('2d');

    // assigning onchange event handler
    cp.onchange = function (clr) {
        var color = clr.replace(reg, "#$1$2$3");
        changeLogoColor(color);
    };

    var changeLogoColor = function(color) {
        // Check the element is in the DOM and the browser supports canvas
        if(drawingCanvas && drawingCanvas.getContext) {
            var img = document.getElementById('img_logo');
            fg = new Image();
            fg.src = img.src;
            fg.width = drawingCanvas.width = width;
            fg.height = drawingCanvas.height = height;

            // create offscreen buffer
            buffer = document.createElement('canvas');
            buffer.width = fg.width;
            buffer.height = fg.height;
            
            bx = buffer.getContext('2d');

            // fill offscreen buffer with the tint color
            bx.fillStyle = color;
            bx.fillRect(0,0,buffer.width,buffer.height);

            // destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
            bx.globalCompositeOperation = "destination-atop";
            bx.drawImage(fg,0,0,fg.width,fg.height);

            // to tint the image, draw it first
            x.drawImage(fg,0,0,fg.width,fg.height);

            //then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
            x.globalAlpha = 0.5;
            x.drawImage(buffer,0,0);
        }
    };

    var hideImage = function() {
        $img = $('#img_logo');
        width = $img.width();
        height = $img.height();
        $img.css('position', 'absolute').css('top', '-9999px');
    };

    hideImage();
    changeLogoColor(DEFAULT_COLOR);

}