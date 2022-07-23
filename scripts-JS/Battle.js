let drawingBattle;

const battleBackground = new Image()
battleBackground.src = "assets/background.jpg"


function BattleInit(Enemy){
    Player.image.src = "./assets/Player/Battle/Player.png"
    Player.width = PlayerSpriteParamsBattle.w
    Player.height = PlayerSpriteParamsBattle.h
    Player.x = canvas.offsetWidth * 0.1;
    Player.y = canvas.offsetHeight - Ground - Player.height;
    Player.imageOffset.x = 0;
    Player.imageOffset.y = 0;
    Player.frameMax = 4;
    Player.imgSize = {
        w: 55,
        h: 75
    }
    Player.is_down = false;
    Player.isRun = false;
    Player.direction = 1;

    Enemy.width = EnemySpriteParamsBattle.w
    Enemy.height = EnemySpriteParamsBattle.h
    Enemy.x = canvas.offsetWidth * 0.9;
    Enemy.y = canvas.offsetHeight - Ground - Enemy.height;
}

function startBattle(Enemy) {
    Player.is_in_fight = true;
    Enemy.is_in_fight = true;

    drawingBattle = setInterval(() => {
        if (!Player.is_alive || !Enemy.is_alive){
            setTimeout(()=>{ endBattle() }, 100);
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
                    Player.height = PlayerSpriteParamsBattle.h_down
                    if (!Player.is_down) {
                        Player.y += PlayerSpriteParamsBattle.h - Player.height
                    }
                    Player.is_down = true
                    Player.velocity = {x: 0, y: 0}
                    Player.attack.y = Player.y + Player.weapon.area.offset.y;
                }
                return;
            }

            case Inputs["Right"]: {
                if (!Player.is_down && Player.on_earth) {
                    Player.isRun = true;
                    Player.velocity.x = 10
                }
                Player.direction = 1;
                return
            }

            case Inputs["Left"]: {
                if (!Player.is_down && Player.on_earth) {
                    Player.isRun = true;
                    Player.velocity.x = -10;
                }
                Player.direction = -1;

                return;
            }

            case Inputs["Dash"]: {
                if (Player.has_dash && !Player.is_down) {
                    let distance = Player.direction * 200;
                    let countIntervals = 10;
                    let interval = 10;
                    setTimeout(() => {
                        Player.x += distance/countIntervals;
                        setTimeout(() => {
                            Player.x += distance/countIntervals;
                            setTimeout(() => {
                                Player.x += distance/countIntervals;
                                setTimeout(() => {
                                    Player.x += distance/countIntervals;
                                    setTimeout(() => {
                                        Player.x += distance/countIntervals;
                                        setTimeout(() => {
                                            Player.x += distance/countIntervals;
                                            setTimeout(() => {
                                                Player.x += distance/countIntervals;
                                                setTimeout(() => {
                                                    Player.x += distance/countIntervals;
                                                    setTimeout(() => {
                                                        Player.x += distance/countIntervals;
                                                        setTimeout(() => {
                                                            Player.x += distance/countIntervals;
                                                        }, interval)
                                                    }, interval)
                                                }, interval)
                                            }, interval)
                                        }, interval)
                                    }, interval)
                                }, interval)
                            }, interval)
                        }, interval)
                    }, interval)
                    Player.x += Player.direction * 35
                    Player.has_dash = false
                    setTimeout(() => {
                        Player.has_dash = true
                    }, 800)
                }
                return;
            }

            case Inputs["Attack"]: {
                if (!this.is_attacking && !this.is_resting) {
                    Player.do_attack(Enemy);
                }
                return;
            }
            default: break;
        }
    }

    function keyupHandler(event) {
        switch (event.code) {
            case Inputs["Down"]: {
                if (Player.on_earth) {
                    Player.attack.y = Player.y + Player.attackOffset.y + Player.weapon.area.offset.y
                    Player.height = PlayerSpriteParamsBattle.h
                    Player.is_down = false
                }
                return
            }
            case Inputs["Left"]: {
                Player.isRun = false;
                return;
            }
            case Inputs["Right"]: {
                Player.isRun = false;
                break;
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
