import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Partner } from '../models/partner.model';
import { MOCK_PARTNERS } from './partner.mock';
import { buildOptions } from '../../../shared/utils/table.util';

@Injectable({
  providedIn: 'root'
})
export class PartnerMockService {
  getPartnersSnapshot(): Partner[] {
    return MOCK_PARTNERS;
  }

  getPartners(): Observable<Partner[]> {
    return of(MOCK_PARTNERS);
  }

  getIndustryOptions(): Observable<string[]> {
    return this.getPartners().pipe(
      map((partners) => {
        const industries = partners.reduce<string[]>(
          (allIndustries, partner) => [...allIndustries, ...partner.industries],
          []
        );

        return buildOptions(industries).slice(1);
      })
    );
  }
}
