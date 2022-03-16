class PlayerCharacter extends Unit {
    constructor(scene, x, y, texture, frame, type, stats) {
        super(scene, x, y, texture, frame, type, stats)

        this.flipX = true;
        this.setScale(2);

        this.scene = scene;

        // need to edit this so it has the proper animation on it
        scene.anims.create({
            key: 'laser-blast',
            frames: scene.anims.generateFrameNames('player', {frames: [ 2, 3, 4, 3, 2, 1 ]}),
            frameRate: 10,
        })
        scene.anims.create({
            key: 'hp-magnet',
            frames: scene.anims.generateFrameNames('player', {frames: [ 21, 22, 23, 22, 21, 4 ]}),
            frameRate: 10,
        })

    }
}
