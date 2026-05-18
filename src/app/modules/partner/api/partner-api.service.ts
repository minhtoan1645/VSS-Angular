import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Partner } from '../models/partner.model';
import { PartnerMockService } from '../mock/partner-mock.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerApiService {
  constructor(private readonly partnerMockService: PartnerMockService) {}

  getPartners(): Observable<Partner[]> {
    return of(this.partnerMockService.getPartnersSnapshot());
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return of(this.partnerMockService.getPartnersSnapshot().find((partner) => partner.id === id));
  }
}
