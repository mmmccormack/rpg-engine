class EnemiesMenu extends Menu {
    constructor(x, y, scene){
        super(x, y, scene)

        this.scene.events.off()
    }
    confirm() {      
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
}