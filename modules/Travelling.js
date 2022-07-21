const TravelBackground = new Image()
TravelBackground.src = "assets/overlayTravelBorder.png"
const OffsetOfTravelSprite = 10;
const PlayerSpriteParamsTravel = {w: CellSize-2*OffsetOfTravelSprite, h: CellSize-2*OffsetOfTravelSprite}
let frameDuration = 30;

function Travel(){
    Player.image.src = "./assets/Player/Travelling/Player-right.png"
    Player.width = PlayerSpriteParamsTravel.w;
    Player.height = PlayerSpriteParamsTravel.h;
    Player.x = Player.current_cell.x * CellSize + OffsetOfTravelSprite;
    Player.y = Player.current_cell.y * CellSize + OffsetOfTravelSprite;

    let isMoving = false;

    let travelling = setInterval(()=>{
        Field.forEach(field => field.draw());
        ctx.drawImage(TravelBackground,
            Field[FieldSize.width+1].x, Field[FieldSize.width+1].y,
            CellSize*(FieldSize.width-2), CellSize*(FieldSize.height-2))
        Player.draw();

        if (!enemiesOnField){
            endTravel()
            to_dark();
            setTimeout(() => {
                CreateField();
                Travel()
            }, 1000)
        }
    }, 16)

    document.addEventListener("keydown", keydownHandler)

    function keydownHandler(event) {
        if (!isMoving) {
            frameDuration = 30;
            if (event.shiftKey) {
                frameDuration = 15
            }
            switch (event.code) {
                case Inputs["Up"]: {
                    if (1 < Player.current_cell.y) {
                        let cellNext = Field[(Player.current_cell.y - 1) * FieldSize.width + Player.current_cell.x]
                        if (cellNext.on_grass === null) {
                            isMoving = true
                            MoveVertical(true)
                        }
                        else if (cellNext.on_grass.constructor.name === "Slime"){
                            isMoving = true
                            MoveVertical(true)
                            setTimeout( ()=> {
                                endTravel()
                                setTimeout( ()=> {
                                    setTimeout(()=>{
                                        cellNext.on_grass.is_in_fight = true;
                                        cellNext.on_grass = null;
                                        Player.is_in_fight = true;
                                    }, 400)
                                    startBattle(cellNext.on_grass)
                                }, 1000)
                            }, 300)
                        }
                    }
                    return;
                }
                case Inputs["Left"]: {
                    if (1 < Player.current_cell.x) {
                        let cellNext = Field[(Player.current_cell.y) * FieldSize.width + Player.current_cell.x-1]
                        if (cellNext.on_grass === null) {
                            isMoving = true
                            MoveHorizontal(true);
                        }
                        else if (cellNext.on_grass.constructor.name === "Slime"){
                            isMoving = true
                            MoveHorizontal(true);
                            setTimeout( ()=> {
                                endTravel()
                                setTimeout( ()=> {
                                    Player.is_in_fight = true;
                                    cellNext.on_grass.is_in_fight = true;
                                    setTimeout(()=>{
                                        cellNext.on_grass = null;
                                    }, 1000)
                                    startBattle(cellNext.on_grass)
                                }, 1000)
                            }, 300)
                        }
                    }
                    return;
                }
                case Inputs["Down"]: {
                    if (Player.current_cell.y < FieldSize.height - 2) {
                        let cellNext = Field[(Player.current_cell.y+1) * FieldSize.width + Player.current_cell.x]
                        if (cellNext.on_grass === null) {
                            isMoving = true
                            MoveVertical(false)
                        }
                        else if (cellNext.on_grass.constructor.name === "Slime"){
                            isMoving = true
                            MoveVertical(false)
                            Player.is_in_fight = true;
                            cellNext.on_grass.is_in_fight = true;
                            setTimeout( ()=> {
                                endTravel()
                                setTimeout( ()=> {
                                    setTimeout(() => {
                                        cellNext.on_grass = null;
                                    }, 1000)
                                    startBattle(cellNext.on_grass)
                                }, 1000)
                            }, 300)
                        }
                    }
                    return;
                }
                case Inputs["Right"]: {
                    if (Player.current_cell.x < FieldSize.width - 2) {
                        let cellNext = Field[(Player.current_cell.y) * FieldSize.width + Player.current_cell.x+1]
                        if (cellNext.on_grass === null) {
                            isMoving = true
                            MoveHorizontal(false);
                        }
                        else if (cellNext.on_grass.constructor.name === "Slime"){
                            isMoving = true
                            MoveHorizontal(false);
                            setTimeout( ()=> {
                                endTravel()
                                setTimeout( ()=> {
                                    Player.is_in_fight = true;
                                    cellNext.on_grass.is_in_fight = true;
                                    setTimeout(()=>{
                                        cellNext.on_grass = null;
                                    }, 1000)
                                    startBattle(cellNext.on_grass)
                                }, 1000)
                            }, 300)
                        }
                    }
                    return;
                }
            }
        }
    }

    function endTravel() {
        to_dark()
        clearInterval(travelling);
        document.removeEventListener("keydown", keydownHandler);
    }

    // На вход подается boolean, если
    // true - Идет по направлению, указанному в названии переменной
    // false - Идет в обратном направлении
    function MoveHorizontal(Left) {
        let direction;
        if (Left) {
            direction = -1;
            Player.image.src = "./assets/Player/Travelling/Player-left.png"
        }
        else {
            direction = 1;
            Player.image.src = "./assets/Player/Travelling/Player-right.png"
        }
        setTimeout(() => {
            Player.x += CellSize / 6 * direction;
            Player.y -= CellSize / 20;
        }, frameDuration);
        setTimeout(() => {
            Player.x += CellSize / 6 * direction;
            Player.y -= CellSize / 20;
        }, frameDuration*2)
        setTimeout(() => {
            Player.x += CellSize / 6 * direction;
            Player.y -= CellSize / 20;
        }, frameDuration*3)
        setTimeout(() => {
            Player.x += CellSize / 6 * direction;
            Player.y += CellSize / 20;
        }, frameDuration*4)
        setTimeout(() => {
            Player.x += CellSize / 6 * direction;
            Player.y += CellSize / 20;
        }, frameDuration*5)
        setTimeout(() => {
            Player.x += CellSize / 6 * direction;
            Player.y += CellSize / 20;
            Player.current_cell.x += direction
            isMoving = false;
        }, frameDuration*6)
    }

    function MoveVertical(Up) {
        let direction;
        if (Up) {
            direction = -1;
            Player.image.src = "./assets/Player/Travelling/Player-up.png"
        }
        else {
            direction = 1;
            Player.image.src = "./assets/Player/Travelling/Player-down.png"
        }

        setTimeout(() => {
            Player.y += CellSize / 6 * direction;
            }, frameDuration);
        setTimeout(() => {
            Player.y += CellSize / 6 * direction;
            }, frameDuration*2)
        setTimeout(() => {
            Player.y += CellSize / 6 * direction;
            }, frameDuration*3)
        setTimeout(() => {
            Player.y += CellSize / 6 * direction;
            }, frameDuration*4)
        setTimeout(() => {
            Player.y += CellSize / 6 * direction;
            }, frameDuration*5)
        setTimeout(() => {
            Player.y += CellSize / 6 * direction;
            Player.current_cell.y += direction;
            isMoving = false;
            }, frameDuration*6)
    }
}