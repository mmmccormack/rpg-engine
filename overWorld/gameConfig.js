
window.addEventListener('load', () => {
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    zoom: 2,
    backgroundColor: 0x999999,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
        }
    },
    pixelArt: true,
    scene: [IntroScene,StartScene,BattleScene,UIScene,LevelOne],
    hpBonus: 0,
    bpBonus: 0,
    currentScene: 'IntroScene',
    statData: []
}
const game = new Phaser.Game(config)
}) //end load listener
