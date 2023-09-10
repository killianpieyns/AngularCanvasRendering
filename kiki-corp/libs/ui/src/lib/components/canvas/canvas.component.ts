import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { Car } from '../../logic/car';
import { Road } from '../../logic/road';

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
  private ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  @Input() width: number = 100;
  @Input() height: number = 100;
  @Output() carCrashed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;


  @Input() car: Car = new Car(this.window.innerWidth / 2, this.window.innerHeight / 2, 50, 100);
  @Input() crashReported: boolean = false;
  @Input() road: Road = new Road(0, 0, this.window.innerWidth, this.window.innerHeight, this.window.innerWidth, this.window.innerHeight);

  private updates: number = 0;

  ngAfterViewInit() {
    console.log(this.canvas.nativeElement);
    this.canvas.nativeElement.style.width = "100%";
    this.canvas.nativeElement.style.height = "100%";
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.initRoad();
    this.draw(this.ctx, new Date().getTime());
    // setInterval(() => {
    //   console.log(this.updates);
    //   this.updates = 0;
    // }, 1000);
  }

  initRoad() {
    this.road.initRoad(this.car);
  }

  draw(ctx: CanvasRenderingContext2D = this.ctx, previousTime: number) {
    const now = new Date().getTime();
    const dt = (now - previousTime) / 1000;
    this.updates++;
    this.car.update(dt, this.road.getBorders(), this.road.getObstacleBorders(), this.road.getRewardBorders());
    this.canvas.nativeElement.height = window.innerHeight;

    this.carCrashIf(this.car.isDamaged());
    if (this.car.hitReward()) {
      const rewardBordersHit = this.car.getRewardBordersHit();
      this.road.removeReward(rewardBordersHit!);
    }

    ctx.save();
    this.road.draw(ctx);
    this.car.draw(ctx);
    ctx.restore();


    this.window.requestAnimationFrame(() => this.draw(ctx, now));
  }

  private carCrashIf(crashed: boolean) {
    if (!this.crashReported && crashed) {
      this.carCrashed.emit(crashed);
      this.crashReported = true;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.height = Math.floor(window.innerHeight);
    this.width = Math.floor(window.innerWidth);
    this.canvas.nativeElement.height = this.height;
    this.canvas.nativeElement.width = this.width;
    this.road.draw(this.ctx);
    this.car.draw(this.ctx);
  }

  ngOnChanges(change: SimpleChanges) {
    console.log(change);
    if (change["car"]) {
      this.car = change["car"].currentValue;
    }
    if (change["crashReported"]) {
      this.crashReported = change["crashReported"].currentValue;
    }
    if (change["road"]) {
      this.road = change["road"].currentValue;
    }

  }

}
