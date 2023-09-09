import { Rectangle } from "../types/rectangle";
import * as Utils from "../utils/geometry";
import { Controls } from "./controls";
import { HealthBar } from "./healthbar";
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
    private damaged: boolean = false;
    private healthBar: HealthBar = new HealthBar(100);

    private damageHit: number = 100;

    private polygon: any = null;

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getAngle() {
        return this.angle;
    }

    isDamaged() {
        return this.damaged;
    }

    getPolygon() {
        return this.polygon;
    }


    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
        this.polygon = this.createPolygon();
    }

    public update(dt: number, borders: any, obstacleBorders: any) {
        if (!this.damaged) {
            const damage = [];
            this.move(dt);
            this.polygon = this.createPolygon();
            damage.push(this.assessDamage(borders));
            for (let i = 0; i < obstacleBorders.length; i++) {
                damage.push(this.assessDamage(obstacleBorders[i]));
            }
            if (damage.some((d: any) => d)) {
                this.healthBar.addDammage(this.damageHit * dt);
            }
            this.damaged = this.healthBar.isDead();
        }
        this.sensor.update(borders, obstacleBorders);
    }

    assessDamage(borders: any) {
        for (let i = 0; i < borders.length; i++) {
            if (Utils.polysIntersect(this.polygon, borders[i])) {
                return true;
            }
        }
        return false;
    }

    private move(dt: number) {
        this.updateSpeed(dt);
        this.updateAngle(dt);
        this.updatePosition(dt);
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
        // console.info(this.x, this.y);
    }

    private createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        this.sensor.draw(ctx);
        this.healthBar.draw(ctx);
    }

}