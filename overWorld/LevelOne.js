class LevelOne extends GameScene {
    constructor() {
        super('LevelOne');
    }

    init(data) {
        if (data.previousScene == "StartScene") {
            this.spawnPointX = 120;
            this.spawnPointY = 120;
        }
    }

    preload() {
        this.cameras.main.setBackgroundColor(0x000011)
        this.load.image('tiles', './assets/Tilemap/purpleTransparent.png')
        this.load.tilemapTiledJSON('houseMap', './overWorld/house.json')

        super.preload();
    } //end preload

    create() {

        super.create({
			tileKey: 'tiles',
			mapKey: 'houseMap',
			tiledKey: 'house'
		});
        
        this.physics.add.overlap(this.player, this.pills, this.handlePlayerPillCollision, null, this);
        this.physics.add.overlap(this.player, this.healthPacks, this.handlePlayerHealthCollision, null, this);

        if (!this.dialog.LevelOne.bookcase.first) {
            this.bookcase = this.physics.add.sprite(110, 41, null);
            this.bookcase.type = "bookcase";
            this.bookcase.visible = false;
            this.bookcase.displayWidth = 32;
            this.bookcase.displayHeight = 16;
            this.physics.add.collider(this.player, this.bookcase, this.handleDialog, null, this);
            this.bookcase.body.setImmovable(true);
        }

        this.pills.getChildren().forEach(child => {
            const pill = child.pickupNum;
            if(this.flags.LevelOne[pill].collected) {
                child.body.destroy();
                child.visible = false;
            }
        });

        this.healthPacks.getChildren().forEach(child => {
            const healthPack = child.pickupNum;
            if(this.flags.LevelOne[healthPack].collected) {
                child.body.destroy();
                child.visible = false;
            }
        });

        this.houseGuy = this.physics.add.sprite(200, 112, 'npcs', "stander-walk-down-01.png");
        this.houseGuy.type = "houseGuy";
        this.physics.add.collider(this.player, this.houseGuy, this.handleDialog, null, this)
        this.houseGuy.body.setCollideWorldBounds(true)
        this.houseGuy.body.setImmovable(true)

        // list of possible player collisions below:
        this.doorToWorld = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.doorToWorld.create(120, 150, 16, 16);
        this.doorToWorld.goToScene = 'StartScene';
        this.physics.add.overlap(this.player, this.doorToWorld, this.onMeetDoor, null, this);

        this.battle = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.battle.create(54, 42, 16, 16);  
        this.physics.add.overlap(this.player, this.battle, this.handleBattle, null, this);

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
        this.cameras.main.fade(1100)
        this.input.keyboard.enabled = false;
        this.stopMovement = true;
        setTimeout(() => {
            this.input.keyboard.enabled = true;
            this.stopMovement = false;
            this.scene.start(this.doorToWorld.goToScene, {
                previousScene: this.currentScene});
        },1000)  
    }
 
    update(time, delta) {
        this.player.update();

        const spacePressed = Phaser.Input.Keyboard.JustUp(this.player.keys.space)

        if (spacePressed && this.activeNPC) {
            if (this.activeNPC.type == "houseGuy") {
                if (!this.dialog.LevelOne.houseGuy.first) {
                    this.events.emit("Information", this.dialog.LevelOne.houseGuy.one, 2000)
                    this.dialog.LevelOne.houseGuy.first = true;
                } else {
                    this.events.emit("Information", this.dialog.LevelOne.houseGuy.two, 2000)
                }
            } else if (this.activeNPC.type == "bookcase") {
                if (!this.dialog.LevelOne.bookcase.first) {
                    this.events.emit("Information", this.dialog.LevelOne.bookcase.one, 2000)
                    this.dialog.LevelOne.bookcase.first = true;
                    this.dialog.StartScene.stander.first = true;
                    this.bookcase.destroy();
                }
            }
            this.activeNPC = undefined;
            
        } else if (spacePressed && !this.activeNPC) {
            this.events.emit("HealthBar", this.game.config.statData)
            this.events.emit("Information", "Nothing to see here.", 1000)
        }

        if(this.stopMovement) {
            this.player.body.stop();
            this.player.anims.stop();
        }
    } //end update

} //end gameScene