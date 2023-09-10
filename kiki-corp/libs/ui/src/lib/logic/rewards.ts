import { Border } from "../types/border";
import { Rectangle } from "../types/rectangle";
import { Car } from "./car";
import { Road } from "./road";
import * as Utils from "../utils/geometry";

export class Rewards {

    private rewards: Rectangle[] = [];

    public setRewards(rewards: Rectangle[]) {
        this.rewards = rewards;
    }

    public getRewards() {
        return this.rewards;
    }

    public getRewardByBorders(borders: Border[]) {
        return this.rewards.find((reward: Rectangle) => {
            return reward.borders == borders;
        });
    }

    public getBorders() {
        return this.rewards.map((reward: any) => reward.borders);
    }

    public createRandomRewardsOnRoad(numberOfRewards: number, road: Road, car: Car, obstacles: Rectangle[]) {
        const rewards = [];
        for (let i = 0; i < numberOfRewards; i++) {
            let rectangle: Rectangle = this.createRandomReward(road);
            while (this.isOverlappingReward(rectangle, rewards) || this.isOverlappingCar(rectangle, car) || this.isOverlappingReward(rectangle, obstacles)) {
                console.log("overlapping");
                rectangle = this.createRandomReward(road);
            }

            rewards.push(rectangle);
        }
        return rewards;
    }

    private createRandomReward(road: Road) {
        const width = 20;
        const height = 20;
        const x = Math.random() * (road.width * 0.9) + road.marginLeft;
        const y = Math.random() * (road.height * 0.9) + road.marginTop;
        const reward = {
            x: x,
            y: y,
            width: width,
            height: height,
            borders: this.createRewardBorders(x, y, 20, 20)
        };
        return reward;
    }

    private createRewardBorders(x: number, y: number, width: number, height: number): Border[] {
        const topLeft = { x: x, y: y };
        const topRight = { x: x + width, y: y };
        const bottomLeft = { x: x, y: y + height };
        const bottomRight = { x: x + width, y: y + height };

        return [
            [topLeft, bottomLeft], // topleft to bottomleft
            [topRight, bottomRight], // topright to bottomright
            [topLeft, topRight], // topleft to topright
            [bottomLeft, bottomRight] // bottomleft to bottomright
        ];
    }

    public removeReward(reward: Rectangle) {
        console.log("remove reward:", reward);
        console.log("rewards before:", this.rewards);
        this.rewards = this.rewards.filter((r: Rectangle) => {
            return r != reward;
        });
        console.log("rewards after:", this.rewards);
    }

    public isOverlappingReward(rectangle: Rectangle, rewards: Rectangle[]) {
        return rewards.some((obstacle: Rectangle) => {
            return Utils.polysIntersect(Utils.bordersToPoints(rectangle.borders), Utils.bordersToPoints(obstacle.borders));
        });
    }

    private isOverlappingCar(rectangle: Rectangle, car: Car) {
        return Utils.polysIntersect(car.getPolygon(), Utils.bordersToPoints(rectangle.borders));
    }



    public draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.rewards.length; i++) {
            const element = this.rewards[i];
            ctx.fillStyle = "green";
            ctx.fillRect(
                element.x,
                element.y,
                element.width,
                element.height
            );

            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.fillText("R" + i, element.x + 5, element.y + 15);
        }
    }

}