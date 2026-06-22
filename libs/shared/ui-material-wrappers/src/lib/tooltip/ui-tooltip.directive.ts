import { Directive, input } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Directive({
  selector: '[scUiTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatTooltip,
    },
  ],
})
export class UiTooltipDirective {
  readonly scUiTooltip = input<string>('');
  readonly tooltipPosition = input<TooltipPosition>('above');
  readonly tooltipDisabled = input(false);
}
