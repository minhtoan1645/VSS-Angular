import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PartnerApiService } from '../api/partner-api.service';
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
}
