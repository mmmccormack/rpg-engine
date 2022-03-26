class Menu extends Phaser.GameObjects.Container {
    constructor(x, y, scene) {
        super(scene, x, y)

        this.menuItems = [];
        this.menuItemIndex = 0;
        this.x = x;
        this.y = y;
        this.selected = false;
    }

    addMenuItem(unit) {

        const menuItem = new MenuItem(this.scene, 0, this.menuItems.length * 20, "defaultFont", unit)
        .setFontSize(8).setTint(0xffffff);
        this.menuItems.push(menuItem);
        this.add(menuItem); 
        return menuItem; 
    }       
    moveSelectionUp() {
        this.menuItems[this.menuItemIndex].setTint(0xffffff);
        do {
            this.menuItemIndex--;
            if(this.menuItemIndex < 0)
                this.menuItemIndex = this.menuItems.length - 1;
        } while(!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].setTint(0xff0000);
    }
    moveSelectionDown() {
        this.menuItems[this.menuItemIndex].setTint(0xffffff);
        do {
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
        } while(!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].setTint(0xff0000);
    }
    // select the menu as a whole and an element with index from it
    select(index) {
        if(!index) {
            index = 0;
        }       
        this.menuItems[this.menuItemIndex].setTint(0xffffff);
        this.menuItemIndex = index;
        while(!this.menuItems[this.menuItemIndex].active) {
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length) {
                this.menuItemIndex = 0;
            }
            if(this.menuItemIndex == index) {
                return;
            }
        }
        this.menuItems[this.menuItemIndex].setTint(0xff0000);
        this.selected = true;
    }
    // deselect this menu
    deselect() {        
        this.menuItems[this.menuItemIndex].setTint(0xffffff);
        this.menuItemIndex = 0;
        this.selected = false;
    }
    confirm() {
        // when the player confirms his selection, do the action
    }
    clear() {
        for(let i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    }
    remap(units) {
        this.clear();        
        for(let i = 0; i < units.length; i++) {
            const unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.type));  
        }
        this.menuItemIndex = 0;
    }

}