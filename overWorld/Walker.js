class Walker extends NonPlayer {
    constructor(scene, x, y, textureKey, type, speed) {
        super(scene, x, y, textureKey, type, speed)

        this.textureKey = textureKey;
        this.speed = speed;
        this.type = type;


        const randomWalk = setInterval(() => {
            if (this.body === undefined) {
                clearInterval(randomWalk);
                return;
            }
            let direction = Math.floor(Math.random() * 5);
    
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
                case 4:
                    this.body.setVelocity(0,0);
                    this.anims.stop();
                    break;
            }
        }, 5000)
    }

    update() {

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