class Keyboard {
    constructor(ctx, guesser, keyboard_position, key_size, keysPerRow, clock, coin, keyboard_layout) {
        this.guess = guesser;
        this.ctx = ctx;
        this.keyboard_position = keyboard_position;
        this.key_size = key_size;
        this.keysPerRow = keysPerRow;
        this.clock = clock;
        this.imgTime = document.querySelector("#imgTime");
        this.coin = coin;
        this.keyboard_layout = keyboard_layout;
    }

    draw(pressed_key) {
        this.ctx.textAlign = "center";
        let offset = 3;
        for (let row = 0; row < this.keyboard_layout.length; row++) {
            for (let col = 0; col < this.keyboard_layout[row].length; col++) { // draw keyboard
                if (this.keyboard_layout[row][col] != "") {
                    let guessed = this.guess.isGuessed(this.keyboard_layout[row][col]);
                    let fillStyle = "rgb(220,220,220)";
                    if (guessed === 1)
                        fillStyle = "rgb(70,20,20)";
                    else if (guessed === 2)
                        fillStyle = "rgb(20,70,20)";
        
                    this.roundRect(this.ctx, this.key_size * col + offset + this.keyboard_position[0], this.key_size * row + offset + this.keyboard_position[1], this.key_size - offset * 2, this.key_size - offset * 2, this.key_size * 2 / 8, fillStyle);
                    this.ctx.strokeStyle = "black";
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
        
                    this.ctx.beginPath();
                    this.ctx.font = "24px opensaucesans";
                    this.ctx.fillStyle = "black";
                    this.ctx.fillText(this.keyboard_layout[row][col], this.key_size * (col + 0.5) + this.keyboard_position[0], this.key_size * (row + 0.5) + this.keyboard_position[1] + 2);
                }
                
            }
        }
        

        this.drawHint(pressed_key);
        this.drawTime(pressed_key);
    }

    drawHint(pressed_key) {
        let offset = 3;
        let x = this.key_size * 5 + offset + this.keyboard_position[0];
        let y = this.key_size * 3.25 + offset + this.keyboard_position[1];
        let fillStyle = pressed_key === "hint" ? "rgb(120,120,120)" : "rgb(220,220,220)";
        if (this.clock.coins < 2) {
            fillStyle = "rgb(120,120,120)";
        }
        this.roundRect(this.ctx, x, y, this.key_size * 2 - offset * 2, this.key_size - offset * 2, this.key_size * 2 / 8, fillStyle);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.font = "24px opensaucesans";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("h_nt", x + this.key_size - 2, y + this.key_size / 2 - 2);

        this.ctx.beginPath();
        this.ctx.font = "24px opensaucesans";
        this.ctx.fillStyle = "black";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("2 ", x + this.key_size - 12, y + this.key_size + 4);
        this.coin.draw(0, x + this.key_size - 4, y + this.key_size + 2, 22);
    }

    drawTime(pressed_key) {
        let offset = 3;
        let x = this.key_size * 2 + offset + this.keyboard_position[0];
        let y = this.key_size * 3.25 + offset + this.keyboard_position[1];
        let fillStyle = pressed_key === "time" ? "rgb(120,120,120)" : "rgb(220,220,220)";
        if (this.clock.coins < 1) {
            fillStyle = "rgb(120,120,120)";
        }
        this.roundRect(this.ctx, x, y, this.key_size * 2 - offset * 2, this.key_size - offset * 2, this.key_size * 2 / 8, fillStyle);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        let clock_size = this.key_size - 12;
        this.ctx.drawImage(this.imgTime, x + this.key_size - clock_size / 2 - 3, y + this.key_size / 2 - clock_size / 2 - 3, clock_size, clock_size);

        this.ctx.beginPath();
        this.ctx.font = "24px opensaucesans";
        this.ctx.fillStyle = "black";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("1 ", x + this.key_size - 12, y + this.key_size + 4);
        this.coin.draw(0, x + this.key_size - 4, y + this.key_size + 2, 22);
    }

    roundRect(ctx, x, y, width, height, radius, fillColor, end = 0) {
        if (typeof radius === 'number') {
            if (end != 0) {
                radius = {
                    tl: end === 1 ? 0 : radius,
                    tr: end === 2 ? 0 : radius,
                    br: 0,
                    bl: 0
                };
            } else {
                radius = {
                    tl: radius,
                    tr: radius,
                    br: radius,
                    bl: radius
                };
            }
    
        } else {
            var defaultRadius = {
                tl: 0,
                tr: 0,
                br: 0,
                bl: 0
            };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
}


