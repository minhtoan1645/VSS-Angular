import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Permission, PermissionMode } from '../../core/models/permission.model';
import { PermissionService } from '../../core/services/permission.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnDestroy {
  private hasView = false;
  private mode: PermissionMode = 'any';
  private requiredPermissions: Permission[] = [];
  private readonly subscription: Subscription;

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly permissionService: PermissionService
  ) {
    this.subscription = this.permissionService.permissionsChanged$
      .subscribe(() => this.updateView());
  }

  @Input()
  set appHasPermission(value: Permission | Permission[] | null | undefined) {
    this.requiredPermissions = this.normalizePermissions(value);
    this.updateView();
  }

  @Input()
  set appHasPermissionMode(mode: PermissionMode | null | undefined) {
    this.mode = mode ?? 'any';
    this.updateView();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private normalizePermissions(value: Permission | Permission[] | null | undefined): Permission[] {
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }

  private updateView(): void {
    const canRender = this.canRenderTemplate();

    if (canRender && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }

    if (!canRender && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private canRenderTemplate(): boolean {
    if (this.requiredPermissions.length === 0) {
      return true;
    }

    return this.mode === 'all'
      ? this.permissionService.hasAllPermissions(this.requiredPermissions)
      : this.permissionService.hasAnyPermission(this.requiredPermissions);
  }
}
