import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOCK_PARTNERS } from '../mock-data/partners.mock';
import { Partner } from '../models/partner.model';
import { buildOptions } from '../utils/table.util';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private readonly partners$ = of(MOCK_PARTNERS);
  private readonly industryOptions$ = this.partners$.pipe(
    map((partners) => {
      const industries = partners.reduce<string[]>(
        (allIndustries, partner) => [...allIndustries, ...partner.industries],
        []
      );

      return buildOptions(industries).slice(1);
    })
  );

  getPartners(): Observable<Partner[]> {
    return this.partners$;
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return this.partners$.pipe(
      map((partners) => partners.find((partner) => partner.id === id))
    );
  }

  getIndustryOptions(): Observable<string[]> {
    return this.industryOptions$;
  }
}
