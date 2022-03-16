class Enemy extends NonPlayer {
    constructor(scene, x, y, textureKey, type, speed) {
        super(scene, x, y, textureKey, type, speed)

        this.speed = 30;
        this.chasing = true;
        this.storedTime = 0;
        this.type = type;
    }

    update(destination, time) {
        const {speed} = this;
        const newTime = time;
        if (this.chasing) {
            if (newTime > this.storedTime) {
                this.storedTime = newTime + 500;
                this.body.setVelocity(0, 0);
                const dx = Math.abs(this.body.x - destination.x);
                const dy = Math.abs(this.body.y - destination.y);
                if (dx > dy) {
                    // close x gap
                    if (this.body.x < destination.x) {
                        // move right
                        this.body.setVelocity(speed, 0);
                        this.anims.play(this.type+'-npc-right', true)
                    } else {
                        // move left
                        this.body.setVelocity(-speed, 0);
                        this.anims.play(this.type+'-npc-left', true)
                    }
                } else {
                    // close y gap
                    if (this.body.y < destination.y) {
                        // move down
                        this.body.setVelocity(0, speed);
                        this.anims.play(this.type+'-npc-down', true)
                    } else {
                        //move up
                        this.body.setVelocity(0, -speed);
                        this.anims.play(this.type+'-npc-up', true)
                    }
                }
                this.body.velocity.normalize().scale(speed);
            }
        }//end chasing

        const npcBlocked = this.body.blocked;
        if (npcBlocked.down || npcBlocked.up || npcBlocked.left || npcBlocked.right) {
            this.chasing = false;

            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.chasing = true;
                },
                callbackScope: this.scene,
                loop: false
            })

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
    }// end update
}