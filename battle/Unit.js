class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, type, stats) {
        super(scene, x, y, texture, frame)

        this.type = type;
        this.maxHp = stats.maxHp;
        this.hp = stats.hp;
        this.offense = stats.offense;
        this.defense = stats.defense;
        this.level = stats.level;
        this.maxBp = stats.maxBp;
        this.bp = stats.bp;
        this.xp = stats.xp;
        this.nextLevel = stats.nextLevel;
        this.living = true;
        this.menuItem = null;
        if (this.type == "Warrior" || this.type == "Mage") {
            this.hpValue = new Text(scene, (x-30), (y-35), "defaultFont", `${this.hp}/${this.maxHp}`)
            .setFontSize(8).setTint(0xffffff);
            this.bpValue = new Text(scene, (x+10), (y-25), "defaultFont", `${this.bp}/${this.maxBp}`)
            .setFontSize(8).setTint(0xffff00);
        }
        this.scene.events.off()

    }

    init(data) {

    }

    setMenuItem(item) {
        this.menuItem = item;
    }

    // attack the target unit
    bash(target, hitRoll) {
        if(target.living) {
            const damage = Math.ceil((this.offense * (this.offense/target.defense)) + Math.ceil(Math.random() * this.level) + 1);
            if (hitRoll == 16) {
                const targetName = target.type.toLowerCase();
                target.anims.play(`${targetName}-bash`, true);
                const critDamage = Math.ceil(damage * 1.5)
                // critical hit
                target.takeDamage(critDamage);
                this.scene.events.emit("Message", this.type + " SMASHES " + target.type + " for " + critDamage + " damage");
            } else if (hitRoll <= 2) {
                // miss 
                target.takeDamage(damage * 0);
                this.scene.events.emit("Message", this.type + " misses");
            } else {
                const targetName = target.type.toLowerCase();
                target.anims.play(`${targetName}-bash`, true);
                // regular attack
                target.takeDamage(damage);
                this.scene.events.emit("Message", this.type + " bashes " + target.type + " for " + damage + " damage");
            }
        }
    }

    // attack the target unit with laser
    laser(target) {
        const targetName = target.type.toLowerCase();
        target.anims.play(`${targetName}-laser`, true);
        this.anims.play('laser-blast', true);
        if(target.living) {
            let laserDamage = Math.ceil((this.offense * (this.offense/target.defense)) + Math.ceil(Math.random() * this.level) + 1);
            laserDamage = laserDamage * 2;
            this.bp = this.bp - 1;
            this.bpValue.setText(`${this.bp.toString()}/${this.maxBp.toString()}`)
            target.takeDamage(laserDamage);
            this.scene.events.emit("Message", this.type + " blasts " + target.type + " for " + laserDamage + " damage");
        }
    }
    // attack the enemy with magnet (HP suck)
    magnet(target) {
        const targetName = target.type.toLowerCase();
        target.anims.play(`${targetName}-magnet`, true);
        this.anims.play('hp-magnet', true);
        if(target.living) {
            const magnetDamage = Math.ceil((Math.random() * 10) + (this.level * 2));
            const recovery = Math.ceil(magnetDamage / 2) + this.level;
            if (this.hp + recovery > this.maxHp) {
                this.hp = this.maxHp;
            } else {
                this.hp = this.hp + recovery;
            }
            this.bp = this.bp - 1;
            this.hpValue.setText(`${this.hp.toString()}/${this.maxHp.toString()}`);
            this.bpValue.setText(`${this.bp.toString()}/${this.maxBp.toString()}`);
            target.takeDamage(magnetDamage);
            this.scene.events.emit("Message", this.type + " drains " + magnetDamage + " HP out of " + target.type);
        }
    }

    // enemyAttack
    enemyAttack(target) {
        if(target.living) {
            const hitRoll = Math.ceil(Math.random() * 20);
            const damage = Math.ceil((this.offense * (this.offense/target.defense)) + Math.ceil(Math.random() * this.level) + 1);
            if (hitRoll == 20) {
                const targetName = target.type.toLowerCase();
                target.anims.play(`${targetName}-bash`, true);
                const critDamage = Math.ceil(damage * 1.5)
                // critical hit
                target.takeDamage(critDamage);
                this.scene.events.emit("Message", this.type + " SMASHES " + target.type + " for " + critDamage + " damage");
            } else if (hitRoll <= 2) {
                // miss 
                target.takeDamage(damage * 0);
                this.scene.events.emit("Message", this.type + " misses");
            } else {
                const targetName = target.type.toLowerCase();
                target.anims.play(`${targetName}-bash`, true);
                // regular attack
                target.takeDamage(damage);
                this.scene.events.emit("Message", this.type + " bashes " + target.type + " for " + damage + " damage");
            }
        }
    }

    rest() {
        const healing = Math.ceil((Math.random() * 5) + 5 + (this.level * 2));
        if (this.hp + healing > this.maxHp) {
            this.hp = this.maxHp;
        } else {
            this.hp = this.hp + healing;
        }
        this.hpValue.setText(`${this.hp.toString()}/${this.maxHp.toString()}`)
        this.scene.events.emit("Message", this.type + " rests for a moment, gaining " + healing + " HP");
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.type == "Warrior" || this.type == "Mage") {
            this.hpValue.setText(`${this.hp.toString()}/${this.maxHp.toString()}`);
        }
        if(this.hp <= 0) {
            this.hp = 0;
            if (this.type == "Warrior" || this.type == "Mage") {
                this.hpValue.setText("");
                this.bpValue.setText("");
            }
            this.menuItem.unitKilled();
            this.living = false;
            this.visible = false;   
            this.menuItem = null;
        }
    }

    endBattleMessage() {
        this.scene.events.emit("Message", "You win!");
    }

    gameOverMessage() {
        this.scene.events.emit("Message", "You blew it. Chaos reigns!");
    }

    levelUp() {
        this.scene.events.emit("Message", this.type + " levels up!");
    }

    addlMessage(message){
        if (message == "Low Battery") {
            this.scene.events.emit("Message", "No mutant energy left!");
        } else if (message == "Max HP") {
            this.scene.events.emit("Message", "HP is already maxed out!");
        }
    }

}