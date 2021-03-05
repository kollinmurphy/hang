class GIF {
    constructor(ctx, image, sprite_width, sprite_height) {
        this.ctx = ctx;
        this.image = image;
        this.sprite_size = [sprite_width, sprite_height];
    }

    draw(frame, x, y, size = 32) {
        this.ctx.drawImage(this.image, this.sprite_size[0] * frame, 0, this.sprite_size[0], this.sprite_size[1], x, y, size, size);
    }
}