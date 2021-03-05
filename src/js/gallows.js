class Gallows {
    constructor(ctx, x, y, width, height, initTime, theme) {
        this.initTime = initTime;
        this.timePerSegment = initTime / 6;
        this.ctx = ctx;
        this.origX = x;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = this.height / 16;
        this.theme = theme;
    }

    drawHandler(time, offset) {
        if (this.theme === 0) {
            this.draw(time, offset);
        } else if (this.theme === 1) {
            this.cool_draw(time, offset);
        }
    }

    draw(time, offset) {
        this.x = this.origX + offset;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "black";
        let percentage = 1 - (time % this.timePerSegment) / this.timePerSegment;
        if (time % this.timePerSegment === 0)
            percentage = 0;
        let segment = Math.ceil(time / this.timePerSegment);
        switch (segment) {
            case 11:
            case 10:
            case 9:
            case 8:
            case 7:
                this.drawGallows(segment, percentage);
                break;
            case 6: 
                this.drawGallows(segment, 1);
                this.drawHead(percentage); 
                break;
            case 5:
                this.drawGallows(segment, 1);
                this.drawHead(1);
                this.drawBody(percentage); 
                break;
            case 4:
                this.drawGallows(segment, 1);
                this.drawHead(1);
                this.drawBody(1);
                this.drawLArm(percentage);
                break;
            case 3:
                this.drawGallows(segment, 1);
                this.drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(percentage);
                break;
            case 2:
                this.drawGallows(segment, 1);
                this.drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(1);
                this.drawLLeg(percentage);
                break;
            case 1:
                this.drawGallows(segment, 1);
                this.drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(1);
                this.drawLLeg(1);
                this.drawRLeg(percentage);
                break;
            case 0:
                this.drawGallows(segment, 1);
                this.drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(1);
                this.drawLLeg(1);
                this.drawRLeg(1);
        }
    }

    drawGallows(segment, percentage) {
        let sizes = [];
        let lineWidth = 1;
        switch (segment) {
            case 11:
                sizes = [this.width / 2 * percentage, 0, 0, 0, 0, 0];
                break;
            case 10:
                sizes = [this.width / 2, (this.height * 7 / 8 + lineWidth) * percentage, 0, 0, 0, 0];
                break;
            case 9:
                sizes = [this.width / 2, this.height * 7 / 8 + lineWidth, (this.width / 2 + lineWidth) * percentage, 0, 0, 0];
                break;
            case 8:
                sizes = [this.width / 2, this.height * 7 / 8 + lineWidth, this.width / 2 + lineWidth, this.width / 8 * percentage, this.height / 8 * percentage, 0];
                break;
            case 7:
                sizes = [this.width / 2, this.height * 7 / 8 + lineWidth, this.width / 2 + lineWidth, this.width / 8, this.height / 8, this.height / 8 * percentage];
                break;
            default:
                sizes = [this.width / 2, this.height * 7 / 8 + lineWidth, this.width / 2 + lineWidth, this.width / 8, this.height / 8, this.height / 8];
        }

        this.ctx.beginPath(); // base
        this.ctx.moveTo(this.x, this.y + this.height * 7 / 8);
        this.ctx.lineTo(this.x + sizes[0], this.y + this.height * 7 / 8);
        this.ctx.stroke();

        this.ctx.beginPath(); // main post
        this.ctx.moveTo(this.x + this.width / 4, this.y + this.height * 7 / 8);
        this.ctx.lineTo(this.x + this.width / 4, this.y + this.height * 7 / 8 - sizes[1]);
        this.ctx.stroke();

        this.ctx.beginPath(); // horizontal post
        this.ctx.moveTo(this.x + this.width / 4, this.y);
        this.ctx.lineTo(this.x + this.width / 4 + sizes[2], this.y);
        this.ctx.stroke();

        this.ctx.beginPath(); // triangle brace
        this.ctx.moveTo(this.x + this.width / 4, this.y + this.height / 8);
        this.ctx.lineTo(this.x + this.width / 4 + sizes[3], this.y + this.height / 8 - sizes[4]);
        this.ctx.stroke();

        this.ctx.beginPath(); // small post
        this.ctx.moveTo(this.x + this.width * 3 / 4, this.y);
        this.ctx.lineTo(this.x + this.width * 3 / 4, this.y + sizes[5]);
        this.ctx.stroke();
    }

    drawHead(percentage) {
        let p = 0;
        let s = Math.PI * 3 / 2;
        if (percentage > 0.989) {
            p = Math.PI * 2;
            s = 0;
        } else if (percentage < .25) {
            p = Math.PI * 2 * percentage + Math.PI * 3 / 2;
        } else {
            p = Math.PI * 2 * percentage - Math.PI / 2;
        }
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width * 3 / 4, this.y + this.height / 8 + this.radius, this.radius, s, p);
        this.ctx.stroke();
    }

    drawBody(percentage) {
        let height = this.height / 4 * percentage;
        this.ctx.beginPath(); // small post
        this.ctx.moveTo(this.x + this.width * 3 / 4, this.y + this.height / 8 + this.radius * 2);
        this.ctx.lineTo(this.x + this.width * 3 / 4, this.y + this.height / 8 + this.radius * 2 + height);
        this.ctx.stroke();
    }

    drawLArm(percentage) {
        let size = this.width / 12 * percentage;
        this.ctx.beginPath(); // small post
        this.ctx.moveTo(this.x + this.width * 3 / 4, this.y + this.height * 3 / 16 + this.radius * 2);
        this.ctx.lineTo(this.x + this.width * 3 / 4 - size, this.y + this.height  * 3 / 16 + this.radius * 2 + size);
        this.ctx.stroke();
    }

    drawRArm(percentage) {
        let size = this.width / 12 * percentage;
        this.ctx.beginPath(); // small post
        this.ctx.moveTo(this.x + this.width * 3 / 4, this.y + this.height * 3 / 16 + this.radius * 2);
        this.ctx.lineTo(this.x + this.width * 3 / 4 + size, this.y + this.height  * 3 / 16 + this.radius * 2 + size);
        this.ctx.stroke();
    }

    drawLLeg(percentage) {
        let size = this.width / 8 * percentage;
        this.ctx.beginPath(); // small post
        this.ctx.moveTo(this.x + this.width * 3 / 4, this.y + this.height * 3 / 8 + this.radius * 2);
        this.ctx.lineTo(this.x + this.width * 3 / 4 - size / 2,  this.y + this.height * 3 / 8 + this.radius * 2 + size);
        this.ctx.stroke();
    }

    drawRLeg(percentage) {
        let size = this.width / 8 * percentage;
        this.ctx.beginPath(); // small post
        this.ctx.moveTo(this.x + this.width * 3 / 4, this.y + this.height * 3 / 8 + this.radius * 2);
        this.ctx.lineTo(this.x + this.width * 3 / 4 + size / 2,  this.y + this.height * 3 / 8 + this.radius * 2 + size);
        this.ctx.stroke();
    }

    cool_draw(time, offset) {
        this.x = this.origX + offset;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "black";
        let percentage = 1 - (time % this.timePerSegment) / this.timePerSegment;
        if (time % this.timePerSegment === 0)
            percentage = 0;
        let segment = Math.ceil(time / this.timePerSegment);
        switch (segment) {
            case 11:
            case 10:
            case 9:
            case 8:
            case 7:
                this.drawGallows(segment, percentage);
                break;
            case 6: 
                this.drawGallows(segment, 1);
                this.cool_drawHead(percentage); 
                break;
            case 5:
                this.drawGallows(segment, 1);
                this.cool_drawHead(1);
                this.drawBody(percentage); 
                break;
            case 4:
                this.drawGallows(segment, 1);
                this.cool_drawHead(1);
                this.drawBody(1);
                this.drawLArm(percentage);
                break;
            case 3:
                this.drawGallows(segment, 1);
                this.cool_drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(percentage);
                break;
            case 2:
                this.drawGallows(segment, 1);
                this.cool_drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(1);
                this.drawLLeg(percentage);
                break;
            case 1:
                this.drawGallows(segment, 1);
                this.cool_drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(1);
                this.drawLLeg(1);
                this.drawRLeg(percentage);
                break;
            case 0:
                this.drawGallows(segment, 1);
                this.cool_drawHead(1);
                this.drawBody(1);
                this.drawLArm(1);
                this.drawRArm(1);
                this.drawLLeg(1);
                this.drawRLeg(1);
        }
    }

    cool_drawHead(percentage) {
         // sunglasses

        let p = 0;
        let s = Math.PI * 3 / 2;
        if (percentage > 0.989) {
            p = Math.PI * 2;
            s = 0;
        } else if (percentage < .25) {
            p = Math.PI * 2 * percentage + Math.PI * 3 / 2;
        } else {
            p = Math.PI * 2 * percentage - Math.PI / 2;
        }
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width * 3 / 4, this.y + this.height / 8 + this.radius, this.radius, s, p);
        this.ctx.stroke();
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width * 3 / 4 - this.radius / 3, this.y + this.height / 8 + this.radius * 0.8, this.radius / 4, s, p);
        this.ctx.arc(this.x + this.width * 3 / 4 + this.radius / 3, this.y + this.height / 8 + this.radius * 0.8, this.radius / 4, s, p);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width * 3 / 4 - this.radius * 5 / 12, this.y + this.height / 8 + this.radius * 0.8);
        this.ctx.lineTo(this.x + this.width * 3 / 4 - this.radius * 5 / 12 - (this.radius * 7 / 12 * percentage), this.y + this.height / 8 + this.radius * 0.8 - (this.radius * 0.2 * percentage));
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width * 3 / 4 + this.radius * 5 / 12, this.y + this.height / 8 + this.radius * 0.8);
        this.ctx.lineTo(this.x + this.width * 3 / 4 + this.radius * 5 / 12 + (this.radius * 7 / 12 * percentage), this.y + this.height / 8 + this.radius * 0.8 - (this.radius * 0.2 * percentage));
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width * 3 / 4 - this.radius * 1 / 12, this.y + this.height / 8 + this.radius * 0.8);
        this.ctx.lineTo(this.x + this.width * 3 / 4 - this.radius * 1 / 12 + (this.radius * 2 / 12 * percentage), this.y + this.height / 8 + this.radius * 0.8);
        this.ctx.stroke();

        this.ctx.lineWidth = 3;
    }
}