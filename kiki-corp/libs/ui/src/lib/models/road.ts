import { inject } from "@angular/core";

export class Road {
    private window = inject(Window);
    private windowWidthCenter = this.window.innerWidth / 2;
    private windowHeightCenter = this.window.innerHeight / 2;
    private marginLeft = 100;
    private marginTop = 100;
    private marginRight = 100;
    private marginBottom = 100;

    private topLeft = { x: 0 + this.marginLeft, y: 0 + this.marginTop };
    private topRight = { x: this.window.innerWidth - this.marginRight, y: 0 + this.marginTop };
    private bottomLeft = { x: 0 + this.marginLeft, y: this.window.innerHeight - this.marginBottom };
    private bottomRight = { x: this.window.innerWidth - this.marginRight, y: this.window.innerHeight - this.marginBottom };

    private borders = [
        [this.topLeft, this.bottomLeft],
        [this.topRight, this.bottomRight],
        [this.topLeft, this.topRight],
        [this.bottomLeft, this.bottomRight]
    ];

    constructor(x?: number, y?: number, width?: number, height?: number) {
        if (!x || !y || !width || !height) {
            return;
        }

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

    public getBorders() {
        return this.borders;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.moveTo(
            this.topLeft.x,
            this.topLeft.y
        );
        ctx.lineTo(
            this.topRight.x,
            this.topRight.y
        );
        ctx.lineTo(
            this.bottomRight.x,
            this.bottomRight.y
        );
        ctx.lineTo(
            this.bottomLeft.x,
            this.bottomLeft.y
        );
        ctx.lineTo(
            this.topLeft.x,
            this.topLeft.y
        );
        ctx.stroke();
    }


}