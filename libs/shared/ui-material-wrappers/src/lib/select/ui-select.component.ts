import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'sc-ui-select',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field [appearance]="appearance()" [class]="fieldClass()">
      @if (label()) {
        <mat-label>{{ label() }}</mat-label>
      }
      <mat-select
        [(ngModel)]="value"
        [multiple]="multiple()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (selectionChange)="selectionChanged.emit($event.value)"
      >
        @for (opt of options(); track opt.value) {
          <mat-option [value]="opt.value" [disabled]="opt.disabled ?? false">
            {{ opt.label }}
          </mat-option>
        }
      </mat-select>
      @if (hint()) {
        <mat-hint>{{ hint() }}</mat-hint>
      }
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectComponent<T = string> {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly options = input<SelectOption<T>[]>([]);
  readonly multiple = input(false);
  readonly disabled = input(false);
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly fieldClass = input<string>('');
  readonly value = model<T | T[] | null>(null);
  readonly selectionChanged = output<T | T[]>();
}
