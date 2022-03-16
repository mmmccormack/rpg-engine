class IntroScene extends Phaser.Scene {
    constructor() {
		super({key: 'IntroScene'});

	}


	preload() {
        this.load.image('title_splash', './assets/characters.png');

        this.load.json('enemies', './battle/jsonData/enemy_encounters.json');
    }

    create() {
        // Add the background image
        this.add.image(160, 200, 'title_splash');

        const {LEFT} = Phaser.Input.Keyboard.KeyCodes
        this.keys = this.input.keyboard.addKeys({
            left: LEFT})
    
    }
    update() {
        const {keys} = this;
        if (keys.left.isDown) {
            this.scene.start('StartScene', {
                previousScene: 'IntroScene',
            currentScene: 'StartScene'});
        }
    }
}