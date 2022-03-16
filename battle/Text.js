class Text extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, color) {
        super(scene, x, y, text, {
          fontSize: '12',
          color: color,
          stroke: '#000',
          strokeThickness: 4,
        });
        this.setOrigin(0, 0);
        scene.add.existing(this);
      }
    }