class FloatingLetter {
    constructor(letter, initX, targetX) {
        this.letter = letter;
        this.initX = initX;
        this.curX = initX;
        this.targetX = initX; // will be changed by main.js
        this.moving = false;
        this.canmove = false;
        this.coin = (Math.floor(Math.random() * 15) === 0);
    }

    setTarget(target) {
        this.canmove = true;
        this.targetX = target;
    }

    start() {
        this.moving = true;
        if (this.canmove) {
            this.speed = (this.targetX - this.initX) / 16;
            var self = this;
            this.clock = setInterval(function() {
                // debugger
                self.curX += self.speed;
                if (self.speed > 0 && self.curX >= self.targetX) {
                    self.curX = self.targetX;
                    clearInterval(self.clock);
                } else if (self.speed < 0 && self.curX <= self.targetX) {
                    self.curX = self.targetX;
                    clearInterval(self.clock);
                }
                // console.log(self.letter,self.initX,self.curX,self.targetX);
            }, 15);
        }
    }
}