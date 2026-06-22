import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field [appearance]="appearance()" [class]="fieldClass()" [class.has-clear]="clearable() && value() != null">
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
      @if (clearable() && value() != null) {
        <button
          matSuffix
          type="button"
          class="clear-btn"
          aria-label="Clear"
          (click)="$event.stopPropagation(); onClear()"
        >
          &#x2715;
        </button>
      }
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
      .clear-btn {
        background: none;
        border: none;
        padding: 0 2px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.54);
        font-size: 14px;
        line-height: 1;
        display: flex;
        align-items: center;
      }
      .clear-btn:hover {
        color: rgba(0, 0, 0, 0.87);
      }
      :host ::ng-deep .has-clear .mat-mdc-select-arrow-wrapper {
        display: none;
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
  readonly clearable = input(false);
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly fieldClass = input<string>('');
  readonly value = model<T | T[] | null>(null);
  readonly selectionChanged = output<T | T[] | null>();

  onClear(): void {
    this.value.set(null);
    this.selectionChanged.emit(null);
  }
}
