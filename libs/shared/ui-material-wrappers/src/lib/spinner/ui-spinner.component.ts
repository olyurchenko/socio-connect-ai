import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'sc-ui-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner-wrapper" [class.spinner-wrapper--overlay]="overlay()">
      <mat-progress-spinner
        [mode]="mode()"
        [color]="color()"
        [diameter]="diameter()"
        [value]="value()"
        [strokeWidth]="strokeWidth()"
      />
      @if (message()) {
        <span class="spinner-message">{{ message() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .spinner-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        &.spinner-wrapper--overlay {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          background: rgba(255, 255, 255, 0.7);
          z-index: 10;
        }
      }
      .spinner-message {
        font-size: 12px;
        color: #666;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSpinnerComponent {
  readonly mode = input<'determinate' | 'indeterminate'>('indeterminate');
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly diameter = input(40);
  readonly value = input(0);
  readonly strokeWidth = input(4);
  readonly overlay = input(false);
  readonly message = input<string>('');
}
