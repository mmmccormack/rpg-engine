class Player extends Entity {
    constructor(scene, x, y, textureKey, stats) {
        super(scene, x, y, textureKey, 'Player', stats)

        const animFrameRate = 5;
        const anims = scene.anims;

        anims.create({
            key: 'player-left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [2,3]
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [6,7] 
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [1,5]
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [0, 4] 
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.idleFrame = {
            down: 0,
            left: 2,
            right: 7,
            up: 1
        }
        this.setFrame(this.idleFrame.down);

        ////////////
        //controls//
        const {LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACEBAR} = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D,
            space: 32
        })

    }
    //end constructor (it's your create method)


 
    update() {
        const {keys} = this; //output: this.keys
        const speed = 80;
        const previousVelocity = this.body.velocity.clone()

        this.body.setVelocity(0)
        //movement
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
        }

        this.body.velocity.normalize().scale(speed)

        //animations
        if (keys.up.isDown || keys.w.isDown) {
            this.anims.play('player-up', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.anims.play('player-down', true)
        } else
        if (keys.left.isDown || keys.a.isDown) {
            this.anims.play('player-left', true)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.anims.play('player-right', true)
        } else {
            this.anims.stop()
        }
 

        //set idle animations
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            //show idle anims
            if (previousVelocity.x < 0) {
                this.setFrame(this.idleFrame.left)
            } else if (previousVelocity.x > 0) {
                this.setFrame(this.idleFrame.right)
            } else if (previousVelocity.y < 0) {
                this.setFrame(this.idleFrame.up)
            } else if (previousVelocity.y > 0) {
                this.setFrame(this.idleFrame.down)
            }
        }
    }
}