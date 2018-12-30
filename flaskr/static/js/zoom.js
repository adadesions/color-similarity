var img = new Image();
img.src = '../data/train_1_resize.jpg';
img.onload = function() {
    draw(this);
};

function draw(img) {
    var canvas = document.getElementById('source');
    var ctx = canvas.getContext('2d');

    var imWidth = img.width;
    var imHeight = img.height;
    var imSize = document.getElementById('image-size');
    imSize.innerHTML = '('+imWidth+', '+imHeight+')';

    ctx.canvas.width = imWidth;
    ctx.canvas.height = imHeight;
    ctx.drawImage(img, 0, 0, imWidth, imHeight);
    img.style.display = 'none';

    var cw = 210;
    var ch = 210;
    var crop_img = ctx.createImageData(cw, ch);

    var preview = function(event) {
        var x = event.layerX;
        var y = event.layerY;
        var mouse_position = document.getElementById('mouse-position');

        mouse_position.innerHTML = '('+x+', '+y+')';

        ctx.clearRect(0, 0, imWidth, imHeight);
        ctx.drawImage(img, 0, 0, imWidth, imHeight);

        crop_img = ctx.getImageData(x+5, y+5, cw-10, ch-10);
        
        ctx.beginPath();
        ctx.rect(x, y, cw, ch);
        ctx.strokeStyle = "red";
        ctx.stroke();
    };

    var crop_fnc = function(canvas_id) {
        var cap_master = document.getElementById(canvas_id).getContext('2d');

        cap_master.canvas.width = cw;
        cap_master.canvas.height =ch;
        cap_master.putImageData(crop_img, 0, 0);

        if (canvas_id == 'cap-compare') {
            console.log('Yo!')
        }
    };

    canvas.addEventListener('mousemove', preview);
    canvas.addEventListener('click', () => crop_fnc('cap-master'));
    canvas.addEventListener('mousemove', () => crop_fnc('cap-compare'));
}