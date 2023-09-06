import { Component, ElementRef, HostListener, Input, NgZone, ViewChild, inject } from '@angular/core';
import { Car } from '../../models/car';
import { Road } from '../../models/road';

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

  private car: Car = new Car(this.window.innerWidth / 2, this.window.innerHeight / 2, 50, 100);
  private road: Road = new Road();

  private updates: number = 0;

  ngAfterViewInit() {
    console.log(this.canvas.nativeElement);
    this.canvas.nativeElement.style.width = "100%";
    this.canvas.nativeElement.style.height = "100%";
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.draw(this.ctx, new Date().getTime());
    setInterval(() => {
      console.log(this.updates);
      this.updates = 0;
    }, 1000);
  }

  draw(ctx: CanvasRenderingContext2D = this.ctx, previousTime: number) {
    const now = new Date().getTime();
    const dt = (now - previousTime) / 1000;
    this.updates++;
    this.car.update(dt, this.road.getBorders());
    this.canvas.nativeElement.height = window.innerHeight;
    ctx.save();
    this.car.draw(ctx);
    this.road.draw(ctx);
    ctx.restore();
    this.window.requestAnimationFrame(() => this.draw(ctx, now));
  }

  @HostListener('window:resize')
  onResize() {
    this.height = Math.floor(window.innerHeight);
    this.width = Math.floor(window.innerWidth);
    this.canvas.nativeElement.height = this.height;
    this.canvas.nativeElement.width = this.width;
  }
}
