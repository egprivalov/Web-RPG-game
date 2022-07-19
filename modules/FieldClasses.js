class FieldCell {
    image = new Image();
    size = CellSize;
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = CellSize * x;
        this.y = CellSize * y;
    }
    draw(){
        this.ctx.drawImage(this.image,
            this.x, this.y,
            this.size, this.size)

    }
}

class Decoration extends FieldCell{
    constructor(ctx, x, y, imgSrc) {
        super(ctx, x, y)
        this.image.src = imgSrc;
    }
}

class Grass extends FieldCell {
    on_grass = null;
    constructor(ctx, x, y) {
        super(ctx, x, y)
        let N = (Math.trunc(Math.random()*4)+1)
        this.image.src = "assets/landscape/green-grass/green-grass-" + N + ".png"
        if (!(x === 3 && y === 3)){
            if (N === 4 && Math.random() < 0.4) {
                this.on_grass = new Decoration(ctx, x, y,
                    "assets/landscape/green-grass/decoration/decoration-" +
                    (Math.trunc(Math.random() * 4) + 1) + ".png")
            } else {
                if (Math.random() < 0.07){
                    this.on_grass = new Slime(CellSize, CellSize, ctx, 400 + Math.ceil(Math.random()*200),
                        40 + Math.ceil(Math.random()*20), `rgba(${Math.ceil(Math.random()*255)}, ${Math.ceil(Math.random()*255)}, ${Math.ceil(Math.random()*255)}, 1)`)
                    this.on_grass.healthbar = null;
                    this.on_grass.x = this.x+OffsetOfTravelSprite;
                    this.on_grass.y = this.y+OffsetOfTravelSprite;
                    this.on_grass.width = CellSize-2*OffsetOfTravelSprite;
                    this.on_grass.height = CellSize-2*OffsetOfTravelSprite;
                }
            }
        }
    }

    draw() {
        super.draw();
        if (this.on_grass !== null && this.on_grass !== Player){
            this.on_grass.draw()
        }
    }

}

class Water extends FieldCell {
    decoration = null;
    constructor(ctx, x, y) {
        super(ctx, x, y);
        this.image.src = "assets/landscape/water/water.png"
        if (Math.random() < 0.25) {
            this.decoration = new Decoration(ctx, x, y,
                "assets/landscape/water/decorations/water-decoration-" + (Math.trunc(Math.random()*4)+1) + ".png");
            this.decoration.y += 7
        }
    }

    draw(){
        super.draw();
        if (this.decoration !== null){
            this.decoration.draw();
        }
    }
}
