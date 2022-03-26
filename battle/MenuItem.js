class MenuItem extends Phaser.GameObjects.BitmapText {
    constructor(scene, x, y, font, text) {
        super(scene, x, y, font, text)

        // this.text = text;
    }

    select() {
        // this.setColor("#ff0000");
    }
    
    deselect() {
        // this.setColor("#ffffff");
    }
    unitKilled() {
        this.active = false;
        this.visible = false;
    }
}