import { Observable } from 'rxjs';

import { Partner } from './partner.model';

export interface PartnerDataSource {
  getPartners(): Observable<Partner[]>;
  getPartnerById(id: number): Observable<Partner | undefined>;
  getIndustryOptions(): Observable<string[]>;
}
