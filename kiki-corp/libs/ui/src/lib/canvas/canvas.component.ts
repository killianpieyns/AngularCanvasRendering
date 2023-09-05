import { Component, ElementRef, HostListener, Input, NgZone, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  providers: [
    {
      provide: Window,
      useValue: window
    }
  ]
})
export class CanvasComponent {
  private window = inject(Window);
  @Input() width: number = 100;
  @Input() height: number = 100;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;
  private ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  private rectX = 0;
  private rectY = 0;
  private rectWidth = 100;
  private rectHeight = 100;
  private mouseDown = false;

  ngAfterViewInit() {
    console.log(this.canvas.nativeElement);
    this.canvas.nativeElement.style.width = "100%";
    this.canvas.nativeElement.style.height = "100%";
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.draw();
  }

  updateXAndY(x: number, y: number) {
    this.rectX = x;
    this.rectY = y;
  }

  draw(ctx: CanvasRenderingContext2D = this.ctx) {
    this.canvas.nativeElement.height = window.innerHeight;

    ctx.save();
    ctx.translate(this.rectX, this.rectY);

    ctx.beginPath();
    ctx.rect(
      -this.rectWidth / 2,
      -this.rectHeight / 2,
      this.rectWidth,
      this.rectHeight
    );
    ctx.fill();

    ctx.restore();
    this.window.requestAnimationFrame(() => this.draw());
  }

  @HostListener('window:resize')
  onResize() {
    this.height = Math.floor(window.innerHeight);
    this.width = Math.floor(window.innerWidth);
    this.canvas.nativeElement.height = this.height;
    this.canvas.nativeElement.width = this.width;
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {

    //set mousedown to true if clicked inside rectangle
    if (
      event.clientX > this.rectX - this.rectWidth / 2 &&
      event.clientX < this.rectX + this.rectWidth / 2 &&
      event.clientY > this.rectY - this.rectHeight / 2 &&
      event.clientY < this.rectY + this.rectHeight / 2
    ) {
      this.mouseDown = true;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      this.updateXAndY(event.clientX, event.clientY);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    this.updateXAndY(event.touches[0].clientX, event.touches[0].clientY);
  }
}
