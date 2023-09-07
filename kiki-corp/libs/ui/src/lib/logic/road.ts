import { inject } from "@angular/core";
import { Rectangle } from "../interfaces/rectangle";

export class Road {
    private window = inject(Window);

    private marginLeft = 100;
    private marginTop = 100;
    private marginRight = 100;
    private marginBottom = 100;

    private topLeft = { x: 0 + this.marginLeft, y: 0 + this.marginTop };
    private topRight = { x: this.window.innerWidth - this.marginRight, y: 0 + this.marginTop };
    private bottomLeft = { x: 0 + this.marginLeft, y: this.window.innerHeight - this.marginBottom };
    private bottomRight = { x: this.window.innerWidth - this.marginRight, y: this.window.innerHeight - this.marginBottom };

    private borders = [
        [this.topLeft, this.bottomLeft], // topleft to bottomleft
        [this.topRight, this.bottomRight], // topright to bottomright
        [this.topLeft, this.topRight], // topleft to topright
        [this.bottomLeft, this.bottomRight] // bottomleft to bottomright
    ];

    private obstacles: any = [];

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

        this.obstacles = this.createRandomObstaclesOnRoad(10);
    }

    public getBorders() {
        return this.borders;
    }

    public getObstacleBorders() {
        return this.obstacles.map((obstacle: any) => obstacle.borders);
    }

    private createRandomObstaclesOnRoad(numberOfObstacles: number = 10): any {
        const obstacles = [];
        const roadWidth = this.topRight.x - this.topLeft.x;
        const roadHeight = this.bottomLeft.y - this.topLeft.y;
        const minWidth = 5;
        const minHeight = 5;
        for (let i = 0; i < numberOfObstacles; i++) {
            const x = Math.random() * roadWidth + this.marginLeft;
            const y = Math.random() * roadHeight + this.marginTop; 3
            const width = Math.min(Math.random() * 100 + minWidth, this.topRight.x - x);
            const height = Math.min(Math.random() * 100 + minHeight, this.bottomLeft.y - y);
            const borders = this.createObstacleBorders(x, y, width, height);
            const rect: Rectangle = {
                x: x,
                y: y,
                width: width,
                height: height,
                borders: borders
            }
            obstacles.push(rect);
        }
        return obstacles;
    }

    private createObstacleBorders(x: number, y: number, width: number, height: number) {
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

        for (let i = 0; i < this.obstacles.length; i++) {
            ctx.fillStyle = "gray";
            const element = this.obstacles[i];
            ctx.fillRect(
                element.x,
                element.y,
                element.width,
                element.height
            );
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.lineWidth = 2;

            ctx.moveTo(
                element.borders[0][0].x,
                element.borders[0][0].y
            );
            ctx.lineTo(
                element.borders[0][1].x,
                element.borders[0][1].y
            );
            ctx.lineTo(
                element.borders[1][1].x,
                element.borders[1][1].y
            );
            ctx.lineTo(
                element.borders[1][0].x,
                element.borders[1][0].y
            );
            ctx.lineTo(
                element.borders[0][0].x,
                element.borders[0][0].y
            );
            ctx.stroke();

        }

    }


}