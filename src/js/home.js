window.onload = function() {
    document.querySelector("#fontLoader").style.display = "none";

    var cvs = document.querySelector("#myCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');


    draw();

    function draw() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        ctx.rect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "rgb(220,220,220)";
        ctx.fill();

        ctx.beginPath();
        ctx.font = "196px FatCow";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.textBaseline = 'middle';
        ctx.fillText("HANG", window.innerWidth / 2, window.innerHeight * 0.3);

        ctx.save();
        ctx.translate(window.innerWidth / 2, window.innerHeight * 0.55);
        ctx.rotate(Math.PI * 3 / 2);
        ctx.fillText("∇",0,10);
        ctx.restore();
        ctx.fillText("፧",window.innerWidth / 2,window.innerHeight * 0.80);
    }

    document.addEventListener("touchstart", function (e) {
        let touchX = e.touches[0].clientX;
        let touchY = e.touches[0].clientY;
        if (touchX > window.innerWidth / 3 && touchX < window.innerWidth * 2 / 3) {
            if (touchY > window.innerHeight * 0.45 && touchY < window.innerHeight * 0.65) {
                // play button
                document.location = "index.html";
            } else if (touchY > window.innerHeight * 0.7 && touchY < window.innerHeight * 0.9) {
                // options button
                document.location = "options.html";
            }
        }
    });
};