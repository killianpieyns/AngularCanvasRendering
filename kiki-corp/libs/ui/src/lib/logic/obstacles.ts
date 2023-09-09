import { Rectangle } from "../types/rectangle";
import { Border } from "../types/border";
import { Road } from "./road";
import * as Utils from "../utils/geometry";
import { Car } from "./car";

export class Obstacles{
    private obstacles: Rectangle[] = [];

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
        const roadWidth = road.topRight.x - road.topLeft.x;
        const roadHeight = road.bottomLeft.y - road.topLeft.y;
        const minWidth = 5;
        const minHeight = 5;
        for (let i = 0; i < numberOfObstacles; i++) {
            let rectangle: Rectangle = this.createObstacle(roadWidth, road, roadHeight, minWidth, minHeight);
            while (this.isOverlappingObstacles(rectangle, obstacles) || this.isOverlappingCar(rectangle, car)) {
                console.log("overlapping");
                rectangle = this.createObstacle(roadWidth, road, roadHeight, minWidth, minHeight);
            }

            obstacles.push(rectangle);
        }
        console.log(obstacles);
        return obstacles;
    }

    private createObstacle(roadWidth: number, road: Road, roadHeight: number, minWidth: number, minHeight: number): any {
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
        let overlappings = []
        for (let i = 0; i < obstacles.length; i++) {
            const overlapping = Utils.polysIntersect(this.bordersToPoints(rectangle.borders), this.bordersToPoints(obstacles[i].borders));
            overlappings.push(overlapping);
        }
        console.log(overlappings);
        return overlappings.some((overlapping: boolean) => overlapping);
    }

    private isOverlappingCar(rectangle: Rectangle, car: Car) {
        return Utils.polysIntersect(this.bordersToPoints(rectangle.borders), car.getPolygon());
    }

    private bordersToPoints(borders: Border[]): any[] {
        const points: any[] = [];
        for (let i = 0; i < borders.length; i++) {
            points.push(borders[0][0]); // topleft
            points.push(borders[0][1]); // bottomleft
            points.push(borders[1][1]); // bottomright
            points.push(borders[1][0]); // topright
        }
        return points;
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

            const points = this.bordersToPoints(element.borders);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

        }
    }
}