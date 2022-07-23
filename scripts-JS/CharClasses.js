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
    is_run = false
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
        super(w,h,0, canvas.offsetHeight-Ground-h,ctx, 1, 150);
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
        this.healthBar = new HealthBar(this.color, canvas.offsetWidth * 0.05, canvas.offsetHeight * 0.05,
            this.health, this.MaxHealth)

        this.name = name;
    }

    get_dead(){
        if (this.is_alive) {
            setTimeout(() => {
                GameOver()
            }, 1000)
        }
        this.is_alive = false
    }

    do_attack(enemy){
        if (!this.is_attacking && !this.is_resting) {
            this.attack.current_frame = 0;
            this.is_attacking = true

            if (this.attack.is_collide(enemy)) {
                this.attack.deal_damage(enemy)
            }

            setTimeout(() => {
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
        if (this.isRun){
            Player.x += this.velocity.x;
        }
        this.x = Math.min(Math.max(this.x, 0), canvas.offsetWidth - this.width)

        // Замедление, для избегания рывков
        //this.velocity.x = this.direction * Math.max(0, Math.abs(this.velocity.x) - this.friction)

        // Воздействие гравитации
        if (this.y + this.height < canvas.offsetHeight - Ground) {
            this.velocity.y -= Gravity
        } else {
            this.on_earth = true
        }

        // Перемещение и замедление по y
        this.y = Math.min(this.velocity.y + this.y, canvas.offsetHeight - this.height - Ground)
        // if (Math.abs(this.velocity.y) >= 1) {
        //     this.velocity.y *= 0.95
        // } else {
        //     this.velocity.y = 0
        // }

        // Обновления area Оружия
        if (this.direction === 1) {
            this.attack.x = this.x + this.attackOffset.x + this.weapon.area.offset.x
            if (!Player.is_down) {
                this.attack.y = this.y - this.attackOffset.y + this.weapon.area.offset.y
            }
        } else {
            this.attack.x = this.x - this.attackOffset.mnsx - this.weapon.area.offset.x
            if (!Player.is_down) {
                this.attack.y = this.y - this.attackOffset.y + this.weapon.area.offset.y
            }
        }
        if (this.health <= 0) {
            this.get_dead()
        }

        // Обновление спрайта
        if (Player.is_attacking) {
            if (Player.is_down) {
                if (Player.direction === 1) {
                    Player.imageOffset.y = 640;
                    Player.attack.imageOffset.y = 0;
                } else {
                    Player.imageOffset.y = 720;
                    Player.attack.imageOffset.y = Player.weapon.imageSize.h + 4;
                }
            } else {
                if (Player.direction === 1) {
                    Player.imageOffset.y = 160;
                    Player.attack.imageOffset.y = 0;
                } else {
                    Player.imageOffset.y = 240;
                    Player.attack.imageOffset.y = Player.weapon.imageSize.h + 4;
                }
            }
        }
        else {
            if (Player.is_down) {
                if (Player.direction === 1) {
                    Player.imageOffset.y = 480;
                } else {
                    Player.imageOffset.y = 560;
                }
            } else {
                if (Player.direction === 1) {
                    Player.imageOffset.y = 0;
                } else {
                    Player.imageOffset.y = 80;
                }
            }
            if (!Player.on_earth) {
                if (Player.direction === 1) {
                    Player.imageOffset.y = 320;
                } else {
                    Player.imageOffset.y = 400;
                }
            }
        }

        // Отправка данных о здоровье в HealthBar
        this.healthBar.health = this.health;
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
        h: 18
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
        this.imageOffset.y = Math.round(Math.random()) * (this.imgSize.h + 2) + 2

        this.healthBar = new HealthBar(this.color.color, canvas.offsetWidth * 0.55, canvas.offsetHeight * 0.05,
            this.health, this.MaxHealth, true)
        this.friction = 1;
        this.direction = -1;
    }

    draw() {
        super.draw();
        if (this.is_in_fight) {
            this.healthBar.draw()
        }
    }

    update() {
        if (this.health <= 0){
            this.is_alive = false
        }

        if (this.x + this.width/2 < Player.x+Player.width/2) { this.imageOffset.y = 2; }
        else { this.imageOffset.y = 22; }

        if (!this.is_jumping){
            if (this.x + this.width/2 < Player.x+Player.width/2) {
                this.direction = 1;
            }
            else {
                this.direction = -1;
            }

            this.velocity = {
                x: this.direction*(Math.random() * 5 + 25),
                y: -30
            }
            this.is_jumping = true
            setTimeout(()=>{
                this.is_jumping = false
            }, 2000)
        }
        else{
            this.x += this.velocity.x;
            if (this.x <= 0 || this.x + this.width >= canvas.offsetWidth){
                this.direction *= -1;
            }
            this.velocity.x = this.direction * Math.max(Math.abs(this.velocity.x) - this.friction, 0);
        }
        if (this.y + this.height <= canvas.offsetHeight - Ground) {
            this.y = Math.min(this.y + this.velocity.y, canvas.offsetHeight-Ground-this.height)
            this.velocity.y -= 2*Gravity
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
        // Отправка данных о здоровье в HealthBar
        this.healthBar.health = this.health;
    }

    get_dead(){
        Player.killCounter++;
        enemiesOnField--;
        setTimeout( ()=> {
            TravelInit()
        }, 200);
        setTimeout( ()=> {
            Travel()
        },1500)
    }
}