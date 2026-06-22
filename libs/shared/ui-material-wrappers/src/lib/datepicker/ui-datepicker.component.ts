import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'sc-ui-datepicker',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <mat-form-field [appearance]="appearance()">
      @if (label()) {
        <mat-label>{{ label() }}</mat-label>
      }
      <input
        matInput
        [matDatepicker]="picker"
        [(ngModel)]="value"
        [min]="minDate()"
        [max]="maxDate()"
        [disabled]="disabled()"
        [placeholder]="placeholder()"
        (dateChange)="dateChanged.emit($event.value)"
        readonly
      />
      <mat-datepicker-toggle matIconSuffix [for]="picker" />
      <mat-datepicker #picker [startView]="startView()" />
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
export class UiDatepickerComponent {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input(false);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly startView = input<'month' | 'year' | 'multi-year'>('month');
  readonly value = model<Date | null>(null);
  readonly dateChanged = output<Date | null>();
}
