const canvas = document.getElementById("Surface")
let ctx
if (canvas.getContext) {
    ctx = canvas.getContext("2d")
}

const PlayerSpriteParamsBattle = {w: 80, h: 120}
const EnemySpriteParamsBattle = {w:60, h: 60}
let Field = []
const FieldSize = {
    width: 18,
    height: 10
}
const CellSize = 60;

let enemiesOnField = 0;

const SlimeColors = [
    {
        name: "blue",
        color: "#509fb2"
    },
    {
        name: "coffee",
        color: "#D7B594"
    },
    {
        name: "green",
        color: "#A8CA58"
    },
    {
        name: "grey",
        color: "#A8B5B2"
    },
    {
        name: "orange",
        color: "#CF573C"
    },
    {
        name: "pink",
        color: "#C65197"
    },
    {
        name: "yellow",
        color: "#DE9E41"
    }
]

const Inputs = {
    "Up": "KeyW",
    "Left": "KeyA",
    "Down": "KeyS",
    "Right": "KeyD",
    "Attack": "KeyK",
    "Dash": "ShiftLeft"
}

const to_dark = () => {
    let interval = 150;
    let overlay = 1;

    setTimeout(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
        ctx.fillRect(3/4*canvas.offsetWidth, 2/3*canvas.offsetHeight,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
    }, interval);
    setTimeout(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(canvas.offsetWidth/4, 0,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
        ctx.fillRect(2/4*canvas.offsetWidth, 2/3*canvas.offsetHeight,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
    }, 2*interval);
    setTimeout(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(canvas.offsetWidth/2, 0,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
        ctx.fillRect(1/4*canvas.offsetWidth, 2/3*canvas.offsetHeight,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
    }, 3*interval);
    setTimeout(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(canvas.offsetWidth*3/4, 0,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
        ctx.fillRect(0, 2/3*canvas.offsetHeight,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
    }, 4*interval);
    setTimeout(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(3*canvas.offsetWidth/4, canvas.offsetHeight/3,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
        ctx.fillRect(0, canvas.offsetHeight/3,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
    }, 5*interval);
    setTimeout(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(canvas.offsetWidth/2, canvas.offsetHeight/3,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
        ctx.fillRect(1/4*canvas.offsetWidth, canvas.offsetHeight/3,
            canvas.offsetWidth/4 + overlay, canvas.offsetHeight/3 + overlay);
    }, 6*interval)
}

const CreateField = () => {
    Field = []
    for (let y = 0; y < FieldSize.height; y++){
        for (let x = 0; x < FieldSize.width; x++) {
            if ((y === 0 || y === FieldSize.height-1) || (x===0 || x === FieldSize.width-1)){
                Field.push(new Water(ctx, x, y))
            }
            else{
                Field.push(new Grass(ctx, x, y))
            }
        }
    }
}

const GameOver = () => {
    let border = new Image();
    border.src = "assets/game-over-border.png";
    setInterval(()=> {
        ctx.fillStyle = "#333"
        ctx.fillRect(0,0, canvas.offsetWidth, canvas.offsetHeight);
        ctx.drawImage(border, canvas.offsetWidth / 5, canvas.offsetHeight / 5,
            canvas.offsetWidth*3/5,canvas.offsetHeight*3/5);
        ctx.fillStyle = "#e3d6c8"

        let x = canvas.offsetWidth/2 - 160;
        let y = canvas.offsetHeight/3 + 100;
        ctx.font = "50px sans-serif"
        ctx.fillText(`Игра Окончена!`, x, y)

        ctx.font = "30px sans-serif"
        let offset = ctx.measureText(`Игрок ${Player.name} убил ${Player.killCounter} противников!`).width
        x = canvas.offsetWidth/2 - offset/2;
        y = canvas.offsetHeight/3 + 150;

        ctx.fillText(`Игрок ${Player.name} убил ${Player.killCounter} противников!`, x, y)
    }, 100)
}