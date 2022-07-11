const canvas = document.getElementById("Surface")
let ctx
if (canvas.getContext) {
    ctx = canvas.getContext("2d")
}
const background = new Image()
background.src = "Assets/background.jpg"

const canvasArea = {
    width: Math.round(0.7096 * window.innerWidth),
    height: Math.round(0.831 * window.innerHeight)
}

const Gravity = -1
const Ground = 0.12 * canvas.offsetHeight

const Sword = new Weapon(100, 500, {width: 100, height: 80, offset: {x:0, y:0}}, 200)

const PlayerSpriteParams = {w: 70, h: 150}
const Player = new Character(PlayerSpriteParams.w, PlayerSpriteParams.h, ctx, 1000, Sword)


