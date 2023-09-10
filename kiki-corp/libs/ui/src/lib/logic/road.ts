import { inject } from "@angular/core";
import { Rectangle } from "../types/rectangle";
import { Border } from "../types/border";
import { Obstacles } from "./obstacles";
import { Car } from "./car";
import { Rewards } from "./rewards";

export class Road {
    private window = inject(Window);

    public marginLeft = 100;
    public marginTop = 100;
    public marginRight = 100;
    public marginBottom = 100;

    public topLeft = { x: 0 + this.marginLeft, y: 0 + this.marginTop };
    public topRight = { x: this.window.innerWidth - this.marginRight, y: 0 + this.marginTop };
    public bottomLeft = { x: 0 + this.marginLeft, y: this.window.innerHeight - this.marginBottom };
    public bottomRight = { x: this.window.innerWidth - this.marginRight, y: this.window.innerHeight - this.marginBottom };

    private borders : Border[] = [
        [this.topLeft, this.bottomLeft], // topleft to bottomleft
        [this.topRight, this.bottomRight], // topright to bottomright
        [this.topLeft, this.topRight], // topleft to topright
        [this.bottomLeft, this.bottomRight] // bottomleft to bottomright
    ];

    private obstacles: Obstacles = new Obstacles();
    private rewards: Rewards = new Rewards();

    constructor(x?: number, y?: number, width?: number, height?: number) {
        if (x && y && width && height) {
            this.topLeft = { x: x, y: y };
            this.topRight = { x: x + width, y: y };
            this.bottomLeft = { x: x, y: y + height };
            this.bottomRight = { x: x + width, y: y + height };

            this.borders = [
                [this.topLeft, this.bottomLeft],
                [this.topRight, this.bottomRight],
                [this.topLeft, this.topRight],
                [this.bottomLeft, this.bottomRight]
            ];
        }
    }

    public getBorders() {
        return this.borders;
    }

    public getObstacleBorders() {
        return this.obstacles.getBorders();
    }

    public getRewardBorders() {
        return this.rewards.getBorders();
    }

    public createObstacles(numberOfObstacles: number = 10, car: Car, road: Road) {
        this.obstacles.setObstacles(this.obstacles.createRandomObstaclesOnRoad(numberOfObstacles, road, car));
    }

    public createRewards(numberOfRewards: number = 10, car: Car, road: Road) {
        this.rewards.setRewards(this.rewards.createRandomRewardsOnRoad(numberOfRewards, road, car, this.obstacles.getObstacles()));
    }

    public removeReward(rewardBorders: Border[]) {
        console.log("rewardBorders", rewardBorders);
        const reward = this.rewards.getRewardByBorders(rewardBorders)!;
        this.rewards.removeReward(reward);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.moveTo(
            this.borders[0][0].x,
            this.borders[0][0].y
        );
        ctx.lineTo(
            this.borders[0][1].x,
            this.borders[0][1].y
        );
        ctx.lineTo(
            this.borders[1][1].x,
            this.borders[1][1].y
        );
        ctx.lineTo(
            this.borders[1][0].x,
            this.borders[1][0].y
        );
        ctx.lineTo(
            this.borders[0][0].x,
            this.borders[0][0].y
        );
        ctx.stroke();

        // fill whole window with red
        ctx.fillStyle = "red";
        ctx.fillRect(
            0,
            0,
            this.window.innerWidth,
            this.window.innerHeight
        );

        ctx.fillStyle = "white";
        ctx.fillRect(
            this.topLeft.x,
            this.topLeft.y,
            this.topRight.x - this.topLeft.x,
            this.bottomLeft.y - this.topLeft.y
        );

        this.obstacles.draw(ctx);
        this.rewards.draw(ctx);
    }


}