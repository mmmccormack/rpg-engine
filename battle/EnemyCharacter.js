class EnemyCharacter extends Unit {
    constructor(scene, x, y, texture, frame, type, stats) {
        super(scene, x, y, texture, frame, type, stats)

        this.setScale(2);
        this.scene = scene;
        this.enemy = type.toLowerCase();

        scene.anims.create({
            key: `${this.enemy}-laser`,
            frames: scene.anims.generateFrameNames(this.enemy, {frames: [ 3, 4, 3, 4, 0 ]}),
            frameRate: 10,
        })
        scene.anims.create({
            key: `${this.enemy}-magnet`,
            frames: scene.anims.generateFrameNames(this.enemy, {frames: [ 1, 2, 1, 2, 0 ]}),
            frameRate: 10,
        })
        scene.anims.create({
            key: `${this.enemy}-bash`,
            frames: scene.anims.generateFrameNames(this.enemy, {frames: [ 5, 6, 7, 6, 5, 0 ]}),
            frameRate: 16,
        })

    }
}