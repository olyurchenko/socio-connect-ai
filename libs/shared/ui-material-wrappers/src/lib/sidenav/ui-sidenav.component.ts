import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';

export type SidenavMode = 'over' | 'push' | 'side';
export type SidenavPosition = 'start' | 'end';

@Component({
  selector: 'sc-ui-sidenav',
  standalone: true,
  imports: [MatSidenavModule],
  template: `
    <mat-sidenav-container class="sidenav-container" [hasBackdrop]="hasBackdrop()">
      <mat-sidenav
        #sidenav
        [mode]="mode()"
        [opened]="opened()"
        [position]="position()"
        [fixedInViewport]="fixedInViewport()"
        [disableClose]="disableClose()"
        (openedChange)="opened.set($event); openedChange.emit($event)"
        (closedStart)="closedStart.emit()"
      >
        <ng-content select="[sidenavContent]" />
      </mat-sidenav>

      <mat-sidenav-content>
        <ng-content select="[mainContent]" />
        <ng-content />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .sidenav-container {
        flex: 1;
        height: 100%;
      }
      mat-sidenav {
        width: var(--sc-sidenav-width, var(--sc-nav-width));
        border-right: 1px solid var(--sc-color-outline);
        background: var(--sc-color-surface);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavComponent {
  readonly mode = input<SidenavMode>('over');
  readonly opened = model(false);
  readonly position = input<SidenavPosition>('start');
  readonly hasBackdrop = input(true);
  readonly fixedInViewport = input(false);
  readonly disableClose = input(false);
  readonly openedChange = output<boolean>();
  readonly closedStart = output<void>();

  readonly sidenav = viewChild<MatSidenav>('sidenav');

  open(): void {
    this.sidenav()?.open();
  }

  close(): void {
    this.sidenav()?.close();
  }

  toggle(): void {
    this.sidenav()?.toggle();
  }
}
