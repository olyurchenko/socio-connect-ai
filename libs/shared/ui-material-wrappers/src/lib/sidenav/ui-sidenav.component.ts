import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { MatSidenavModule, MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';

export type SidenavMode = 'over' | 'push' | 'side';
export type SidenavPosition = 'start' | 'end';

@Component({
  selector: 'sc-ui-sidenav',
  standalone: true,
  imports: [MatSidenavModule],
  template: `
    <mat-sidenav-container #container class="sidenav-container" [hasBackdrop]="hasBackdrop()">
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
export class UiSidenavComponent implements OnDestroy {
  readonly mode = input<SidenavMode>('over');
  readonly opened = model(false);
  readonly position = input<SidenavPosition>('start');
  readonly hasBackdrop = input(true);
  readonly fixedInViewport = input(false);
  readonly disableClose = input(false);
  readonly openedChange = output<boolean>();
  readonly closedStart = output<void>();

  readonly sidenav = viewChild<MatSidenav>('sidenav');
  private readonly container = viewChild<MatSidenavContainer>('container');
  private readonly sidenavElement = viewChild('sidenav', { read: ElementRef });

  private resizeObserver?: ResizeObserver;

  constructor() {
    // MatSidenavContainer only recalculates the content margin when the
    // drawer opens/closes or the viewport resizes. Its width can also
    // change (e.g. via the --sc-sidenav-width CSS var) while it stays
    // opened, which the container never picks up on its own.
    afterNextRender(() => {
      const element = this.sidenavElement()?.nativeElement;
      if (!element) return;
      this.resizeObserver = new ResizeObserver(() => this.container()?.updateContentMargins());
      this.resizeObserver.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

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
