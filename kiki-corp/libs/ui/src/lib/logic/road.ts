import { inject } from "@angular/core";
import { Rectangle } from "../types/rectangle";
import { Border } from "../types/border";
import { Obstacles } from "./obstacles";
import { Car } from "./car";
import { Rewards } from "./rewards";

export class Road {
    public marginLeft = 100;
    public marginTop = 100;
    public marginRight = 100;
    public marginBottom = 100;

    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    private borders: Border[] = [];
    private windowWidth: number = 0;
    private windowHeight: number = 0;

    private obstacles: Obstacles = new Obstacles();
    private rewards: Rewards = new Rewards();

    constructor(x: number, y: number, width: number, height: number, windowWidth: number, windowHeight: number) {
        this.x = x + this.marginLeft;
        this.y = y + this.marginTop;
        this.width = width - this.marginLeft - this.marginRight;
        this.height = height - this.marginTop - this.marginBottom;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        const topLeft = {
            x: this.x,
            y: this.y
        };
        const topRight = {
            x: this.x + this.width,
            y: this.y
        };
        const bottomLeft = {
            x: this.x,
            y: this.y + this.height
        };
        const bottomRight = {
            x: this.x + this.width,
            y: this.y + this.height
        };

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
            [topLeft, topRight],
            [bottomLeft, bottomRight]
        ];
    }

    initRoad(car: Car) {
        this.createObstacles(10, car, this);
        this.createRewards(10, car, this);
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
            this.windowWidth,
            this.windowHeight
        );

        ctx.fillStyle = "white";
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.obstacles.draw(ctx);
        this.rewards.draw(ctx);
    }


}