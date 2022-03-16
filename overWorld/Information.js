class Information extends Phaser.GameObjects.Container {
    constructor(scene, events) {
        super(scene, 200, 200)

        const graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(3, 0xffff00);
        graphics.fillStyle(0x000000, 0.8); 
          // start x, start y, width, height       
        graphics.strokeRect(-168, -15, 260, 30);
        graphics.fillRect(-168, -15, 260, 30);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: "#ffffff", align: "left", fontSize: 10, wordWrap: { width: 250, useAdvancedWrap: true }});
        this.add(this.text);
        this.text.setOrigin(0.69, 0.5);
        events.off("Information")
        events.on("Information", this.showInformation, this);
        this.visible = false;

    }

    showInformation(textInformation, timeDelay) {
        this.text.setText(textInformation);
        this.visible = true;
        if(this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({ delay: timeDelay, callback: this.hideInformation, callbackScope: this });
    }
    hideInformation() {
        this.hideEvent = null;
        this.visible = false;
    }
    
}