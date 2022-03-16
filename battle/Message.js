class Message extends Phaser.GameObjects.Container {
    constructor(scene, events) {
        super(scene, 160, 140)

        const graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(3, 0xffff00);
        graphics.fillStyle(0x000000, 0.4);        
        graphics.strokeRect(-90, -15, 180, 30);
        graphics.fillRect(-90, -15, 180, 30);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: "#ffffff", align: "center", fontSize: 12, wordWrap: { width: 160, useAdvancedWrap: true }});
        this.add(this.text);
        this.text.setOrigin(0.5);        
        events.on("Message", this.showMessage, this);
        this.visible = false;
    }

    showMessage(textMessage) {
        this.text.setText(textMessage);
        this.visible = true;
        if(this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
    }
    hideMessage() {
        this.hideEvent = null;
        this.visible = false;
    }
    
}