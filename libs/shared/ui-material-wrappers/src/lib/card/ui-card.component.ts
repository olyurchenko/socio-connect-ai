import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'sc-ui-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card [appearance]="appearance()" [class]="cardClass()">
      @if (title() || subtitle()) {
        <mat-card-header>
          @if (title()) {
            <mat-card-title>{{ title() }}</mat-card-title>
          }
          @if (subtitle()) {
            <mat-card-subtitle>{{ subtitle() }}</mat-card-subtitle>
          }
          <ng-content select="[cardHeaderActions]" />
        </mat-card-header>
      }
      <mat-card-content>
        <ng-content />
      </mat-card-content>
      <ng-content select="mat-card-actions" />
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      mat-card {
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly appearance = input<'outlined' | 'raised'>('raised');
  readonly cardClass = input<string>('');
}
