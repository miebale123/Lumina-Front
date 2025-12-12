import { Injector } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Injectable, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>(component: any, props?: Record<string, any>): OverlayRef {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'my-modal-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });

    const portalInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: OverlayRef, useValue: overlayRef }],
    });

    const portal = new ComponentPortal(component, null, portalInjector);
    const cmpRef = overlayRef.attach(portal);

    Object.assign(cmpRef.instance as any, props);

    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    return overlayRef;
  }
}
