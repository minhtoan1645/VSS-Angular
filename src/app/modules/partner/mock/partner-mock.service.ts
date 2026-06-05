import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PartnerDataSource, PartnerPatch } from '../models/partner-data-source.model';
import { Partner } from '../models/partner.model';
import { MOCK_PARTNERS } from './partner.mock';
import { buildOptions } from '../../../shared/utils/table.util';

@Injectable()
export class PartnerMockService implements PartnerDataSource {
  private readonly items: Partner[] = MOCK_PARTNERS.map((p) => ({ ...p }));

  getPartners(): Observable<Partner[]> {
    return of([...this.items]);
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return of(this.items.find((p) => p.id === id));
  }

  getIndustryOptions(): Observable<string[]> {
    return this.getPartners().pipe(
      map((partners) => {
        const industries = partners.reduce<string[]>(
          (all, partner) => [...all, ...partner.industries],
          []
        );
        return buildOptions(industries).slice(1);
      })
    );
  }

  updatePartner(id: number, patch: PartnerPatch): Observable<Partner> {
    const index = this.items.findIndex((p) => p.id === id);
    if (index === -1) {
      return of(this.items[0]);
    }
    const current = this.items[index];
    const updated: Partner = {
      ...current,
      ...patch,
      avatarText: patch.name ? this.toAvatarText(patch.name) : current.avatarText
    };
    this.items[index] = updated;
    return of(updated);
  }

  deletePartner(id: number): Observable<void> {
    const index = this.items.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return of(undefined);
  }

  private toAvatarText(name: string): string {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0) ?? '';
    const last = words.length > 1 ? words[words.length - 1].charAt(0) : words[0]?.charAt(1) ?? '';
    return `${first}${last}`.toUpperCase();
  }
}
