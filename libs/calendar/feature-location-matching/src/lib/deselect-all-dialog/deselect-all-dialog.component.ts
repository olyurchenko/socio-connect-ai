import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sc-deselect-all-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deselect-all-dialog.component.html',
  styleUrl: './deselect-all-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeselectAllDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeselectAllDialogComponent, string>);

  protected readonly reasonText = signal('');

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(this.reasonText());
  }
}
