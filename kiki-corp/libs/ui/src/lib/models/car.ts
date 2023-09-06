import { inject } from "@angular/core";
import { Controls } from "./controls";
import { Sensors } from "./sensors";

export class Car {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private speed: number = 0;
    private acceleration: number = 1000;
    private maxSpeed: number = 300;
    private maxReverseSpeed: number = -100;
    private angle: number = 0;
    private turnSpeed: number = 5;
    private friction: number = 5;
    private controls: Controls = new Controls();
    private sensor: Sensors = new Sensors(this);

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getAngle() {
        return this.angle;
    }


    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
    }

    public update(dt: number, borders: any) {
        this.updateSpeed(dt);
        this.updateAngle(dt);
        this.updatePosition(dt);
        this.sensor.update(borders);
    }

    private updateSpeed(dt: number) {
        if (this.controls.forward) {
            this.speed += this.acceleration * dt;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration * dt;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < this.maxReverseSpeed) {
            this.speed = this.maxReverseSpeed;
        }

        if (this.speed > 0) {
            this.speed -= (this.friction * 5) * dt;
        }

        if (this.speed < 0) {
            this.speed += (this.friction * 5) * dt;
        }

        if (Math.abs(this.speed) < (this.friction * 5 * dt)) {
            this.speed = 0;
        }
    }

    private updateAngle(dt: number) {
        const flip = this.speed < 0 ? -1 : 1;
        if (this.speed != 0) {
            if (this.controls.left) {
                this.angle += this.turnSpeed * flip * dt;
            }
            if (this.controls.right) {
                this.angle -= this.turnSpeed * flip * dt;
            }
        }
    }

    private updatePosition(dt: number) {
        this.x -= (this.speed * Math.sin(this.angle)) * dt;
        this.y -= (this.speed * Math.cos(this.angle)) * dt;
        console.info(this.x, this.y);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.fillStyle = 'red';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
        this.sensor.draw(ctx);
    }

}