/*
    zoom.js 
    To draw an image and get image data to other canvas
*/

// Main Scope
init();
filename = document.getElementById('filename');
filename.addEventListener('change', init);
color_checkbox = document.getElementById('rgb-checkbox');
color_checkbox.addEventListener('change', color_error);


//  Import file to system
function init(){
    // Initialization
    var img = new Image();
    filename = document.getElementById('filename').value;
    img.src = '../data/'+filename;
    img.onload = function() {
        draw(this);
    };
}


function reconstruct_rgb(data) {
    // Reconstruction image from Javascript format
    recon_img = [];
    for(var i = 0, n = data.length; i < n; i += 4) {
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];
        recon_img.push([red, green, blue]);
    }
    return recon_img;
}


function norm(x, y) {
    // L2-Norm function
    // x, y are a column vector.
    if(x.length == y.length) {
        sum = 0;
        for(var i = 0; i < x.length; i++) {
            sum += Math.pow(x[i] - y[i], 2);
        }
        return Math.sqrt(sum);
    }
    else {
        console.log('Length of two vector MUST the same length.');
        return -1;
    }
}


function rms(x, y) {
    // Roots-Mean-Squrt-Error
    // x, y are a column vector.

    // Maximum Mutual Imformation
    if(x.length != y.length) return -1;

    vec = [];
    for(var i = 0; i < x.length; i++) {
        vec.push(norm(x[i], y[i]));
    }

    sum = 0;
    n = x.length;
    for (let v of vec) {
        sum += Math.pow(v, 2);
    }

    return Math.sqrt(sum/n);
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
    var cw = document.getElementById('sample-width').value;
    var ch = document.getElementById('sample-height').value;
    var crop_img = ctx.createImageData(cw, ch);

    // Preview function use to get partialy image data from main canvas
    var preview = function(event) {
        // get mouse position from event object
        var x = event.layerX;
        var y = event.layerY;
        var mouse_position = document.getElementById('mouse-position');

        cw = document.getElementById('sample-width').value;
        ch = document.getElementById('sample-height').value;
        // display mouse position on screen
        mouse_position.innerHTML = '('+x+', '+y+')';

        // clear and redraw a canvas
        ctx.clearRect(0, 0, imWidth, imHeight);
        ctx.drawImage(img, 0, 0, imWidth, imHeight);

        // get image to from specific region
        crop_img = ctx.getImageData(x, y, cw, ch);

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
            crop_fnc('cap-compare');
        }
        
        if (canvas_id == 'cap-compare' && is_clicked) {
            var master = document.getElementById('cap-master').getContext('2d');
            var compare = document.getElementById('cap-compare').getContext('2d');
            master_data = master.getImageData(0, 0, cw, ch).data;
            compare_data = compare.getImageData(0, 0, cw, ch).data;
            master_rgb = reconstruct_rgb(master_data);
            compare_rgb = reconstruct_rgb(compare_data);

            similarity = Math.abs(rms(master_rgb, compare_rgb)-100);
            if (similarity > 100) similarity = 0;

            is_color_test = document.getElementById('rgb-checkbox').checked;
            if (is_color_test) {
                master = master_rgb[0]
                sample = compare_rgb[0]
                r_diff = (master[0]-sample[0]);
                g_diff = (master[1]-sample[1]);
                b_diff = (master[2]-sample[2]);

                let rgb_score = document.getElementById('rgb-score');
                rgb_score.innerHTML = `(${r_diff}, ${g_diff}, ${b_diff})`
            }

            sim_score = document.getElementById('similarity-score');
            sim_score.innerHTML = similarity.toFixed(2) + '%';
        }
    };

    canvas.addEventListener('mousemove', preview);
    canvas.addEventListener('click', () => crop_fnc('cap-master'));
    canvas.addEventListener('mousemove', () => crop_fnc('cap-compare'));
}

function color_error() {
    if (this.checked) {
        document.getElementById('sample-width').value = 1;
        document.getElementById('sample-height').value = 1;
    }
    else {
        document.getElementById('sample-width').value = 100;
        document.getElementById('sample-height').value = 100;
    }
}