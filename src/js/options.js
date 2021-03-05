window.onload = function() {
    document.querySelector("#fontLoader").style.display = "none";

    // var highscore = 0;
    var highscore = Android.getHighScore();
    // var nexttheme = 100;

    var cvs = document.querySelector("#myCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');

    var gallows = new Gallows(ctx, window.innerWidth * 0.375, window.innerHeight * 0.37, window.innerWidth / 4, window.innerHeight / 2 * 0.35, 10, 0);
    var themes = new Themes(gallows,theme_index, themes_available);

    draw();

    function draw() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        ctx.rect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "rgb(220,220,220)";
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(0,window.innerHeight * 0.08);
        ctx.lineTo(window.innerWidth, window.innerHeight * 0.08);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,window.innerHeight * 0.28);
        ctx.lineTo(window.innerWidth, window.innerHeight * 0.28);
        ctx.stroke();

        ctx.beginPath();
        ctx.font = "32px opensaucesans";
        ctx.textAlign = "left";
        ctx.fillStyle = "black";
        ctx.textBaseline = 'top';
        ctx.fillText("High score", 25, window.innerHeight * 0.1);
        ctx.fillText("Themes", 25, window.innerHeight * 0.3);
        ctx.font = "28px opensaucesans";
        ctx.textAlign = "center";
        ctx.fillText(highscore + " points", window.innerWidth / 2, window.innerHeight * 0.185);
        ctx.textAlign = "left";

        // if (theme_index === themes_available.length - 1) {
            ctx.font = "24px opensaucesans";
            ctx.textBaseline = 'alphabetic';
            ctx.fillText("Unlock a new theme when you", 25, window.innerHeight * 0.6);
            ctx.textBaseline = 'top';
            ctx.fillText("reach a high score of " + nexttheme + ".", 25, window.innerHeight * 0.62)
        // }

        themes.draw();

        ctx.font = "148px opensaucesans"; // back button
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(window.innerWidth / 2, window.innerHeight * 0.8);
        ctx.rotate(Math.PI * 3 / 2);
        ctx.scale(1,-1);
        ctx.fillText("∇",0,10);
        ctx.restore();

        if (themes_available.length > 1) {
            ctx.font = "72px opensaucesans"; // left & right theme nav buttons
            ctx.save();
            ctx.translate(window.innerWidth * 3 / 16, window.innerHeight * 0.45);
            ctx.rotate(Math.PI * 3 / 2);
            ctx.scale(1,-1);
            ctx.fillText("∇",0,10);
            ctx.restore();
            ctx.save();
            ctx.translate(window.innerWidth * 13 / 16, window.innerHeight * 0.45);
            ctx.rotate(Math.PI * 3 / 2);
            ctx.fillText("∇",0,10);
            ctx.restore();
        }
    }

    
    document.addEventListener("touchstart", function (e) {
        let touchX = e.touches[0].clientX;
        let touchY = e.touches[0].clientY;
        if (touchX > window.innerWidth / 3 && touchX < window.innerWidth * 2 / 3 && touchY > window.innerHeight * 0.73 && touchY < window.innerHeight * 0.88) {
            // back button
            Andriod.saveTheme(themes.theme);
            document.location = "home.html";
        }

        if (touchY > window.innerHeight * 0.4 && touchY < window.innerHeight * 0.5) {
            if (touchX > window.innerWidth / 16 && touchX < window.innerWidth * 5 / 16) {
                themes.scroll(false);
                draw();
            } else if (touchX > window.innerWidth * 11 / 16 && touchX < window.innerWidth * 15 / 16) {
                themes.scroll(true);
                draw();
            }
        }
    });
};