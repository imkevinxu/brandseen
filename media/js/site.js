window.onload = function () {
    /* COLOR PICKER IMPLEMENTATION */
    var reg = /^#(.)\1(.)\2(.)\3$/;
    var DEFAULT_COLOR = "#808080";

    var img;
    var width;
    var height;
    var fg;
    var buffer;
    var color = DEFAULT_COLOR;
    var drawingCanvas = document.getElementById('tinted_logo');
    var x = drawingCanvas.getContext('2d');

    var hideImage = function() {
        $img = $('#img_logo');
        width = $img.width();
        height = $img.height();
        $img.css('position', 'absolute').css('top', '-9999px');
    };

    hideImage();
    
    // this is where colorpicker created
    var div = $('#colorpicker');
    var cp = Raphael.colorpicker(div.offset().left, div.offset().top, 250, DEFAULT_COLOR, document.getElementById('colorpicker'));

    // assigning onchange event handler
    cp.onchange = function (clr) {
        color = clr.replace(reg, "#$1$2$3");
        changeLogoColor(color);
    };

    var changeLogoColor = function(color) {
        // Check the element is in the DOM and the browser supports canvas
        if(drawingCanvas && drawingCanvas.getContext) {
            var img = document.getElementById('img_logo');
            fg = new Image();
            fg.src = img.src;
            fg.width = drawingCanvas.width = img.width;
            fg.height = drawingCanvas.height = img.height-2;

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
            // x.drawImage(fg,0,0,fg.width,fg.height);

            // then set the global alpha to the amount that you want to tint it, and draw the buffer directly on top of it.
            x.drawImage(buffer,0,0);
        }
    };

    changeLogoColor(DEFAULT_COLOR);
    var logo;
    var overall_score = 0;

    $('#compare').on("click", function(e) {
        e.preventDefault();
        if (!$(this).attr("disabled")) {
            $('#next').css("display", "block").attr("disabled", true);
            $(this).css("display", "none");

            logo = $('#img_logo').attr("alt");
            var score = colorDifference(color, BRAIN[logo]);
            overall_score += score;
            $("#after_score").css('display', 'block');
            $("#score").countTo({
                "interval": 10,
                "startNumber": 0,
                "endNumber": score,
                "onFinish": function() {
                    $('#next').attr("disabled", false);
                }
            });
        }

    });

    $('#next').on("click", function(e) {
        e.preventDefault();
        if (!$(this).attr("disabled")) {
            $('#compare').css("display", "block");
            $(this).css("display", "none");

            $("#after_score").css('display', 'none');
            var next_level = parseInt($("#current_level").text());
            next_level++;
            if (next_level <= 10) {
                $("#current_level").html(next_level);
                $('#layer_img').css("display", "none");
                nextLevel();
            }
        }

    });

    function nextLevel() {
        cp.remove();
        cp = Raphael.colorpicker(div.offset().left, div.offset().top, 250, DEFAULT_COLOR, document.getElementById('colorpicker'));
        var lvl = parseInt($("#current_level").text());
        var next_logo = "";
        var layer = ""

        switch(lvl) {
            case 2:
                next_logo = "batman_yellow";
                layer = "batman_black";
                break;
            case 3:
                next_logo = "yahoo";
                break;
            case 4:
                next_logo = "dropbox_bw";
                break;
            case 5:
                next_logo = "mcdonalds";
                break;
            case 6:
                next_logo = "starbucks_green";
                layer = "starbucks_white"
                break;
            case 7:
                next_logo = "ibm";
                break;
            case 8:
                next_logo = "shell_red";
                layer = "shell_yellow"
                break;
            case 9:
                next_logo = "apple";
                break;
            case 10:
                $("#logo").hide();
                $("#controls").hide();
                $("#instructions").hide();
                overall_score /= 9;
                $("#game").append("<h1>Congrats! Your average score was "+Math.round(overall_score)+"</h1>")
                $("#game").append('<img src="/media/images/cat1.jpeg" class="cat" />')
                        .append('<img src="/media/images/cat2.jpeg" class="cat" />')
                        .append('<img src="/media/images/cat3.jpeg" class="cat" />')
                        .append('<img src="/media/images/cat4.jpeg" class="cat" />')
                        .append('<img src="/media/images/cat5.jpeg" class="cat" />')
                        .append('<img src="/media/images/cat6.jpeg" class="cat" />');
                break;
            default:
                break;
        }

        $('#img_logo').attr("src", "/media/images/" + next_logo + ".png").attr("alt", next_logo);
        if (layer != "") {
            $('#layer_img').attr("src", "/media/images/" + layer + ".png").css("display", "inline");
        }
        $img = $('#img_logo');
        width = $img.width();
        height = $img.height();

        cp.onchange = function (clr) {
            color = clr.replace(reg, "#$1$2$3");
            changeLogoColor(color);
        };

        setTimeout(function() {changeLogoColor(DEFAULT_COLOR);}, 50);
    }

    function parseHexColor(c) {
        var j = {};

        if (c.length == 4) {
            var s = c.replace(/^#([0-9A-Fa-f]{1})([0-9A-Fa-f]{1})([0-9A-Fa-f]{1})$/, function(_, r, g, b) {
                j.red = parseInt(r, 16);
                j.green = parseInt(g, 16);
                j.blue = parseInt(b, 16);

                return "";
            });

        } else {
            var s = c.replace(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/, function(_, r, g, b) {
                j.red = parseInt(r, 16);
                j.green = parseInt(g, 16);
                j.blue = parseInt(b, 16);

                return "";
            });
        }

        if (s.length == 0) {
            return j;
        }
    };

    function colorDifference(a, b) {
        var a = parseHexColor(a);
        var b = parseHexColor(b);

        if(typeof(a) != 'undefined' && typeof(b) != 'undefined') {
            var result = 0;

            r = Math.abs(a.red - b.red);
            g = Math.abs(a.green - b.green);
            b = Math.abs(a.blue - b.blue);
            result = r+g+b;

            if (result <= 25) {
                return 100;
            } else if (result >= 113) {
                return 0;
            } else {
                console.log(result);
                return Math.round(100-(1/50)*(Math.pow(result-25, 1.9)));
            }
        }
    };

}