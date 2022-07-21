class Sprite {
    color;
    image = new Image();
    imageOffset = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }
    imgSize = {
        w: 0,
        h:0
    }

    constructor(w, h, x, y, ctx, frameMax = 1, interv) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.context = ctx;
        this.frameMax = frameMax;
        this.interval = interv;
        this.animation = setInterval(()=>{
            this.imageOffset.x = this.current_frame * (this.imgSize.w + 4)+4;
            if (this.current_frame < this.frameMax-1) {
                this.current_frame++;
            }
            else{
                this.current_frame = 0;
            }
        }, this.interval)
    }
    update() {}

    draw() {
        this.context.drawImage(this.image,
            this.imageOffset.x, this.imageOffset.y,
            this.imageOffset.w, this.imageOffset.h,
            this.x, this.y,
            this.width, this.height)
    }

    is_collide(target) {
        return (this.x + this.width >= target.x &&
            this.x <= target.x + target.width &&
            this.y + this.height > target.y &&
            this.y <= target.y + target.height);
    }
}

class HealthBar {
    backgroundColor = "#777";
    size = {
        width: canvas.offsetWidth * 0.4,
        height: canvas.offsetHeight * 0.07,
    }
    offset = 0

    constructor(color, x, y, char, needOffset = false) {
        this.color = color;
        this.coordinates = {
            x: x,
            y: y
        }
        this.character = char;
        this.needOffset = needOffset
    }

    draw() {
        // Задняя часть полоски здоровья
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.coordinates.x, this.coordinates.y, this.size.width, this.size.height);
        // Основная полоска здоровья
        ctx.fillStyle = this.color;
        if (!this.needOffset) {
            ctx.fillRect(this.coordinates.x, this.coordinates.y,
                Math.max(0, this.size.width * this.character.health / this.character.MaxHealth),
                this.size.height);
        }
        else{
            this.offset = this.size.width - Math.max(0, this.size.width * this.character.health / this.character.MaxHealth)
            ctx.fillRect(this.coordinates.x + this.offset, this.coordinates.y,
                this.size.width - this.offset, this.size.height);
        }
    }
}

class Attack extends Sprite {
    current_frame = 0;

    constructor(w,h,x,y,ctx, dur, dmg, interv, frames, imgSz) {
        super(w,h,x,y,ctx, frames, interv);
        this.duration = dur;
        this.damage = dmg;
        this.imgSize = imgSz;
        this.imageOffset.w = imgSz.w;
        this.imageOffset.h = imgSz.h;
    }

    deal_damage(char){
        char.health -= this.damage
        if (char.health <= 0){
            char.get_dead()
        }
    }
    draw() {
        super.draw();
    }
}

class Weapon {
    area = {
        width: null,
        height: null,
        offset: {
            x: null,
            y: null
        }
    }
    image = new Image()

    constructor(dmg, drt, area, rst, img, frms, imgSZ) {
        this.damage = dmg;
        this.duration = drt;
        this.area = area;
        this.resting_time = rst;
        this.image.src = img;
        this.frames = frms
        this.imageSize = imgSZ;
    }
}
