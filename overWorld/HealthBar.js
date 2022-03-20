class HealthBar extends Phaser.GameObjects.Container {
    constructor(scene, events) {
        super(scene, 200, 200)

        const graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(3, 0xffff00);
        graphics.fillStyle(0x000000, 0.6);
        graphics.strokeRect(-168, -190, 260, 27);
        graphics.fillRect(-168, -190, 260, 27);
        this.healthBar = new Phaser.GameObjects.BitmapText(scene, -95, -180, "defaultFont")
        .setFontSize(8)
        // .setMaxWidth(240);
        this.add(this.healthBar);
        this.healthBar.setOrigin(0.5);
        events.off("HealthBar")
        events.on("HealthBar", this.showHealthBar, this);
        this.visible = false;

    }

    showHealthBar(stats) {
        let firstPlayerStats;
        if (stats === undefined) {
            firstPlayerStats = `
            Warrior HP: 30/30 MP: 2/2
            Mage    HP: 40/40 MP: 2/2`
        } else {
            firstPlayerStats = `
            ${stats[0].type} HP: ${stats[0].hp}/${stats[0].maxHp} MP: ${stats[0].bp}/${stats[0].maxBp}
            ${stats[1].type} HP: ${stats[1].hp}/${stats[1].maxHp} MP: ${stats[1].bp}/${stats[1].maxBp}`
        }
        this.healthBar.setText(firstPlayerStats);
        this.visible = true;
        if(this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({ delay: 1500, callback: this.hideHealthBar, callbackScope: this });
    }
    hideHealthBar() {
        this.hideEvent = null;
        this.visible = false;
    }
}