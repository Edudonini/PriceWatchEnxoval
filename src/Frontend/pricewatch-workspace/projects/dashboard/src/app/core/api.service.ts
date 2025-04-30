import { inject, Injectable } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { environment }        from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;   // "/api"

  get   <T>(p: string)           { return this.http.get   <T>(`${this.base}/${p}`); }
  post  <T>(p: string, b: any)   { return this.http.post  <T>(`${this.base}/${p}`, b); }
  put   <T>(p: string, b: any)   { return this.http.put   <T>(`${this.base}/${p}`, b); }
  delete<T>(p: string)           { return this.http.delete<T>(`${this.base}/${p}`); }
}
