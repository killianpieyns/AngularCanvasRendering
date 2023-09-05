import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonComponent, CanvasComponent],
  exports: [CanvasComponent],
})
export class UiModule { }
