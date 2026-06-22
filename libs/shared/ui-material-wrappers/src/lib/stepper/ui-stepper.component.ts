import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'sc-ui-stepper',
  standalone: true,
  imports: [MatStepperModule],
  template: `
    <mat-stepper
      #stepper
      [orientation]="orientation()"
      [selectedIndex]="selectedIndex()"
      [linear]="linear()"
      [animationDuration]="animationDuration()"
      (selectionChange)="selectedIndex.set($event.selectedIndex); stepChanged.emit($event.selectedIndex)"
    >
      <ng-content />
    </mat-stepper>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      mat-stepper {
        background: transparent;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStepperComponent {
  readonly orientation = input<StepperOrientation>('horizontal');
  readonly linear = input(false);
  readonly animationDuration = input('200ms');
  readonly selectedIndex = model(0);
  readonly stepChanged = output<number>();

  readonly stepper = viewChild<MatStepper>('stepper');

  next(): void {
    this.stepper()?.next();
  }

  previous(): void {
    this.stepper()?.previous();
  }

  reset(): void {
    this.stepper()?.reset();
  }

  goTo(index: number): void {
    const s = this.stepper();
    if (s) s.selectedIndex = index;
  }
}
