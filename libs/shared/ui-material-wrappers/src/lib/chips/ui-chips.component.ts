import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface ChipItem {
  value: string;
  label: string;
  color?: string;
  removable?: boolean;
}

@Component({
  selector: 'sc-ui-chips',
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
  template: `
    <mat-chip-set [aria-label]="ariaLabel()">
      @for (chip of chips(); track chip.value) {
        <mat-chip
          [highlighted]="selectedValues().includes(chip.value)"
          [removable]="chip.removable ?? removable()"
          [style.--mdc-chip-label-text-color]="chip.color"
          [style.--mat-mdc-chip-highlighted ]="chip.color"
          [style.border-color]="chip.color"
          (click)="onChipClick(chip.value)"
          (removed)="chipRemoved.emit(chip.value)"
        >
          {{ chip.label }}
          @if (chip.removable ?? removable()) {
            <mat-icon matChipRemove>cancel</mat-icon>
          }
        </mat-chip>
      }
    </mat-chip-set>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .mat-mdc-chip-highlighted {
        background-color: color-mix(in srgb, var(--mdc-chip-label-text-color, currentColor) 40%, transparent) !important;      
      }
      mat-chip {
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s ease;
        &.mdc-evolution-chip--highlighted {
          border-color: currentColor;
        }
        &.mat-mdc-standard-chip {
          background-color: transparent;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiChipsComponent {
  readonly chips = input<ChipItem[]>([]);
  readonly removable = input(false);
  readonly ariaLabel = input('');
  readonly selectedValues = model<string[]>([]);
  readonly chipRemoved = output<string>();
  readonly chipSelected = output<string>();

  onChipClick(value: string): void {
    const current = this.selectedValues();
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    this.selectedValues.set(updated);
    this.chipSelected.emit(value);
  }
}
