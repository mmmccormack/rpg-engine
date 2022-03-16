class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene')

    }

    preload() {

        this.load.spritesheet('player', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('dragon', './assets/dragon-01.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('pumpkin', './assets/pumpkin-01.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.json('levels', './battle/jsonData/player_levels.json');

    }

    create(){
        // change the background to grey
        this.cameras.main.setBackgroundColor("rgba(60, 60, 60, 1)");
        this.battleResult = "";
        this.startBattle();

        // on wake event we call startBattle too
        this.sys.events.on('wake', this.startBattle, this);
    }

    startBattle() {
        this.cameras.main.fadeIn(2000)

        const hpBonus = ~~this.game.config.hpBonus / 2;
        const bpBonus = ~~this.game.config.bpBonus / 2;
        
        const heroArray = [];
        // if the player has already been in a battle, their stats are recorded by the game and will be loaded
        if (!this.battled || this.battled === undefined) {
            const levelData = this.cache.json.get('levels')

            const getHeroProperties = heroName => {
                const dataPull = levelData[heroName]["level1"]
                const {level, offense, defense, maxHp, hp, maxBp, bp, nextLevel} = dataPull;
                if (heroName == "Warrior") {
                    const finalHero = new PlayerCharacter(this, 250, 50, "player", 1, heroName, {level, offense, defense, maxHp, hp, maxBp, bp, nextLevel});
                    heroArray.push(finalHero);
                    this.add.existing(finalHero);
                } else if (heroName == "Mage") {
                    const finalHero = new PlayerCharacter(this, 265, 100, "player", 4, heroName, {level, offense, defense, maxHp, hp, maxBp, bp, nextLevel});
                    heroArray.push(finalHero);
                    this.add.existing(finalHero);
                }
                this.battled = true;
                this.heroData = [];
            }
            getHeroProperties('Warrior')
            getHeroProperties('Mage')

        } else {

            const reloadHeroProperties = heroName => {
                
                if (heroName == "Warrior") {
                    const index = 0;
                    let {level, offense, defense, maxHp, hp, maxBp, bp, xp, nextLevel} = this.heroData[index];
                    hp = hp + hpBonus >= this.heroData[index].maxHp ? this.heroData[index].maxHp : this.heroData[index].hp + hpBonus;
                    bp = bp + bpBonus >= this.heroData[index].maxBp ? this.heroData[index].maxBp : this.heroData[index].bp + bpBonus;
                    const finalHero = new PlayerCharacter(this, 250, 50, "player", 1, heroName, {level, offense, defense, maxHp, hp, maxBp, bp, xp, nextLevel});
                    heroArray.push(finalHero);
                    this.add.existing(finalHero);
                } else if (heroName == "Mage") {
                    const index = 1;
                    let {level, offense, defense, maxHp, hp, maxBp, bp, xp, nextLevel} = this.heroData[index];
                    hp = hp + hpBonus >= this.heroData[index].maxHp ? this.heroData[index].maxHp : this.heroData[index].hp + hpBonus;
                    bp = bp + bpBonus >= this.heroData[index].maxBp ? this.heroData[index].maxBp : this.heroData[index].bp + bpBonus;
                    const finalHero = new PlayerCharacter(this, 265, 110, "player", 4, heroName, {level, offense, defense, maxHp, hp, maxBp, bp, xp, nextLevel});
                    heroArray.push(finalHero);
                    this.add.existing(finalHero);
                }
            }
            reloadHeroProperties('Warrior')
            reloadHeroProperties('Mage')
        }
        this.game.config.hpBonus = 0;
        this.game.config.bpBonus = 0;

        // get enemy encounter data from json sheet and determine which random battle heroes will fight
        const enemyData = this.cache.json.get('enemies')
        const encounter = Math.floor(Math.random() * enemyData.enemy_encounters.length);
        const fight = enemyData.enemy_encounters[encounter]
        
        const enemiesArray = [];
        const getEnemyProperties = fight => {
            fight.forEach(enemy => {
                for (let name in enemy) {
                    const enemyProperties = [];
                    enemyProperties.push(enemy[name]['position']['x'])
                    enemyProperties.push(enemy[name]['position']['y'])
                    enemyProperties.push(enemy[name]['texture'])
                    enemyProperties.push(enemy[name]['frame'])
                    enemyProperties.push(enemy[name]['type'])
                    enemyProperties.push(enemy[name]['stats'])
                    const enemyCharacter = new EnemyCharacter(this, ...enemyProperties)
                    enemiesArray.push(enemyCharacter)
                    this.add.existing(enemyCharacter)
                }
            })
        };
        getEnemyProperties(fight['encounter']);
        
        // array with heroes
        this.heroes = heroArray;
        // array with enemies
        this.enemies = enemiesArray;
        // array with both parties, who will attack. If you want to, add a function to randomize the array
        this.units = this.heroes.concat(this.enemies);
        this.index = -1; // currently active unit
        
        this.scene.run("UIScene");        
    }

    nextTurn() {
        // if we have victory or game over
        if(this.checkEndBattle()) {           
            if(this.battleResult == "gameOver") {
                this.gameOver();
                return;
            }
            this.endBattle();
            return;
        }
        do {
            // currently active unit
            this.index++;
            // if there are no more units, we start again from the first one
            if(this.index >= this.units.length) {
                this.index = 0;
            }            
        } while(!this.units[this.index].living);
        // if its player hero
        if(this.units[this.index] instanceof PlayerCharacter) {
            // we need the player to select action and then enemy
            this.events.emit("PlayerSelect", this.index);
        } else { // else if its enemy unit
            // pick random living hero to be attacked
            let r;
            do {
                r = Math.floor(Math.random() * this.heroes.length);
            } while(!this.heroes[r].living) 
            // call the enemy's attack function 
            this.units[this.index].enemyAttack(this.heroes[r]);  
            // add timer for the next turn, so will have smooth gameplay
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
    }

    checkEndBattle() {        
        let victory = true;
        // if all enemies are dead we have victory
        for(let i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i].living)
                victory = false;
        }
        let gameOver = true;
        // if all heroes are dead we have game over
        for(let i = 0; i < this.heroes.length; i++) {
            if(this.heroes[i].living)
                gameOver = false;
        }
        if (gameOver) {
            this.battleResult = "gameOver"
        }
        return victory || gameOver;
    }

    gameOver() {
        this.scene.stop(this.game.config.currentScene);
        this.cameras.main.fadeOut(4000);
        setTimeout(() => {
            this.heroes[0].gameOverMessage();
            this.battled = false;
        },2000)
        setTimeout(() => {
            this.scene.stop('BattleScene');
            this.scene.sleep('UIScene');
            this.scene.start('IntroScene');
        },5000)
        
    }


    receivePlayerSelection(action, target) {
        if(action == 'bash') {  
            const hitRoll = Math.floor(Math.random() * 16) + 1;
            if (hitRoll == 16) {
                this.cameras.main.shake(300);
            }        
            this.units[this.index].bash(this.enemies[target], hitRoll);              
        } else if (action == 'mutation') {
            if (this.units[this.index].bp != 0) {
                if (this.units[this.index].type == "Warrior") {
                    this.units[this.index].laser(this.enemies[target]);
                } else if (this.units[this.index].type == "Mage") {
                    this.units[this.index].magnet(this.enemies[target]);
                }
            } else {
                this.units[this.index].addlMessage("Low Battery")
                this.events.emit("PlayerSelect", this.index);
                return;
            }
        } else if (action == 'rest') {
            if (this.units[this.index].hp == this.units[this.index].maxHp) {
                this.units[this.index].addlMessage("Max HP")
                this.events.emit("PlayerSelect", this.index);
                return;
            } else {
                this.units[this.index].rest(this.units[this.index]);
            }
        }
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    }

    endBattle() {
        this.cameras.main.fadeOut(2000)
        this.heroes[0].endBattleMessage()
        for(let i = 0; i < this.heroes.length; i++) {
            if(!this.heroes[i].living && this.heroes[i].hp <= 0) {
                this.heroes[i].living = true;
                this.heroes[i].hp = 1;
                this.heroes[i].visible = true;
            }
        }
        setTimeout(() => {
            let xpTotal = 0;
            for(let i = 0; i < this.enemies.length; i++) {
                xpTotal = xpTotal + this.enemies[i].xp;  
            }
            xpTotal = Math.ceil(xpTotal / this.heroes.length);
            for(let i = 0; i < this.heroes.length; i++) {
                if (this.heroData.length >= 2) {
                    this.heroData.shift();
                }
                this.heroes[i].xp = ~~this.heroes[i].xp + xpTotal;
                this.heroData.push(this.heroes[i])
            }
            this.game.config.statData = [...this.heroData];
            // check for level up with your characters
            const levelData = this.cache.json.get('levels');
    
            const timer = ms => new Promise(res => setTimeout(res, ms))
    
            async function levelUpCheck (heroes) { // We need to wrap the loop into an async function for this to work
                for (var i = 0; i < heroes.length; i++) {
                    const nextLevelNumber = heroes[i].nextLevel;
                    if (heroes[i].xp >= nextLevelNumber) {
                        // level up message display
                        heroes[i].levelUp();
                        const nextLevel = heroes[i].level + 1;
                        heroes[i].level = levelData[heroes[i].type][`level${nextLevel}`].level;
                        heroes[i].offense = levelData[heroes[i].type][`level${nextLevel}`].offense;
                        heroes[i].defense = levelData[heroes[i].type][`level${nextLevel}`].defense;
                        heroes[i].maxHp = levelData[heroes[i].type][`level${nextLevel}`].maxHp;
                        heroes[i].maxBp = levelData[heroes[i].type][`level${nextLevel}`].maxBp;
                        heroes[i].nextLevel = levelData[heroes[i].type][`level${nextLevel}`].nextLevel;   
                    }
                    await timer(1000); // then the created Promise can be awaited
                }
            }
    
            levelUpCheck(this.heroes);
        },2000)

        setTimeout(() => {
            // clear state, remove sprites
            this.heroes.length = 0;
            this.enemies.length = 0;
            for(let i = 0; i < this.units.length; i++) {
                if (this.units[i].bpValue) {
                    this.units[i].bpValue.setText("")
                }
                if (this.units[i].hpValue) {
                    this.units[i].hpValue.setText("")
                }
                // link item
                this.units[i].destroy();            
            }
            this.units.length = 0;
            // sleep the UI
            // return to overworld and sleep current BattleScene
            this.scene.sleep('UIScene');
            this.scene.switch(this.game.config.currentScene);

        },5000)
    }

    update() {

    }

}