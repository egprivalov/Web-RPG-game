function MemoryInit(){
    for (let key_value of memoryBasic){
        if (memory.getItem(key_value[0]) !== key_value[1]){
            memory.setItem(key_value[0], key_value[1]);
        }
    }
}

function setInMemory(key, value) {
    memory.setItem(key, value)
    memory.setItem("needChange", "true")
}

let memoryUpdate = setInterval(()=>{
    if (memory.getItem("needChange") === "true"){
        switch (memory.getItem("currentWeapon")){
            case "Sword":{
                Player.weapon = Sword;
                Player.attack = new Attack(Player.weapon.area.width, Player.weapon.area.height, Player.x + Player.attackOffset.x +
                    Player.weapon.area.offset.x,Player.y - Player.attackOffset.y + Player.weapon.area.offset.y, Player.context,
                    Player.weapon.duration, Player.weapon.damage, Math.ceil(Player.weapon.duration / Player.weapon.frames), Player.weapon.frames,
                    Player.weapon.imageSize);
                Player.attackOffset.mnsx = Player.weapon.area.width;
                Player.attack.image = Player.weapon.image;
                break;
            }
            case "Spear": {
                Player.weapon = Spear;
                Player.attack = new Attack(Player.weapon.area.width, Player.weapon.area.height, Player.x + Player.attackOffset.x +
                    Player.weapon.area.offset.x,Player.y - Player.attackOffset.y + Player.weapon.area.offset.y, Player.context,
                    Player.weapon.duration, Player.weapon.damage, Math.ceil(Player.weapon.duration / Player.weapon.frames), Player.weapon.frames,
                    Player.weapon.imageSize);
                Player.attackOffset.mnsx = Player.weapon.area.width;
                Player.attack.image = Player.weapon.image;
                break;
            }
        }
        Player.name = memory.getItem("name");
        memory.setItem("needChange", "false")
        validate.hidden = false;
        setTimeout(()=>{ validate.hidden = true }, 300);
    }
},300)

