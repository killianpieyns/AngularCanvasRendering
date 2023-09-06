import { inject } from "@angular/core";
import { Controls } from "./controls";

export class Car {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private speed: number = 0;
    private acceleration: number = 100;
    private maxSpeed: number = 300;
    private maxReverseSpeed: number = -100;
    private angle: number = 1;
    private turnSpeed: number = 1;
    private friction: number = 5;
    private controls: Controls = new Controls();


    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
    }

    public update(dt: number) {
        console.log("speed:", this.speed)
        this.updateSpeed(dt);
        this.updateAngle(dt);
        this.updatePosition(dt);
    }

    private updateSpeed(dt: number) {
        if (this.controls.forward) {
            if (this.speed < this.maxSpeed) {
                this.speed += this.acceleration * dt;
            }
        }
        if (this.controls.reverse) {
            if (this.speed > this.maxReverseSpeed) {
                this.speed -= this.acceleration * dt;
            }
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
                this.angle -= this.turnSpeed * flip * dt;
            } else if (this.controls.right) {
                this.angle += this.turnSpeed * flip * dt;
            }
        }
    }

    private updatePosition(dt: number) {
        this.x += this.speed * Math.cos(this.angle) * dt;
        this.y += this.speed * Math.sin(this.angle) * dt;
        console.info(this.x, this.y);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'red';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

}