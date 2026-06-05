import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PartnerDataSource } from '../models/partner-data-source.model';
import { Partner } from '../models/partner.model';
import { MOCK_PARTNERS } from './partner.mock';
import { buildOptions } from '../../../shared/utils/table.util';

@Injectable()
export class PartnerMockService implements PartnerDataSource {
  getPartners(): Observable<Partner[]> {
    return of([...MOCK_PARTNERS]);
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return of(MOCK_PARTNERS.find((p) => p.id === id));
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
}
