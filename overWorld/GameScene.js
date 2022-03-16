class GameScene extends Phaser.Scene {
    constructor(sceneName) {
        super({key: sceneName});

        this.spawnPointX = null;
        this.spawnPointY = null;
        this.currentScene = sceneName;
        
    }

    init(data) {}

    preload() {

        // load main character spritesheet
        this.load.spritesheet('characters', './assets/sprites/walkingwarrior.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        // load pickups spritesheet
        this.load.spritesheet('pickups', './assets/sprites/pickupsSmall.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        // loading an atlas specifies both an image and a json file that it corresponds to
        this.load.atlas('npcs', './assets/sprites/demoNPCs.png', './assets/sprites/demoNPCs.json');

        this.keys;
        this.player;
        this.npc;
        this.nonPlayers;
        this.activeNPC;
        this.healthPacks;
        this.pills;
        this.information;
        this.healthBar;

        this.load.json('dialog', './battle/jsonData/dialog.json');
        this.load.json('flags', './battle/jsonData/flags.json');

    } //end preload

    create(settings) {
        this.game.config.currentScene = this.currentScene;
        this.statData = this.game.config.statData;
        this.dialog = this.cache.json.get('dialog');
        const flagInfo = this.cache.json.get('flags');
        this.flags = { ...flagInfo };



        const map = this.make.tilemap({ key: settings.mapKey })
        const tileset = map.addTilesetImage(settings.tiledKey, settings.tileKey)
        const belowLayer = map.createStaticLayer('ground', tileset, 0, 0);
        this.worldLayer = map.createStaticLayer('knock', tileset, 0, 0);
        const aboveLayer = map.createStaticLayer('above', tileset, 0, 0);
        // this isn't loading the images, but only the positioning info
        const pickupLayer = map.createStaticLayer('pickups', tileset, 0, 0);
        // this isn't loading the enemies, but only the positioning info
        const npcLayer = map.createStaticLayer('nonplayers', tileset, 0, 0);



        aboveLayer.setDepth(100)

        this.worldLayer.setCollisionByProperty({ collides: true });
        
        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // adding pickup info
        this.anims.create({
            key: 'pill',
            frames: this.anims.generateFrameNumbers('pickups', { start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'healthPack',
            frames: this.anims.generateFrameNumbers('pickups', { start: 8, end: 15}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'beachBall',
            frames: this.anims.generateFrameNumbers('npcs', { start: 16, end: 23}),
            frameRate: 10,
            repeat: -1
        });
        this.pills = this.physics.add.group();
        this.healthPacks = this.physics.add.group();
        this.nonPlayers = this.physics.add.group();

        // add pickups to scene
        let counter = 1;
        pickupLayer.forEachTile(tile => {
            // tiles that aren't pickups render out to -1 in the tile object because they aren't on the pickup layer. If a tile has a different index, it is a pickup.
            if (tile.index !== -1) {
                // tile.properties.kind gives you the name that was assigned in Tiled and is in the JSON
                let pickup;
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                if (tile.properties.type == "pill") {
                    pickup = this.pills.create(x, y, 'pill');
                    pickup.pickupNum = `pill-${counter}`;
                    counter++;
                    pickup.anims.play('pill', true);
                } else if (tile.properties.type == "healthPack") {
                    pickup = this.healthPacks.create(x, y, 'healthPack');
                    pickup.pickupNum = `healthPack-${counter}`;
                    counter++;
                    pickup.anims.play('healthPack', true);
                }
                pickup.body.width = 16;
                pickup.body.height = 16;
            }
        })
        
        // add nonplayers to scene
        npcLayer.forEachTile(tile => {
            if (tile.properties.type !== undefined) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                if (tile.properties.type == "chaser") {
                    this.chaser = new Enemy(this, x, y, 'npcs', tile.properties.type, 30);
                    this.nonPlayers.add(this.chaser);
                    this.physics.add.collider(this.chaser, this.worldLayer);
                    this.physics.add.collider(this.chaser, this.nonPlayers);
                } else if (tile.properties.type == "walker") {
                    this.walker =  new Walker(this, x, y, 'npcs', tile.properties.type, 30);
                    this.nonPlayers.add(this.walker);
                    this.physics.add.collider(this.walker, this.worldLayer);
                    this.physics.add.collider(this.walker, this.nonPlayers);
                } else if (tile.properties.type == "stander") {
                    this.stander = new NonPlayer(this, x, y, 'npcs', tile.properties.type, 0, 2);
                    this.nonPlayers.add(this.stander);
                    this.physics.add.collider(this.stander, this.worldLayer);
                    this.physics.add.collider(this.stander, this.nonPlayers);
                }else if (tile.properties.type = "beachBall") {
                    this.beachBall = new NonPlayer(this, x, y, 'npcs', tile.properties.type, 0);
                    this.nonPlayers.add(this.beachBall);
                    this.beachBall.type = "beachBall";
                    this.physics.add.collider(this.beachBall, this.worldLayer);
                    this.physics.add.collider(this.beachBall, this.blank);
                    this.physics.add.collider(this.beachBall, this.nonPlayers);
                    this.beachBall.body.setImmovable(false);
                }
            }
        });
        
        //player (scene, starting x coord, starting y coord, textureKey on spritesheet)
        this.player = new Player(this, this.spawnPointX, this.spawnPointY, 'characters')
        this.physics.add.collider(this.player, this.worldLayer)
        this.physics.add.overlap(this.player, this.nonPlayers);
        
        this.cameras.main.startFollow(this.player, true, 1, 1)
        this.player.body.setCollideWorldBounds(true)

        // this.battle = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        // this.physics.add.overlap(this.player, this.battle, this.handleBattle, null, this);
        this.physics.add.overlap(this.player, this.pills, this.handlePlayerPillCollision, null, this);
        this.physics.add.overlap(this.player, this.healthPacks, this.handlePlayerHealthCollision, null, this);
        

        // this is to add text information to the scene in a popup
        this.information = new Information(this, this.events);
        this.information.setDepth(120)
        this.information.setScrollFactor(0)
        this.add.existing(this.information); 

        this.healthBar = new HealthBar(this, this.events);
        this.healthBar.setDepth(120)
        this.healthBar.setScrollFactor(0)
        this.add.existing(this.healthBar); 

    } //end create

    // handle dialog NPC
    handleDialog(player, npc) {
        if (this.activeNPC) { return }
        this.activeNPC = npc
    }

    updateActiveNPC() {
        if (!this.activeNPC || this.activeNPC.body === undefined) { return }
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.activeNPC.x, this.activeNPC.y);
        if (distance < 32) {
            if (this.activeNPC.body != undefined) {
                this.activeNPC.body.moves = false;
            }
            return;
        }
        this.activeNPC.body.setVelocity(0)
        this.activeNPC.body.moves = true;
        this.activeNPC = undefined;
    }

    // handle item collision
    handlePlayerPillCollision(p,pill) {
        this.cameras.main.flash(100)
        this.game.config.bpBonus = ~~this.game.config.bpBonus + 2;
        if (this.game.config.statData) {
            for (let i = 0; i < 2; i++) {
                this.game.config.statData[i].bp = ~~this.game.config.statData[i].bp + 1;
                if (this.game.config.statData[i].bp > this.game.config.statData[i].maxBp) {
                    this.game.config.statData[i].bp = this.game.config.statData[i].maxBp;
                }
            }
        }
        this.flags[this.currentScene][pill.pickupNum].collected = true;
        pill.destroy();
    }
    handlePlayerHealthCollision(p,healthPack) {
        this.cameras.main.flash(100)
        this.game.config.hpBonus = ~~this.game.config.hpBonus + 20;
        if (this.game.config.statData) {
            for (let i = 0; i < 2; i++) {
                this.game.config.statData[i].hp = ~~this.game.config.statData[i].hp + 10;
                if (this.game.config.statData[i].hp > this.game.config.statData[i].maxHp) {
                    this.game.config.statData[i].hp = this.game.config.statData[i].maxHp;
                }
            }
        }
        this.flags[this.currentScene][healthPack.pickupNum].collected = true;
        healthPack.destroy();
    }
    handleBattle(player,zone) {
        // this.chaser.isDead = true;
        zone.x = Phaser.Math.RND.between(16, this.physics.world.bounds.width - 16);
        zone.y = Phaser.Math.RND.between(16, this.physics.world.bounds.height - 16);
        this.input.stopPropagation();
        this.cameras.main.shake(100)
        this.cameras.main.fadeOut(1100)
        this.input.keyboard.enabled = false;
        this.stopMovement = true;
        setTimeout(() => {
            this.input.keyboard.enabled = true;
            this.stopMovement = false;
            this.scene.switch('BattleScene', {
                previousScene: this.currentScene});
            this.cameras.main.fadeIn(500)
        },1000)

    }

    update(time, delta) { }
} //end gameScene