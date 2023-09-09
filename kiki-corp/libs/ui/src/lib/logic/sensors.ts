import { Rectangle } from "../types/rectangle";
import * as Utils from "../utils/geometry";
import { Car } from "./car";

export class Sensors {
    private car: Car;
    private rayCount: number = 180;
    private rayLength: number = 500;
    private raySpread: number = Math.PI / 4;

    private rays: any = null;
    private readings: any = null;

    constructor(car: Car) {
        this.car = car;
    }

    public update(roadBorders: number[], obstacles: any) {
        this.castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.getReading(
                    this.rays[i],
                    roadBorders,
                    obstacles
                )
            );
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }

    private castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = Utils.lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.getAngle();

            const start = { x: this.car.getX(), y: this.car.getY() };
            const end = {
                x: this.car.getX() - Math.sin(rayAngle) * this.rayLength,
                y: this.car.getY() - Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    private getReading(ray: any, roadBorders: any, obstacleBorders: any) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = Utils.getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }
        }

        for (let i = 0; i < obstacleBorders.length; i++) {
            const obstacleBorder = obstacleBorders[i];

            for (let j = 0; j < obstacleBorder.length; j++) {
                const touch = Utils.getIntersection(
                    ray[0],
                    ray[1],
                    obstacleBorder[j][0],
                    obstacleBorder[j][1]
                );
                if (touch) {
                    touches.push(touch);
                }
            }
        }

        if (touches.length !== 0) {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
        return null;
    }


}