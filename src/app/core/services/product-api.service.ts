import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
