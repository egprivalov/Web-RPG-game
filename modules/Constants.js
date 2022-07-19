const canvas = document.getElementById("Surface")
let ctx
if (canvas.getContext) {
    ctx = canvas.getContext("2d")
}

const PlayerSpriteParamsBattle = {w: 70, h: 150}
const EnemySpriteParamsBattle = {w:50, h: 40}
let Field = []
const FieldSize = {
    width: 18,
    height: 10
}
const CellSize = 60;


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
