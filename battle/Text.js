class Text extends Phaser.GameObjects.BitmapText {
    constructor(scene, x, y, font, text) {
        super(scene, x, y, font, text);

        this.setOrigin(0, 0);
        scene.add.existing(this);
      }
    }