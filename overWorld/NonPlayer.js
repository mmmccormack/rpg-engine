class NonPlayer extends Entity {
    constructor(scene, x, y, textureKey, type, speed, direction = Math.floor(Math.random() * 4)) {
        super(scene, x, y, textureKey, type, speed)

        const anims = scene.anims;
        const animFrameRate = 3;
        this.textureKey = textureKey;
        this.speed = speed;
        // this will correspond to the name you have for the image in the json
        this.type = type;

        if (this.type === "beachBall") {
            anims.create({
                key: this.type+'-npc-spin',
                // use generateFrameNames when you're corresponding to info in a character json file and using an atlas to define them.
                frames: anims.generateFrameNames(this.textureKey, {
                    prefix: this.type+'-spin-',
                    suffix: '.png',
                    start: 1,
                    end: 8,
                    // this is the number of characters that follow the slash in the json file
                    zeroPad: 2
                }),
                frameRate: 8,
                repeat: -1
            })
            this.anims.play(this.type+'-npc-spin');
            return;
        } else {

            anims.create({
                key: this.type+'-npc-left',
                // use generateFrameNames when you're corresponding to info in a character json file and using an atlas to define them.
                frames: anims.generateFrameNames(this.textureKey, {
                    prefix: this.type+'-walk-left-',
                    suffix: '.png',
                    start: 1,
                    end: 2,
                    // this is the number of characters that follow the slash in the json file
                    zeroPad: 2
                }),
                frameRate: animFrameRate,
                repeat: -1
            })
            anims.create({
                key: this.type+'-npc-right',
                // use generateFrameNames when you're corresponding to info in a character json file and using an atlas to define them.
                frames: anims.generateFrameNames(this.textureKey, {
                    prefix: this.type+'-walk-right-',
                    suffix: '.png',
                    start: 1,
                    end: 2,
                    // this is the number of characters that follow the slash in the json file
                    zeroPad: 2
                }),
                frameRate: animFrameRate,
                repeat: -1
            })
            anims.create({
                key: this.type+'-npc-up',
                // use generateFrameNames when you're corresponding to info in a character json file and using an atlas to define them.
                frames: anims.generateFrameNames(this.textureKey, {
                    prefix: this.type+'-walk-up-',
                    suffix: '.png',
                    start: 1,
                    end: 2,
                    // this is the number of characters that follow the slash in the json file
                    zeroPad: 2
                }),
                frameRate: animFrameRate,
                repeat: -1
            })
            anims.create({
                key: this.type+'-npc-down',
                // use generateFrameNames when you're corresponding to info in a character json file and using an atlas to define them.
                frames: anims.generateFrameNames(this.textureKey, {
                    prefix: this.type+'-walk-down-',
                    suffix: '.png',
                    start: 1,
                    end: 2,
                    // this is the number of characters that follow the slash in the json file
                    zeroPad: 2
                }),
                frameRate: animFrameRate,
                repeat: -1
            })
        }

        switch (direction) {
            // up
            case 0:
                this.body.setVelocity(0, -this.speed);
                this.anims.play(this.type+'-npc-up');
                break;
            // left
            case 1:
                this.body.setVelocity(-this.speed, 0);
                this.anims.play(this.type+'-npc-left');
                break;
            // down
            case 2:
                this.body.setVelocity(0, this.speed);
                this.anims.play(this.type+'-npc-down');
                break;
            // right
            case 3:
                this.body.setVelocity(this.speed, 0);
                this.anims.play(this.type+'-npc-right');
                break;
        }
    }

    update() {
        const {speed} = this;
        const npcBlocked = this.body.blocked;

        if (npcBlocked.down || npcBlocked.up || npcBlocked.left || npcBlocked.right) {
            let possDir = [];
            for (const direction in npcBlocked) {
                possDir.push(direction);
            }
            const newDirection = possDir[Math.floor(Math.random() * 4) + 1];
            switch (newDirection) {
                // up
                case 'up':
                    this.body.setVelocity(0, -this.speed);
                    this.anims.play(this.type+'-npc-up');
                    break;
                // left
                case 'left':
                    this.body.setVelocity(-this.speed, 0);
                    this.anims.play(this.type+'-npc-left');
                    break;
                // down
                case 'down':
                    this.body.setVelocity(0, this.speed);
                    this.anims.play(this.type+'-npc-down');
                    break;
                // right
                case 'right':
                    this.body.setVelocity(this.speed, 0);
                    this.anims.play(this.type+'-npc-right');
                    break;
            }
        }
    }
}