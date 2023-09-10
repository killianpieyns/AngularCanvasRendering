import { Component, inject } from '@angular/core';
import { Car } from 'libs/ui/src/lib/logic/car';
import { Road } from 'libs/ui/src/lib/logic/road';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: Window,
      useValue: window
    }
  ]
})
export class AppComponent {
  title = 'angular-canvas-rendering';

  private window = inject(Window);
  showReset: boolean = false;
  car: Car = new Car(this.window.innerWidth / 2, this.window.innerHeight / 2, 50, 100);
  road: Road = new Road(0, 0, this.window.innerWidth, this.window.innerHeight, this.window.innerWidth, this.window.innerHeight);
  crashReported: boolean = false;

  onCarCrash(crashed: boolean) {
    console.log(crashed);
    this.crashReported = crashed;
    this.showReset = crashed;
  }

  resetGame() {
    this.showReset = false;
    this.crashReported = false;
    this.car = new Car(this.window.innerWidth / 2, this.window.innerHeight / 2, 50, 100);
    this.road = new Road(0, 0, this.window.innerWidth, this.window.innerHeight, this.window.innerWidth, this.window.innerHeight);
    this.road.initRoad(this.car);
  }
}
