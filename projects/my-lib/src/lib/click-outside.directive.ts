import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  NgZone,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  private initialClick = true;

  constructor(private el: ElementRef, private zone: NgZone) {}

  ngAfterViewInit() {
    // Attach listener in capture phase so it always fires
    this.zone.runOutsideAngular(() => {
      document.addEventListener('click', this.handleClick, true);
    });

    // Prevent the opening click from closing the dropdown
    setTimeout(() => (this.initialClick = false), 0);
  }

  private handleClick = (event: Event) => {
    if (this.initialClick) return;

    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.zone.run(() => this.clickOutside.emit());
    }
  };

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClick, true);
  }
}
