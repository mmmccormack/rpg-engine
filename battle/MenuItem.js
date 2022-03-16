class MenuItem extends Phaser.GameObjects.Text {
    constructor(x, y, text, scene) {
        super(scene, x, y, text, { color: "#ffffff", align: "center", fontSize: 12})
    }

    select() {
        this.setColor("#ff0000");
    }
    
    deselect() {
        this.setColor("#ffffff");
    }
    unitKilled() {
        this.active = false;
        this.visible = false;
    }
}