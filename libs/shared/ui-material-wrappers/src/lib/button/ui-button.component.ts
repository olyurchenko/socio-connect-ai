import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type ButtonVariant = 'raised' | 'flat' | 'stroked' | 'basic' | 'icon' | 'fab';
export type ButtonColor = 'primary' | 'accent' | 'warn' | undefined;

@Component({
  selector: 'sc-ui-button',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  template: `
    @switch (variant()) {
      @case ('raised') {
        <button
          mat-raised-button
          [color]="color()"
          [disabled]="disabled() || loading()"
          [type]="type()"
          (click)="clicked.emit($event)"
        >
          @if (loading()) {
            <mat-spinner diameter="16" class="btn-spinner" />
          }
          <ng-content />
        </button>
      }
      @case ('flat') {
        <button
          mat-flat-button
          [color]="color()"
          [disabled]="disabled() || loading()"
          [type]="type()"
          (click)="clicked.emit($event)"
        >
          @if (loading()) {
            <mat-spinner diameter="16" class="btn-spinner" />
          }
          <ng-content />
        </button>
      }
      @case ('stroked') {
        <button
          mat-stroked-button
          [color]="color()"
          [disabled]="disabled() || loading()"
          [type]="type()"
          (click)="clicked.emit($event)"
        >
          @if (loading()) {
            <mat-spinner diameter="16" class="btn-spinner" />
          }
          <ng-content />
        </button>
      }
      @case ('icon') {
        <button
          mat-icon-button
          [color]="color()"
          [disabled]="disabled() || loading()"
          [type]="type()"
          (click)="clicked.emit($event)"
        >
          <ng-content />
        </button>
      }
      @default {
        <button
          mat-button
          [color]="color()"
          [disabled]="disabled() || loading()"
          [type]="type()"
          (click)="clicked.emit($event)"
        >
          @if (loading()) {
            <mat-spinner diameter="16" class="btn-spinner" />
          }
          <ng-content />
        </button>
      }
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      .btn-spinner {
        display: inline-block;
        margin-right: 6px;
        vertical-align: middle;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  readonly variant = input<ButtonVariant>('basic');
  readonly color = input<ButtonColor>('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly clicked = output<MouseEvent>();
}
