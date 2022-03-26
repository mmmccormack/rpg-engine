class UIScene extends Phaser.Scene {
    constructor() {
        super({key: 'UIScene'})
    }

    create() {    
        this.graphics = this.add.graphics();
        // line thickness, line color
        this.graphics.lineStyle(3, 0xffff00);
        // fill color, fill transparency
        this.graphics.fillStyle(0x000000, 0.7);
            // start x, start y, width, height
        this.graphics.strokeRect(5, 170, 110, 60);
        this.graphics.fillRect(5, 170, 110, 60);
        this.graphics.strokeRect(125, 170, 90, 60);
        this.graphics.fillRect(125, 170, 90, 60);
        this.graphics.strokeRect(225, 170, 90, 60);
        this.graphics.fillRect(225, 170, 90, 60);
        
        // basic container to hold all menus
        this.menus = this.add.container();
                        
        this.heroesMenu = new HeroesMenu(230, 175, this);                                      
        this.actionsMenu = new ActionsMenu(130, 175, this);            
        this.enemiesMenu = new EnemiesMenu(10, 175, this);  

        // the currently selected menu 
        this.currentMenu = this.actionsMenu;

        // add menus to the container
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);
                
        this.battleScene = this.scene.get("BattleScene");                                

        // listen for keyboard events
        this.input.keyboard.on("keydown", this.onKeyInput, this);   

        // when its player unit turn to move
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

        // when the action on the menu is selected
        // for now we have only one action so we dont send and action id
        this.events.on("SelectedAction", this.onSelectedAction, this);
        
        this.events.on("Rest", this.onRestAction, this);

        // an enemy is selected
        this.events.on("Enemy", this.onEnemy, this);

        // when the scene receives wake event
        this.sys.events.on('wake', this.createMenu, this);

        // the message describing the current action
        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);   

        this.createMenu();     
    }
    createMenu() {
        // map hero menu items to heroes
        this.remapHeroes();
        // map enemies menu items to enemies
        this.remapEnemies();
        // first move
        setTimeout(()=> {
            this.battleScene.nextTurn(); 

        }, 2000)
    }
    onEnemy(index) {
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        if (this.attackType == 1) {
            this.battleScene.receivePlayerSelection("mutation", index);
        } else {
            this.battleScene.receivePlayerSelection("bash", index);
        }
    }
    onRestAction(index) {
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.battleScene.receivePlayerSelection("rest", index);
    }
    onPlayerSelect(id) {
        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    }
    onSelectedAction(type) {
        this.attackType = type;
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    }
    remapHeroes() {
        const heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    }
    remapEnemies() {
        const enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    }
    onKeyInput(event) {
        if(this.currentMenu && this.currentMenu.selected) {
            if(event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if(event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if(event.code === "ArrowRight" || event.code === "Shift") {
                this.enemiesMenu.deselect();
                this.currentMenu = this.actionsMenu;
                return;
            } else if(event.code === "Space" || event.code === "ArrowLeft") {
                this.currentMenu.confirm();
            } 
        }
    }
    
}