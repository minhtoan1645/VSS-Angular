import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PartnerApiService } from '../api/partner-api.service';
import { PartnerPatch } from '../models/partner-data-source.model';
import { Partner } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private readonly _partners = signal<Partner[]>([]);
  private readonly _loading = signal(true);
  private readonly _loadError = signal<string | null>(null);

  readonly partners = this._partners.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly loadError = this._loadError.asReadonly();

  private readonly partners$ = toObservable(this._partners);

  constructor(private readonly api: PartnerApiService) {
    this.api.getPartners().subscribe({
      next: (partners) => { this._partners.set(partners); this._loading.set(false); },
      error: () => { this._loadError.set('Không thể tải danh sách đối tác.'); this._loading.set(false); }
    });
  }

  getPartners(): Observable<Partner[]> {
    return this.partners$;
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return this.partners$.pipe(map((list) => list.find((p) => p.id === id)));
  }

  getIndustryOptions(): Observable<string[]> {
    return this.api.getIndustryOptions();
  }

  updatePartner(id: number, patch: PartnerPatch): Observable<Partner> {
    return this.api.updatePartner(id, patch).pipe(
      tap((updated) => this._partners.update((list) => list.map((p) => (p.id === id ? updated : p))))
    );
  }

  deletePartner(id: number): Observable<void> {
    return this.api.deletePartner(id).pipe(
      tap(() => this._partners.update((list) => list.filter((p) => p.id !== id)))
    );
  }
}
