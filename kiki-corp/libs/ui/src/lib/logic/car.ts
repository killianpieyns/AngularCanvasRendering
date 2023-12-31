import { Border } from "../types/border";
import { RayReading } from "../types/rayReading";
import { Rectangle } from "../types/rectangle";
import * as Utils from "../utils/geometry";
import { Controls } from "./controls";
import { HealthBar } from "./healthbar";
import { NeuralNetwork } from "./network";
import { Sensors } from "./sensors";

export class Car {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private speed: number = 0;
    private acceleration: number = 100;
    private maxSpeed: number = 100;
    private maxReverseSpeed: number = -100;
    private angle: number = 0;
    private turnSpeed: number = 5;
    private friction: number = 5;
    private damaged: boolean = false;
    private healthBar: HealthBar = new HealthBar(100);
    private score: number = 0;

    private controls: Controls;
    private sensor: Sensors | null = null;
    private brain: NeuralNetwork | null = null;

    private damageHit: number = 100;
    private rewardBordersHit: Border[] | null = null;
    private useBrain: boolean = false;

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

    getRewardBordersHit() {
        return this.rewardBordersHit;
    }

    hitReward() {
        return this.rewardBordersHit != null;
    }

    constructor(x: number, y: number, width: number, height: number, controlType: "KEY" | "AI" = "AI") {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
        this.polygon = this.createPolygon();

        if (controlType == "AI") {
            this.sensor = new Sensors(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 20, 6, 4]);
            this.useBrain = true;
        }
        this.controls = new Controls(controlType);
    }

    public update(dt: number, borders: Border[], obstacleBorders: Border[][], rewardBorders: Border[][]) {
        if (!this.damaged) {
            this.move(dt);
            this.polygon = this.createPolygon();
            this.assessDamage(borders, obstacleBorders, dt);
            this.rewardBordersHit = this.assessReward(rewardBorders);
        }
        if (this.sensor) {
            this.sensor.update(borders, obstacleBorders);
            const offsets = this.sensor.readings.map((s: RayReading) => s == null ? 0 : 1 - s.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain!);
            console.log(outputs);

            if (this.useBrain) {
                this.controls.forward = !!outputs[0];
                this.controls.left = !!outputs[1];
                this.controls.right = !!outputs[2];
                this.controls.reverse = !!outputs[3];
            }
        }
    }

    assessDamage(roadBorders: Border[], obstacleBorders: Border[][], dt: number) {
        const damage = [];
        damage.push(this.borderCollision(roadBorders));
        damage.push(this.assessDamageWithObstacles(obstacleBorders));
        if (damage.some((d: any) => d)) {
            this.healthBar.addDammage(this.damageHit * dt);
        }
        this.damaged = this.healthBar.isDead();
    }

    borderCollision(borders: Border[]) {
        for (let i = 0; i < borders.length; i++) {
            if (Utils.polysIntersect(this.polygon, borders[i])) {
                return true;
            }
        }
        return false;
    }

    assessDamageWithObstacles(obstaclesBorders: Border[][]) {
        const damage = [];
        for (let i = 0; i < obstaclesBorders.length; i++) {
            damage.push(this.borderCollision(obstaclesBorders[i]));
        }
        return damage.some((d: any) => d);
    }

    assessReward(rewardsBorders: Border[][]) {
        for (let i = 0; i < rewardsBorders.length; i++) {
            if (this.borderCollision(rewardsBorders[i])) {
                this.score++;
                // remove reward
                return rewardsBorders[i];
            }
        }
        return null;
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

        if (this.sensor) {
            this.sensor.draw(ctx);
        }

        this.healthBar.draw(ctx);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Score: " + this.score, 500, 50);
    }

}