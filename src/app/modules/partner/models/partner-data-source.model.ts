import { Observable } from 'rxjs';

import { Partner } from './partner.model';

export type PartnerPatch = Partial<Pick<Partner, 'name' | 'address'>>;

export interface PartnerDataSource {
  getPartners(): Observable<Partner[]>;
  getPartnerById(id: number): Observable<Partner | undefined>;
  getIndustryOptions(): Observable<string[]>;
  updatePartner(id: number, patch: PartnerPatch): Observable<Partner>;
  deletePartner(id: number): Observable<void>;
}
