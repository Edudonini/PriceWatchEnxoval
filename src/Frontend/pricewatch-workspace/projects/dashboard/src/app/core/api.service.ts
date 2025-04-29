import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;   // '/api'

  get <T>(p: string)             { return this.http.get <T>(`${this.base}/${p}`); }
  post<T>(p: string, b: unknown) { return this.http.post<T>(`${this.base}/${p}`, b); }
}
