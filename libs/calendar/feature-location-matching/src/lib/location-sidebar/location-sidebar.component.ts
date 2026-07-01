import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  CalendarFlowActions,
  LocationMatchingActions,
  selectActiveCategoryIds,
  selectActiveRegionIds,
  selectCategories,
  selectLocationsLoading,
  selectRegions,
  selectSelectedLocationsCount,
  selectVisibleLocations,
} from '@socio-connect/calendar/data-access';
import { UiSpinnerComponent } from '@socio-connect/shared/ui-material-wrappers';
import { DeselectAllDialogComponent } from '../deselect-all-dialog/deselect-all-dialog.component';
import { LocationRowComponent } from '../location-row/location-row.component';

@Component({
  selector: 'sc-location-sidebar',
  standalone: true,
  imports: [CommonModule, UiSpinnerComponent, LocationRowComponent],
  templateUrl: './location-sidebar.component.html',
  styleUrl: './location-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSidebarComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  protected readonly regions = this.store.selectSignal(selectRegions);
  protected readonly categories = this.store.selectSignal(selectCategories);
  protected readonly activeRegionIds = this.store.selectSignal(selectActiveRegionIds);
  protected readonly activeCategoryIds = this.store.selectSignal(selectActiveCategoryIds);
  protected readonly locations = this.store.selectSignal(selectVisibleLocations);
  protected readonly locationsLoading = this.store.selectSignal(selectLocationsLoading);
  protected readonly selectedCount = this.store.selectSignal(selectSelectedLocationsCount);

  toggleRegion(id: string): void {
    this.store.dispatch(LocationMatchingActions.toggleRegion({ id }));
  }

  toggleCategory(id: string): void {
    this.store.dispatch(LocationMatchingActions.toggleCategory({ id }));
  }

  selectAll(): void {
    this.store.dispatch(LocationMatchingActions.selectAllVisible());
  }

  deselectAll(): void {
    const ref = this.dialog.open(DeselectAllDialogComponent);
    ref.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.store.dispatch(
          LocationMatchingActions.deselectAllVisible({ reason: result || undefined }),
        );
      }
    });
  }

  onRowSelectionChange(
    locationId: string,
    change: { selected: boolean; reason?: string },
  ): void {
    this.store.dispatch(
      LocationMatchingActions.setLocationSelection({
        locationId,
        selected: change.selected,
        reason: change.reason,
      }),
    );
  }

  generateCreativeBriefs(): void {
    this.store.dispatch(CalendarFlowActions.goToStep({ index: 2 }));
  }
}
