class Sprite {
    color;
    constructor(w, h, x, y, ctx) {
        this.width = w
        this.height = h
        this.x = x
        this.y = y
        this.context = ctx
    }
    update() {}
    draw() {
        this.context.fillStyle = this.color
        this.context.fillRect(this.x, this.y, this.width, this.height)
    }
    is_collide(target) {
        return (this.x + this.width >= target.x &&
            this.x <= target.x + target.width &&
            this.y + this.height > target.y);
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

class Character extends Sprite{
    color = '#4575b9';
    is_alive = true;
    attackOffset = {
        x: null,
        y: null,
        mnsx: null,
        mnsy: null
    };
    is_attacking = false;
    is_resting = false;
    velocity = {x: 0, y: 0};
    on_earth = false;
    is_down = false;
    has_dash = true;
    attack;

    // Направление взгляда персонажа
    // 1 - Направо
    // 2 - Налево
    direction = 1;

    constructor(w,h, ctx, hlth, wpn) {
        super(w,h,0, canvas.offsetHeight-Ground-h,ctx);
        this.health = hlth
        this.weapon = wpn
        this.attackOffset = {
            x: this.width,
            mnsx: this.weapon.area.width,
            y: -this.height / 4
        }
        this.attack = new Attack(this.weapon.area.width, this.weapon.area.height, this.x + this.attackOffset.x +
            this.weapon.area.offset.x,this.y - this.attackOffset.y + this.weapon.area.offset.y, this.context,
            this.weapon.duration, this.weapon.damage)
    }
    get_dead(){
        this.is_alive = false
        location.reload()
        alert("Вы умерли!!!")

    }
    do_attack(enemy){
        if (!this.is_attacking && !this.is_resting){
            this.is_attacking = true

            if (this.attack.is_collide(enemy)){
                this.attack.deal_damage(enemy)
            }

            setTimeout(()=>{
                this.is_attacking = false
                this.is_resting = true
                setTimeout(() => {
                    this.is_resting = false
                }, this.weapon.resting_time)
            }, this.weapon.duration)

        }
    }
    update() {
        // Движение по x
        this.x = Math.min(Math.max(this.x + this.velocity.x, 0), canvas.offsetWidth - this.width)

        // Замедление, для избегания рывков
        if (Math.abs(this.velocity.x) >= 10) { this.velocity.x *= 0.9 }
        else { this.velocity.x = 0 }

        // Воздействие гравитации
        if (this.y + this.height < canvas.offsetHeight-Ground) { this.velocity.y -= Gravity }
        else { this.on_earth = true }

        // Перемещение и замедление по y
        this.y = Math.min(this.velocity.y + this.y, canvas.offsetHeight-this.height - Ground)
        if (Math.abs(this.velocity.y) >= 1) { this.velocity.y *= 0.95 }
        else { this.velocity.y = 0 }

        // Обновления area Оружия
        if (this.direction === 1){
            this.attack.x = this.x + this.attackOffset.x + this.weapon.area.offset.x
            this.attack.y = this.y - this.attackOffset.y + this.weapon.area.offset.y
        }
        else {
            this.attack.x = this.x - this.attackOffset.mnsx + this.weapon.area.offset.x
            this.attack.y = this.y - this.attackOffset.y + this.weapon.area.offset.y
        }
        if (this.health <= 0){
            this.get_dead()
        }
    }

    draw() {
        super.draw();
        if (this.is_attacking){
            this.attack.draw()
        }
    }
}

class Slime extends Sprite{
    color = "#00c400";
    velocity = {
        x: null,
        y: null
    }
    is_jumping = false
    can_attack = true
    is_alive = true

    constructor(w,h, ctx, hlth, dmg) {
        super(w, h, canvas.offsetWidth-w, canvas.offsetHeight - Ground - h, ctx);
        this.health = hlth
        this.damage = dmg
    }

    update() {
        if (this.health <= 0){
            this.is_alive = false
            location.reload()
            alert("You killed slime")
        }

        if (!this.is_jumping){
            if (this.x + this.width < Player.x){
                this.velocity = {
                    x: Math.random() * 10 + 20,
                    y: -25
                }
            }
            else{
                this.velocity = {
                    x: -20 - Math.random() * 10,
                    y: -25
                }
            }
            this.is_jumping = true
            setTimeout(()=>{
                this.is_jumping = false
            }, 2000)
        }

        if (Math.abs(this.velocity.x) > 1){
            this.x += this.velocity.x
            this.velocity.x *= 0.95
        }
        else{
            this.velocity.x = 0
        }
        if (this.y + this.height <= canvas.offsetHeight - Ground) {
            this.y = Math.min(this.y + this.velocity.y, canvas.offsetHeight-Ground-this.width)
            this.velocity.y -= Gravity
        }

        if (this.is_collide(Player)){
            if (this.can_attack){
                Player.health -= this.damage
                this.can_attack = false
                setTimeout(() => {
                    this.can_attack = true
                }, 300)
            }
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
