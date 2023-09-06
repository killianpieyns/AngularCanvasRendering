import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { CanvasComponent } from './components/canvas/canvas.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonComponent, CanvasComponent],
  exports: [CanvasComponent],
})
export class UiModule { }
