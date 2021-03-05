class Timer {
    constructor(startingTime) {
        this.time = startingTime;
        var self = this;
        this.clock = setInterval(function () {
            self.time -= .1;
            if (self.time < 0.1) {
                self.freeze(-1);
            }
        }, 100);
        this.horizShift = 0;
        this.shaking = false;
        this.frozen = false;
        this.inputFrozen = false;
        this.floating = false;
        this.cementfloaters = false;
        this.sharedLetters = [];
        this.lost = false;
        this.points = 0;
        this.coins = 0;
        this.secondaryAlpha = 0;
        this.recentTouch = false;
    }

    freeze(timeout) {
        this.frozen = true;
        this.inputFrozen = true;
        var self = this;
        if (timeout != -1) {
            setTimeout(function() {
                self.frozen = false;
                self.floating = true;
                setTimeout(function() {
                    self.floating = false;
                    self.cementfloaters = true;
                    self.inputFrozen = false;
                }, 240);
            }, timeout);
        } else {
            this.lost = true;
        }
    }

    shake(strength) {
        if (!this.shaking) {
            this.state = 0;
            this.strength = strength;
            this.shaking = true;
            var self = this;
            this.shakeClock = setInterval(function () {
                // debugger
                switch (self.state) {
                    case 0:
                        self.horizShift += 5;
                        if (self.horizShift >= self.strength) {
                            self.state = 1;
                            self.strength = Math.floor(self.strength * 0.8);
                        }
                        break;
                    case 1:
                        self.horizShift -= 5;
                        if (self.horizShift <= 0 - self.strength) {
                            self.state = 0;
                            self.strength = Math.floor(self.strength * 0.8);
                        }
                        break;
                }
                if (self.strength === 0) {
                    self.shaking = false;
                    clearInterval(self.shakeClock);
                }

            }, 25);
        }
    }
}