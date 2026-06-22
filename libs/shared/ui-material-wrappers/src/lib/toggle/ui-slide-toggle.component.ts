import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'sc-ui-slide-toggle',
  standalone: true,
  imports: [FormsModule, MatSlideToggleModule],
  template: `
    <mat-slide-toggle
      [(ngModel)]="checked"
      [color]="color()"
      [disabled]="disabled()"
      [labelPosition]="labelPosition()"
      (change)="toggled.emit($event.checked)"
    >
      {{ label() }}
    </mat-slide-toggle>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSlideToggleComponent {
  readonly label = input<string>('');
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly disabled = input(false);
  readonly labelPosition = input<'before' | 'after'>('after');
  readonly checked = model(false);
  readonly toggled = output<boolean>();
}
