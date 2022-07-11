setInterval(()=>{
    // Отрисовка заднего фона с перекрытием прошлых кадров (Для решения проблемы наслоения)
    ctx.drawImage(background, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight - Ground)

    // Обновление спрайтов
    Player.update()

    // Отрисовка объектов
    Stand.draw()
    Player.draw()
},16)

const Inputs = {
    "Up": "KeyW",
    "Left": "KeyA",
    "Down": "KeyS",
    "Right": "KeyD",
    "Attack": "KeyK",
    "Dash": "ShiftLeft"
}

document.addEventListener('keydown', (event) =>{
    switch (event.code){
        case Inputs["Up"]: {
            if (Player.on_earth && !Player.is_down) {
                Player.on_earth = false
                Player.velocity.y = -22
            }
            return;
        }
        case Inputs["Down"]: {
            if (Player.on_earth) {
                Player.height = PlayerSpriteParams.h / 2
                Player.y += Player.height
                Player.is_down = true
                Player.velocity = {x:0, y:0}
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
            },500)
            }
            return;
        }
        default:
            break;
    }

    if (event.code === Inputs["Attack"]) {
        Player.do_attack(Stand)
    }
})

document.addEventListener('keyup', (event) =>{
    if (event.code === Inputs["Down"]) {
        if (Player.on_earth) {
            Player.height = PlayerSpriteParams.h
            Player.is_down = false
            Player.attackOffset.y = -Player.height / 4
        }
    }
}
)
