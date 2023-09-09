export class HealthBar {
    private currentHealth: number = 100;
    private maxHealth: number = 100;

    private x: number = 100;
    private y: number = 50;
    private width: number = 100;
    private height: number = 10;
    private marginTop: number = 100;
    private marginRight: number = 10;
    private marginBottom: number = 10;
    private marginLeft: number = 100;


    constructor(health: number) {
        this.maxHealth = health;
        this.currentHealth = health;
    }

    public update(health: number) {
        this.currentHealth = health;
    }

    public getHealth() {
        return this.currentHealth;
    }

    public addDammage(dammage: number) {
        this.currentHealth -= dammage;
    }

    public isDead() {
        return this.currentHealth <= 0;
    }

    public reset() {
        this.currentHealth = this.maxHealth;
    }



    public draw(ctx: CanvasRenderingContext2D) {
        // draw health bar on top of road
        ctx.fillStyle = "black";
        ctx.fillRect(
            this.x - 1,
            this.y - 1,
            this.width + 3,
            this.height + 3
        );

        ctx.fillStyle = "green";
        ctx.fillRect(
            this.x,
            this.y,
            this.currentHealth,
            this.height
        );

        ctx.fillStyle = "pink";
        ctx.fillRect(
            this.x + this.currentHealth,
            this.y,
            this.maxHealth - this.currentHealth,
            this.height
        );

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(
            "Health",
            this.x,
            this.y + this.height + 20
        );

    }
}