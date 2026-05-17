import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DEFAULT_AUTH_PAGE_CLASS } from '../../core/constants/app.constants';
import { getDeepestRouteData } from '../../core/utils/route-data.util';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  pageClasses: string[] = [DEFAULT_AUTH_PAGE_CLASS];
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.syncRouteData();
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => this.syncRouteData())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostBinding('class')
  get hostClasses(): string {
    return this.pageClasses.join(' ');
  }

  private syncRouteData(): void {
    const data = getDeepestRouteData(this.activatedRoute);
    this.pageClasses = Array.isArray(data.pageClasses) ? data.pageClasses : [DEFAULT_AUTH_PAGE_CLASS];
  }
}
