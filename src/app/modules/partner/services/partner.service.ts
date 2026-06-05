import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PartnerApiService } from '../api/partner-api.service';
import { PartnerPatch } from '../models/partner-data-source.model';
import { Partner } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  constructor(private readonly partnerApiService: PartnerApiService) {}

  getPartners(): Observable<Partner[]> {
    return this.partnerApiService.getPartners();
  }

  getPartnerById(id: number): Observable<Partner | undefined> {
    return this.partnerApiService.getPartnerById(id);
  }

  getIndustryOptions(): Observable<string[]> {
    return this.partnerApiService.getIndustryOptions();
  }

  updatePartner(id: number, patch: PartnerPatch): Observable<Partner> {
    return this.partnerApiService.updatePartner(id, patch);
  }

  deletePartner(id: number): Observable<void> {
    return this.partnerApiService.deletePartner(id);
  }
}
