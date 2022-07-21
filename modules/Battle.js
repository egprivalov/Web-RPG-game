let drawingBattle;

const battleBackground = new Image()
battleBackground.src = "assets/background.jpg"

const Sword = new Weapon(100, 500, {width: 100, height: 100, offset: {x:10, y:0}}, 200,
    "./assets/Weapons/Sword.png", 9, {w: 25, h:25})
//const Spear = new Weapon(50, 200, {width: 300, height: 30, offset: {x:20, y:0}}, 200)
//const GreatSword = new Weapon(200, 500, {width: 200, height: 150, offset: {x:-40, y: -70}}, 1000)

const Gravity = -1
const Ground = 0.12 * canvas.offsetHeight
const Player = new Character(PlayerSpriteParamsBattle.w, PlayerSpriteParamsBattle.h, ctx, 1000, Sword)

function startBattle(Enemy) {
    Player.width = PlayerSpriteParamsBattle.w
    Player.height = PlayerSpriteParamsBattle.h
    Player.x = canvas.offsetWidth * 0.1;
    Player.y = canvas.offsetHeight - Ground - Player.height;
    Player.is_down = false;

    Enemy.width = EnemySpriteParamsBattle.w
    Enemy.height = EnemySpriteParamsBattle.h
    Enemy.x = canvas.offsetWidth * 0.9;
    Enemy.y = canvas.offsetHeight - Ground - Enemy.height;

    drawingBattle = setInterval(() => {
        if (!Player.is_alive || !Enemy.is_alive){
            endBattle()
        }
        // Отрисовка заднего фона с перекрытием прошлых кадров (Для решения проблемы наслоения)
        ctx.drawImage(battleBackground, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight - Ground)

        // Отрисовка объектов
        Enemy.draw()
        Player.draw()

        // Обновление спрайтов
        Player.update()
        Enemy.update()
    }, 16)

    document.addEventListener('keydown', keydownHandler)

    document.addEventListener('keyup', keyupHandler)

    function keydownHandler(event) {
        switch (event.code) {
            case Inputs["Up"]: {
                if (Player.on_earth && !Player.is_down) {
                    Player.on_earth = false
                    Player.velocity.y = -22
                }
                return;
            }
            case Inputs["Down"]: {
                if (Player.on_earth) {
                    Player.height = PlayerSpriteParamsBattle.h / 2
                    if (!Player.is_down) {
                        Player.y += Player.height
                    }
                    Player.is_down = true
                    Player.velocity = {x: 0, y: 0}
                    Player.attackOffset.y = -Player.height / 8
                }
                return;
            }

            case Inputs["Right"]: {
                if (!Player.is_down && Player.on_earth) {
                    Player.velocity.x = 20
                }
                Player.direction = 1
                return
            }
            case Inputs["Left"]: {
                if (!Player.is_down && Player.on_earth) {
                    Player.velocity.x = -20
                }
                Player.direction = -1
                return;
            }

            case Inputs["Dash"]: {
                if (Player.has_dash) {
                    Player.velocity.x = Player.direction * 35
                    Player.has_dash = false
                    setTimeout(() => {
                        Player.has_dash = true
                    }, 500)
                }
                return;
            }
            case Inputs["Attack"]: {
                Player.do_attack(Enemy);
                return;
            }
            default:
                break;
        }
    }

    function keyupHandler(event) {
        if (event.code === Inputs["Down"]) {
            if (Player.on_earth) {
                Player.attackOffset.y = -1/4 * PlayerSpriteParamsBattle.h
                Player.height = PlayerSpriteParamsBattle.h
                Player.is_down = false
            }
        }
    }

    function endBattle() {
        to_dark()
        clearInterval(drawingBattle);
        document.removeEventListener('keydown', keydownHandler)
        document.removeEventListener('keyup', keyupHandler)
    }
}
