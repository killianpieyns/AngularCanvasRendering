import { Rectangle } from "../types/rectangle";
import { Border } from "../types/border";
import { Road } from "./road";
import * as Utils from "../utils/geometry";
import { Car } from "./car";

export class Obstacles {
    private obstacles: Rectangle[] = [];

    public setObstacles(obstacles: Rectangle[]) {
        this.obstacles = obstacles;
    }

    public addObstacles(obstacles: Rectangle[]) {
        this.obstacles = this.obstacles.concat(obstacles);
    }

    public getObstacles() {
        return this.obstacles;
    }

    public getBorders() {
        return this.obstacles.map((obstacle: any) => obstacle.borders);
    }

    public createRandomObstaclesOnRoad(numberOfObstacles: number = 10, road: Road, car: Car): Rectangle[] {
        const obstacles: Rectangle[] = [];
        
        for (let i = 0; i < numberOfObstacles; i++) {
            let rectangle: Rectangle = this.createObstacle(road);
            while (this.isOverlappingObstacles(rectangle, obstacles) || this.isOverlappingCar(rectangle, car)) {
                console.log("overlapping");
                rectangle = this.createObstacle(road);
            }

            obstacles.push(rectangle);
        }
        console.log(obstacles);
        return obstacles;
    }

    private createObstacle(road: Road): any {
        const minWidth = 5;
        const minHeight = 5;
        const roadWidth = road.topRight.x - road.topLeft.x;
        const roadHeight = road.bottomLeft.y - road.topLeft.y;
        const x = Math.random() * roadWidth + road.marginLeft;
        const y = Math.random() * roadHeight + road.marginTop;
        const width = Math.min(Math.random() * 100 + minWidth, road.topRight.x - x);
        const height = Math.min(Math.random() * 100 + minHeight, road.bottomLeft.y - y);
        const borders = this.createObstacleBorders(x, y, width, height);
        const rectangle: Rectangle = {
            x: x,
            y: y,
            width: width,
            height: height,
            borders: borders
        };

        return rectangle;
    }

    private isOverlappingObstacles(rectangle: Rectangle, obstacles: Rectangle[]) {
        return obstacles.some((obstacle: Rectangle) => {
            return Utils.polysIntersect(Utils.bordersToPoints(rectangle.borders), Utils.bordersToPoints(obstacle.borders));
        });
    }

    private isOverlappingCar(rectangle: Rectangle, car: Car) {
        return Utils.polysIntersect(Utils.bordersToPoints(rectangle.borders), car.getPolygon());
    }

    private createObstacleBorders(x: number, y: number, width: number, height: number): Border[] {
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

    public draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.obstacles.length; i++) {
            ctx.fillStyle = "gray";
            const element = this.obstacles[i];
            ctx.fillRect(
                element.x,
                element.y,
                element.width,
                element.height
            );
            ctx.fillStyle = "white";
            ctx.fillText(
                i.toString(),
                element.x + element.width / 2,
                element.y + element.height / 2
            );
            ctx.fillStyle = "black";
            ctx.beginPath();
            const lineWidth = 2;
            ctx.lineWidth = lineWidth;

            const points = Utils.bordersToPoints(element.borders);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length + 1; i++) {
                ctx.lineTo(points[i % points.length].x, points[i % points.length].y);
            }
            ctx.stroke();

        }
    }
}