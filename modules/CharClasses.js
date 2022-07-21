class Character extends Sprite{
    color = '#88c725';
    is_alive = true;
    attackOffset = {
        x: null,
        y: null,
        mnsx: null,
        mnsy: null
    };
    is_in_fight = false;
    is_attacking = false;
    is_resting = false;
    velocity = {x: 0, y: 0};
    on_earth = false;
    is_down = false;
    has_dash = true;
    attack;
    current_cell = { x:3, y:3 }
    imgSize = {
        w: 20,
        h: 20
    }
    killCounter = 0

    // Направление взгляда персонажа
    // 1 - Направо
    // -1 - Налево
    direction = 1;

    constructor(w,h, ctx, hlth, wpn, name = "Player") {
        super(w,h,0, canvas.offsetHeight-Ground-h,ctx);
        this.health = hlth
        this.MaxHealth = hlth
        this.weapon = wpn
        this.attackOffset = {
            x: this.width,
            mnsx: this.weapon.area.width,
            y: -this.height / 4
        }
        this.attack = new Attack(this.weapon.area.width, this.weapon.area.height, this.x + this.attackOffset.x +
            this.weapon.area.offset.x,this.y - this.attackOffset.y + this.weapon.area.offset.y, this.context,
            this.weapon.duration, this.weapon.damage, Math.ceil(this.weapon.duration / this.weapon.frames), this.weapon.frames,
            this.weapon.imageSize)
        this.attack.image = this.weapon.image;
        this.healthBar = new HealthBar(this.color, canvas.offsetWidth * 0.05, canvas.offsetHeight * 0.05, this)

        this.imageOffset.w = this.imgSize.w;
        this.imageOffset.h = this.imgSize.h;

        this.name = name;
    }
    get_dead(){
        this.is_alive = false
        setTimeout(()=> {
            GameOver()
        },1000)
    }

    do_attack(enemy){
        if (!this.is_attacking && !this.is_resting){
            this.attack.current_frame = 0;
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
            this.attack.x = this.x - this.attackOffset.mnsx - this.weapon.area.offset.x
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
        if (this.is_in_fight) {
            this.healthBar.draw()
        }
    }
}

class Slime extends Sprite{
    velocity = {
        x: null,
        y: null
    }
    is_jumping = false
    can_attack = true
    is_alive = true
    is_in_fight = false;
    imgSize = {
        w: 21,
        h: 20
    }
    current_frame = 0;

    constructor(w,h, ctx, hlth, dmg) {
        super(w, h, canvas.offsetWidth-w, canvas.offsetHeight - Ground - h, ctx, 2, 200);
        this.health = hlth
        this.MaxHealth = hlth
        this.damage = dmg
        let color = SlimeColors[Math.trunc(Math.random()*7)]
        this.color = color
        this.image.src = "./assets/Slime/"+ color.name + ".png"
        this.imageOffset.y = Math.round(Math.random()) * (this.imgSize.h + 1)

        this.healthBar = new HealthBar(this.color.color, canvas.offsetWidth * 0.55, canvas.offsetHeight * 0.05, this, true)
        this.imageOffset.w = this.imgSize.w;
        this.imageOffset.h = this.imgSize.h;

    }

    draw() {
        super.draw();
        if (this.is_in_fight) {
            this.healthBar.draw()
        }
    }

    update() {
        let direction;
        if (this.health <= 0){
            this.is_alive = false
        }
        if (this.x + this.width < Player.x) {
            this.imageOffset.y = 0;
            direction = 1;
        }
        else {
            this.imageOffset.y = this.imgSize.w + 1
            direction = -1;
        }
        if (!this.is_jumping){
            this.velocity = {
                x: direction*(Math.random() * 10 + 20),
                y: -25
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
            this.y = Math.min(this.y + this.velocity.y, canvas.offsetHeight-Ground-this.height)
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

    get_dead(){
        Player.is_in_fight = false;
        Player.killCounter++;
        enemiesOnField--;
        setTimeout( ()=> {
            Travel()
        },1000)
    }
}