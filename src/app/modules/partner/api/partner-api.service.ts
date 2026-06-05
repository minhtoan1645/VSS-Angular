import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PARTNER_DATA_SOURCE } from './partner-data-source.token';
import { Partner } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerApiService {
  private readonly dataSource = inject(PARTNER_DATA_SOURCE);

  getPartners(): Observable<Partner[]> {
    return this.dataSource.getPartners();
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return this.dataSource.getPartnerById(id);
  }

  getIndustryOptions(): Observable<string[]> {
    return this.dataSource.getIndustryOptions();
  }
}
