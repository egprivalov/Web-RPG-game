const canvas = document.getElementById("Surface")
let ctx
if (canvas.getContext) {
    ctx = canvas.getContext("2d")
}
const border = new Image();
border.src = "assets/game-over-border.png";

const hexNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']

const PlayerSpriteParamsBattle = {w: 100, h: 150,
                                  h_down: 80}
const EnemySpriteParamsBattle = {w:60, h: 60}
let Field = []
const FieldSize = {
    width: 18,
    height: 10
}
const CellSize = 60;

let enemiesOnField = 0;
let World_counter = 0;

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
    World_counter++;
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
    setInterval(()=> {
        ctx.fillStyle = "#333"
        ctx.fillRect(0,0, canvas.offsetWidth, canvas.offsetHeight);
        ctx.drawImage(border, canvas.offsetWidth / 5, canvas.offsetHeight / 5,
            canvas.offsetWidth*3/5,canvas.offsetHeight*3/5);
        ctx.fillStyle = "#e3d6c8"

        ctx.font = "64px BIT"
        let offset = ctx.measureText(`???????? ????????????????!`).width
        let x = canvas.offsetWidth/2 - offset/2;
        let y = canvas.offsetHeight/3 + 100;
        ctx.fillText(`???????? ????????????????!`, x, y)

        ctx.font = "30px BIT"
        offset = ctx.measureText(`?????????? ${Player.name} ???????? ${Player.killCounter} ??????????????????????!`).width
        x = canvas.offsetWidth/2 - offset/2;
        y = canvas.offsetHeight/3 + 150;

        ctx.fillText(`?????????? ${Player.name} ???????? ${Player.killCounter} ??????????????????????!`, x, y)
    }, 100)
}

const StartMenu = () => {
    document.addEventListener("keydown", keydownHandler)

    let iter = 15;
    let step = 1;
    let drawing = setInterval(()=>{
        ctx.fillStyle = "#333";
        ctx.fillRect(0,0,canvas.offsetWidth, canvas.offsetHeight);
        ctx.drawImage(border, 0, 0,
            canvas.offsetWidth,canvas.offsetHeight);
        ctx.fillStyle = "#ccc";
        ctx.font = "70px Dungeon"
        let x = canvas.offsetWidth/2 - ctx.measureText("There's Some Name").width/2;
        let y = canvas.offsetHeight/2;
        ctx.fillText("There's Some Name", x, y)

        ctx.font = "15px BIT"
        x = canvas.offsetWidth/2 - ctx.measureText("developed by @egodka").width/2;
        y = canvas.offsetHeight - 30;
        ctx.fillText("developed by @egodka", x, y)

        x = 425;
        y = 425;
        ctx.font = "25px BIT"
        ctx.fillStyle = `#${hexNums[iter]}${hexNums[iter]}${hexNums[iter]}`
        ctx.fillText("?????????????? Enter,?????????? ????????????", x, y)


        if (iter + step < 16 && iter + step >= 3){
            iter += step;
        }
        else{
            step *= -1;
        }
    },100)

    function keydownHandler(event){
        if (event.code === "Enter"){
            endStartMenu()
        }
    }

    function endStartMenu() {
        clearInterval(drawing)
        document.removeEventListener("keydown", keydownHandler)
        to_dark()
        setTimeout(()=> {
            Travel()
        },1200)
    }
}
