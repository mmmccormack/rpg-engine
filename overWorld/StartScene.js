class StartScene extends GameScene {
    constructor() {
        super('StartScene');
        
    }

    init(data) {
        if (data.previousScene == "LevelOne") {
            this.spawnPointX = 248;
            this.spawnPointY = 70;
        } else {
            this.spawnPointX = 180;
            this.spawnPointY = 220;
        }

    }

    preload() {

        this.cameras.main.setBackgroundColor(0x003300)
        this.load.image('tiles', './assets/Tilemap/purpleTransparent.png')
        this.load.tilemapTiledJSON('map', './overWorld/firstlevel.json')

        super.preload();

    } //end preload

    create(data) {

        super.create({
			tileKey: 'tiles',
			mapKey: 'map',
			tiledKey: 'firstLevel'
		});
        
        // this is for adding something that you can push around the screen
        this.blank = this.physics.add.sprite(56, 46, null);
        this.blank.visible = false;
        this.physics.add.collider(this.blank, this.nonPlayers);
        this.blank.body.setImmovable(true);

        this.nonPlayers.getChildren().forEach(child => {
            this.physics.add.collider(this.player, child, this.handleDialog, null, this)
        })

        if (this.dialog.StartScene.stander.second) {
            this.stander.destroy();
            this.blank.destroy();
        }

        this.pills.getChildren().forEach(child => {
            const pill = child.pickupNum;
            if(this.flags.StartScene[pill].collected) {
                child.body.destroy();
                child.visible = false;
            }
        });

        this.healthPacks.getChildren().forEach(child => {
            const healthPack = child.pickupNum;
            if(this.flags.StartScene[healthPack].collected) {
                child.body.destroy();
                child.visible = false;
            }
        });

        // list of possible player collisions below:
        this.endGame = this.physics.add.sprite(56, 26);
        this.endGame.displayWidth = 16;
        this.endGame.displayHeight = 16;
        this.endGame.goToScene = 'LevelOne';
        this.physics.add.overlap(this.beachBall, this.endGame, this.endGameMsg, null, this);

        this.doorToHouse = this.physics.add.sprite(248, 44);
        this.doorToHouse.displayWidth = 16;
        this.doorToHouse.displayHeight = 16;
        this.doorToHouse.goToScene = 'LevelOne';
        this.physics.add.overlap(this.player, this.doorToHouse, this.onMeetDoor, null, this);

        this.battle = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.battle.create(280, 240, 32, 32);  
        this.battle.create(120, 120, 32, 32);  
        this.physics.add.overlap(this.player, this.battle, this.handleBattle, null, this);

        // added so character isn't walking in one direction when brought back into the scene
        this.sys.events.on('wake', this.wake, this);

        this.cameras.main.fadeIn(1100)

    } //end create

    wake() {
        this.player.keys.left.reset()
        this.player.keys.right.reset()
        this.player.keys.down.reset()
        this.player.keys.up.reset()
    }

    onMeetDoor(player, zone) {
        this.events.off("Information")    
        this.events.off("HealthBar")    
        this.cameras.main.fade(1100)
        this.input.keyboard.enabled = false;
        this.stopMovement = true;
        this.activeNPC = undefined;
        setTimeout(() => {
            this.input.keyboard.enabled = true;
            this.stopMovement = false;
            this.scene.start(this.doorToHouse.goToScene, {
                previousScene: this.currentScene});
        },1000)  
    }

    endGameMsg () {
        this.events.emit("Information", 'Ehhhhh, you did it! Congrats!', 30000);
        this.cameras.main.setBackgroundColor(0x333300);
        this.scene.pause();
    }

    
    update(time, delta) {
        this.player.update();

        this.updateActiveNPC()

        if (this.activeNPC == this.beachBall) {
            this.activeNPC.body.moves = true;
        }

        const spacePressed = Phaser.Input.Keyboard.JustDown(this.player.keys.space)

        if (spacePressed && this.activeNPC) {
            // add healthbar information here
            // this.events.emit("HealthBar", this.game.config.statData)
            if (this.activeNPC.type == "beachBall") {
                if (!this.dialog.StartScene.beachBall.first) {
                    this.events.emit("Information", this.dialog.StartScene.beachBall.one, 3000)
                    this.dialog.StartScene.beachBall.first = true;
                } else {
                    this.events.emit("Information", this.dialog.StartScene.beachBall.two, 3000)
                }
            } else if (this.activeNPC.type == "walker") {
                if (!this.dialog.StartScene.walker.first) {
                    this.events.emit("Information", this.dialog.StartScene.walker.one, 3000)
                    this.dialog.StartScene.walker.first = true;
                } else {
                    this.events.emit("Information", this.dialog.StartScene.walker.two, 3000)
                }
            } else if (this.activeNPC.type == "chaser") {
                if (!this.dialog.StartScene.chaser.first) {
                    this.events.emit("Information", this.dialog.StartScene.chaser.one, 3000)
                }
            } else if (this.activeNPC.type == "stander") {
                if (!this.dialog.StartScene.stander.first) {
                    this.events.emit("Information", this.dialog.StartScene.stander.one, 3000)
                } else {
                    this.events.emit("Information", this.dialog.StartScene.stander.two, 3000)
                    this.dialog.StartScene.stander.second = true;
                    setTimeout(() => {
                        this.stander.destroy();
                        this.blank.destroy();
                    }, 2000)
                }
            }

        } else if (spacePressed && !this.activeNPC) {
            this.events.emit("HealthBar", this.game.config.statData)
            this.events.emit("Information", "Nothing to see here.", 1500)
        }
        if(this.stopMovement) {
            this.player.body.stop();
            this.player.anims.stop();
        }
        this.chaser.update(this.player.body.position, time);
        this.walker.update();

    } //end update
} //end gameScene