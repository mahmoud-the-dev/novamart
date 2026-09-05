import { Injectable, inject } from '@angular/core';
import { Product } from '../../shared/models/product';
import { BehaviorSubject, Observable, map, of, shareReplay, tap } from 'rxjs';
import { ProductApiService } from './product-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productApiService = inject(ProductApiService);

  private productsCache: Product[] = [];
  private productsRequest$?: Observable<Product[]>;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  getAll(): Observable<Product[]> {
    if (this.productsCache.length > 0) {
      return of(this.productsCache);
    }

    if (!this.productsRequest$) {
      this.productsRequest$ = this.productApiService.getProducts().pipe(
        tap((products: Product[]) => {
          this.productsCache = products;
          this.productsSubject.next(products);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    return this.productsRequest$;
  }

  getOffers(): Observable<Product[]> {
    const numberOfOffers = 5;
    return this.getAll().pipe(
      map((products) => products.slice(0, numberOfOffers))
    );
  }

  getById(id: string): Observable<Product | undefined> {
    if (this.productsCache.length > 0) {
      const product = this.productsCache.find((p) => p.id === id);
      if (product) {
        return of(product);
      }
    }

    return this.productApiService.getProduct(id).pipe(
      tap((product: Product | undefined) => {
        if (product && this.productsCache.length === 0) {
        }
      })
    );
  }
}
