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

            fg = $('#img_logo')[0];
            drawingCanvas.width = fg.width;
            drawingCanvas.height = fg.height;

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
    var all_scores = [];

    $('#compare').on("click", function(e) {
        e.preventDefault();
        if (!$(this).attr("disabled")) {
            $('#next').css("display", "block").attr("disabled", true);
            $(this).css("display", "none");

            logo = $('#img_logo').attr("alt");
            logo_name = logo;
            if (logo.indexOf("_") != -1) {
                logo_name = logo.split("_")[0];
            }

            var score = colorDifference(color, BRAIN[logo]);
            all_scores.push(score);
            $("#after_score").css('display', 'block');
            $("#score").countTo({
                "interval": 10,
                "startNumber": 0,
                "endNumber": score,
                "onFinish": function() {
                    $('#next').attr("disabled", false);
                    $("#score").text(score);

                    $.get("/success", {
                        score: score,
                        game: "Basic",
                        level: logo_name
                    });
                }
            });

            $("#real_img").attr("src", "/media/images/" + logo_name + ".png");

            // SUPER HACKY
            // "Semi-threading" in order to the the right readjustment_width
            // while the image is still loading
            $("real_img").one('load', function() {
                if(this.complete) $(this).load();
            });

            $('#real_img').load(function() {
                readjustment_width = this.width()/2;
                $('#real_img').css({
                    "display": "inline",
                    "left": "50%",
                    "margin-left" : -readjustment_width
                });
            });
            $('#real_img').fadeIn(800);

            $("a#tweetintent").attr("href", "https://twitter.com/intent/tweet?text=I got "+score+" / 100 for the \""+logo_name.capitalize()+"\" logo http://brandseenapp.com/&via=brandseen");
           
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
                $('#layer_img').attr("src", "").css("display", "none");
                $("#real_img").attr("src", "").css("display", "none");
                nextLevel();

            }
        }

    });

    function nextLevel() {
        cp.remove();
        cp = Raphael.colorpicker(div.offset().left, div.offset().top, 250, DEFAULT_COLOR, document.getElementById('colorpicker'));
        var lvl = parseInt($("#current_level").text());
        var next_logo = "";
        var layer = "";

        $("#logo").slideToggle(700);

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
                $("#tape").hide();
                $("#logo").hide();
                $("#controls").hide();
                $("#instructions").hide();
                var average_score = averageScore(all_scores);
                $("#game").append("<center><h1 id='congrats'>Congrats! Your average score was "+average_score+"%</h1></center>");
                $("#game").append('<center><a href="https://twitter.com/intent/tweet?text='+escape("I got "+average_score+"% overall on Brandseen, the logo coloring game http://brandseenapp.com")+'&via=brandseen"><h3>Share your score!</h3></a></center>');
                $("#game").append("<center><table><tr><td>Coca Cola</td><td>"+all_scores[0]+"</td><td>Batman</td><td>"+all_scores[1]+"</td></tr><tr><td>Yahoo</td><td>"+all_scores[2]+"</td><td>Dropbox</td><td>"+all_scores[3]+"</td></tr><tr><td>McDonalds</td><td>"+all_scores[4]+"</td><td>Starbucks</td><td>"+all_scores[5]+"</td></tr><tr><td>IBM</td><td>"+all_scores[6]+"</td><td>Shell</td><td>"+all_scores[7]+"</td></tr><tr><td>Apple</td><td>"+all_scores[8]+"</td></tr></table></center>");
                $("#game").append('<center><img src="/media/images/cat1.jpeg" class="cat" /><img src="/media/images/cat2.jpeg" class="cat" /><img src="/media/images/cat3.jpeg" class="cat" /><img src="/media/images/cat5.jpeg" class="cat" /><img src="/media/images/cat4.jpeg" class="cat" /><img src="/media/images/cat6.jpeg" class="cat" style="vertical-align: top;"/></center>');
                
                $.get("/success", {
                    score: average_score,
                    game: "Basic",
                    level: "FINAL"
                });

                break;
            default:
                break;
        }

        if (lvl < 10) {
            $('#img_logo').attr("src", "/media/images/" + next_logo + ".png").attr("alt", next_logo);
            if (layer != "" || typeof(layer) == 'undefined') {
                $('#layer_img').attr("src", "/media/images/" + layer + ".png");
            }

            cp.onchange = function (clr) {
                color = clr.replace(reg, "#$1$2$3");
                changeLogoColor(color);
            };

            window.setTimeout( function() {
                changeLogoColor(DEFAULT_COLOR);
                if (layer != "" || typeof(layer) == 'undefined') {
                    readjustment_width = $('#layer_img').width()/2;
                    $('#layer_img').css({
                        "display": "inline",
                        "left": "50%",
                        "margin-left" : -readjustment_width
                    });
                }
            }, 700);

            $("#logo").slideToggle(600);
        }

    }

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function averageScore(array) {
        var total_score = 0;
        for (var i = 0; i < array.length; i++) {
            total_score += array[i];
        }
        return Math.round(total_score / array.length);
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

            r = a.red - b.red;
            g = a.green - b.green;
            b = a.blue - b.blue;
            result = Math.sqrt(Math.pow(r, 2)+Math.pow(g, 2)+Math.pow(b, 2));

            if (result <= 15) {
                return 100;
            } else if (result >= 140) {
                if (Math.random() >= 0.5) {
                    return 3.14;
                } else {
                    return 0;
                }
                
            } else {
                // New Algorithm
                // return Math.round(100-(1/4)*(Math.pow(result-20, 1.3)));

                // Test Algorithm
                return Math.round(100-(1/15)*(Math.pow(result-10, 1.5)));

                // Old Algorithm
                // return Math.round(100-((result-20)^1.07) + Math.sqrt(result*20) - 22.36);
            }
        }
    };
}
