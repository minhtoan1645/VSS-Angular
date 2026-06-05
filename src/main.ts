import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { environment } from './environments/environment';
import { USER_DATA_SOURCE } from './app/modules/user/api/user-data-source.token';
import { UserMockService } from './app/modules/user/mock/user-mock.service';
import { PARTNER_DATA_SOURCE } from './app/modules/partner/api/partner-data-source.token';
import { PartnerMockService } from './app/modules/partner/mock/partner-mock.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: USER_DATA_SOURCE, useClass: UserMockService },
    { provide: PARTNER_DATA_SOURCE, useClass: PartnerMockService }
  ]
}).catch(err => console.error(err));
