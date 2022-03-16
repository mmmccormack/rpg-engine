class BaseScene extends Phaser.Scene {
    constructor(sceneName) {
        super(sceneName)


    }
    
    preload() {
        this.pickup = false;

    }

    hpPickup() {
        this.pickup = true;
    }

}