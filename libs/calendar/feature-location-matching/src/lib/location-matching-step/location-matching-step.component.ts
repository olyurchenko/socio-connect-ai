import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectLocationMatchingEvent,
  selectLocationMatchingInitialLoading,
} from '@socio-connect/calendar/data-access';
import { UiSpinnerComponent } from '@socio-connect/shared/ui-material-wrappers';
import { LocationMapComponent } from '../location-map/location-map.component';

@Component({
  selector: 'sc-location-matching-step',
  standalone: true,
  imports: [UiSpinnerComponent, LocationMapComponent],
  templateUrl: './location-matching-step.component.html',
  styleUrl: './location-matching-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationMatchingStepComponent {
  private readonly store = inject(Store);

  protected readonly event = this.store.selectSignal(selectLocationMatchingEvent);
  protected readonly isInitialLoading = this.store.selectSignal(selectLocationMatchingInitialLoading);
}
