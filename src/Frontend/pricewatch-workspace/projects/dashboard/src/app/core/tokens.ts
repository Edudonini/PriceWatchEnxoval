import { InjectionToken } from '@angular/core';

/** URL absoluta do back-end quando rodamos no servidor (SSR). */
export const API_URL = new InjectionToken<string>('API_URL');
