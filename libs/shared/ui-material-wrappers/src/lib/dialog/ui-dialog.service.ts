import { inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface DialogConfig<D = unknown> extends MatDialogConfig<D> {
  title?: string;
  panelClass?: string | string[];
}

@Injectable({ providedIn: 'root' })
export class UiDialogService {
  private readonly dialog = inject(MatDialog);

  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config?: DialogConfig<D>,
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(component, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: ['sc-dialog', ...(Array.isArray(config?.panelClass) ? config.panelClass : config?.panelClass ? [config.panelClass] : [])],
      ...config,
    });
  }

  openConfirm(config: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }): Observable<boolean> {
    // Inline confirm dialog — import dynamically to avoid circular deps
    return new Observable((subscriber) => {
      const ref = this.dialog.open<unknown, typeof config, boolean>(
        // Deferred import pattern — real implementation would use a shared ConfirmDialogComponent
        {} as Type<unknown>,
        { data: config, width: '380px' },
      );
      ref.afterClosed().subscribe((result) => {
        subscriber.next(result ?? false);
        subscriber.complete();
      });
    });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
