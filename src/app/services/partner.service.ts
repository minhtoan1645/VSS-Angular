import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOCK_PARTNERS } from '../mock-data/partners.mock';
import { Partner } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
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

        return Array.from(new Set(industries));
      })
    );
  }
}
