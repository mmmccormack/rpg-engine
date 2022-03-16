class ActionsMenu extends Menu {
    constructor(x, y, scene) {
        super(x, y, scene)

        this.addMenuItem("Attack");
        this.addMenuItem("Mutation");
        this.addMenuItem("Recover");

        this.scene.events.off()
    }
    confirm() {
        if (this.menuItemIndex == 2) {
            this.scene.events.emit("Rest", this.menuItemIndex);
        } else {
            this.scene.events.emit("SelectedAction", this.menuItemIndex); 
        }
               
    }
}