import { InjectionToken } from '@angular/core';

import { PartnerDataSource } from '../models/partner-data-source.model';

export const PARTNER_DATA_SOURCE = new InjectionToken<PartnerDataSource>('PARTNER_DATA_SOURCE');
