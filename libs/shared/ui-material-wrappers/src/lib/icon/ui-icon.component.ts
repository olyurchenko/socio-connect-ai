import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sc-ui-icon',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <mat-icon
      [fontSet]="fontSet()"
      [color]="color()"
      [class]="iconClass()"
      [aria-label]="ariaLabel()"
      [attr.aria-hidden]="!ariaLabel()"
    >
      {{ name() }}
    </mat-icon>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiIconComponent {
  readonly name = input.required<string>();
  readonly fontSet = input<string>('material-icons-round');
  readonly color = input<'primary' | 'accent' | 'warn' | undefined>(undefined);
  readonly iconClass = input<string>('');
  readonly ariaLabel = input<string>('');
}
