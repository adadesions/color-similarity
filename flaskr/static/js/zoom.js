/*
    zoom.js 
    To draw an image and get image data to other canvas
*/

//  Import file to system
var img = new Image();
img.src = '../data/train_1_resize.jpg';
img.onload = function() {
    draw(this);
};

function reconstruct_rgb(data) {
    recon_img = []
    for(var i = 0, n = data.length; i < n; i += 4) {
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];
        recon_img.push([red, green, blue]);
    }
    return recon_img;
}

// Drawing image function
function draw(img) {
    var canvas = document.getElementById('source');
    var ctx = canvas.getContext('2d');

    // Get basic image infomation
    var imWidth = img.width;
    var imHeight = img.height;
    var imSize = document.getElementById('image-size');
    imSize.innerHTML = '('+imWidth+', '+imHeight+')';

    // Set up canvas and draw an image
    ctx.canvas.width = imWidth;
    ctx.canvas.height = imHeight;
    ctx.drawImage(img, 0, 0, imWidth, imHeight);
    img.style.display = 'none';

    // Init blank image for cropping purpose
    var cw = 210;
    var ch = 210;
    var crop_img = ctx.createImageData(cw, ch);

    // Preview function use to get partialy image data from main canvas
    var preview = function(event) {
        // get mouse position from event object
        var x = event.layerX;
        var y = event.layerY;
        var mouse_position = document.getElementById('mouse-position');

        // display mouse position on screen
        mouse_position.innerHTML = '('+x+', '+y+')';

        // clear and redraw a canvas
        ctx.clearRect(0, 0, imWidth, imHeight);
        ctx.drawImage(img, 0, 0, imWidth, imHeight);

        // get image to from specific region
        crop_img = ctx.getImageData(x+5, y+5, cw-10, ch-10);

        // Drawing a rectangle which following the pointer
        ctx.beginPath();
        ctx.rect(x, y, cw, ch);
        ctx.strokeStyle = "red";
        ctx.stroke();
    };

    is_clicked = false;
    var crop_fnc = function(canvas_id) {
        var capture = document.getElementById(canvas_id).getContext('2d');
        capture.canvas.width = cw;
        capture.canvas.height =ch;
        capture.putImageData(crop_img, 0, 0);

        if (canvas_id == 'cap-master') {
            is_clicked = true;
        }
        
        if (canvas_id == 'cap-compare' && is_clicked) {
            var master = document.getElementById('cap-master').getContext('2d');
            data = master.getImageData(0, 0, cw, ch).data;
            rgb = reconstruct_rgb(data);
            console.log(rgb);
        };
    };

    canvas.addEventListener('mousemove', preview);
    canvas.addEventListener('click', () => crop_fnc('cap-master'));
    canvas.addEventListener('mousemove', () => crop_fnc('cap-compare'));
}