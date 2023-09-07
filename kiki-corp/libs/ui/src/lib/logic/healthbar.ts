export class HealthBar {
    private health: number = 100;

    constructor(health: number) {
        this.health = health;
    }

    public update(health: number) {
        this.health = health;
    }

    public getHealth() {
        return this.health;
    }

    public addDammage(dammage: number) {
        this.health -= dammage;
    }

    public isDead() {
        return this.health <= 0;
    }

    public reset() {
        this.health = 100;
    }



    public draw(ctx: CanvasRenderingContext2D) {
        // draw health bar on top of road
        ctx.fillStyle = "green";
        ctx.fillRect(
            0,
            0,
            this.health,
            10
        );

        ctx.fillStyle = "red";
        ctx.fillRect(
            this.health,
            0,
            100 - this.health,
            10
        );

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(
            "Health",
            10,
            20
        );

    }
}