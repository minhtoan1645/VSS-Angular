import { InjectionToken } from '@angular/core';

import { UserDataSource } from '../models/user-data-source.model';

export const USER_DATA_SOURCE = new InjectionToken<UserDataSource>('USER_DATA_SOURCE');
