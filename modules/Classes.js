class Sprite {
    color;
    image;
    constructor(w, h, x, y, ctx, img) {
        this.width = w
        this.height = h
        this.x = x
        this.y = y
        this.context = ctx
        // this.image = new Image()
        // this.image.src = img
    }
    update() {}

    // TODO: Сделать Анимации
    draw() {
        this.context.fillStyle = this.color
        this.context.fillRect(this.x, this.y, this.width, this.height)
        //this.context.drawImage(this.image)
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
    offset = {
        x: 0,
        y: 0
    }

    constructor(color, x, y, char, needOffset = false) {
        this.color = color;

        this.coordinates = {
            x: x,
            y: y
        }
        this.character = char;
    }

    draw() {
        // Задняя часть полоски здоровья
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.coordinates.x, this.coordinates.y, this.size.width, this.size.height);
        // Основная полоска здоровья
        ctx.fillStyle = this.color;
        ctx.fillRect(this.coordinates.x, this.coordinates.y,
            Math.max(0, this.size.width * this.character.health / this.character.MaxHealth),
            this.size.height);
    }
}

class Attack extends Sprite {
    color = 'rgba(255,0,0,0.8)'

    constructor(w,h,x,y,ctx, dur, dmg) {
        super(w,h,x,y,ctx);
        this.duration = dur
        this.damage = dmg
    }

    deal_damage(char){
        char.health -= this.damage
        if (char.health <= 0){
            char.get_dead()
        }
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

    constructor(dmg, drt, area, rst) {
        this.damage = dmg
        this.duration = drt
        this.area = area
        this.resting_time = rst
    }
}
