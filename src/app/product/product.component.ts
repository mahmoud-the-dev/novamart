import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../shared/models/product';
import { CurrencyPipe, AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ProductService } from '../core/services/product.service';
import { CartProduct } from '../shared/models/cart-product';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { optimizedImageUrl } from '../shared/image-url';
import { SeoService } from '../core/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, AsyncPipe, NgOptimizedImage, RouterLink],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit{
  id = input<string>('');
  productService = inject(ProductService);
  private seo = inject(SeoService);
  product$!: Observable<Product | undefined>;
  optimizedImageUrl = optimizedImageUrl;
  isLoading = signal(true);
  productNotFound = signal(false);

  ngOnInit(): void {
    this.product$ = this.productService.getById(this.id()).pipe(
      tap((product) => {
        if (product) {
          this.seo.setProduct(product);
          return;
        }

        this.setProductNotFoundMetadata();
      }),
      catchError(() => {
        this.setProductNotFoundMetadata();
        return of(undefined);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  addToCart(product: Product) {
    const cartProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];

    const matched = cartProducts.find(({ product: p }) => p.id === product.id);

    if (matched) {
      matched.quantity++;
    } else {
      cartProducts.push({ product, quantity: 1 });
    }
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
  }

  private setProductNotFoundMetadata(): void {
    this.productNotFound.set(true);
    this.seo.setPage(
      'Product Not Found | NovaMart',
      'This NovaMart product is unavailable or no longer exists.',
      `/products/${encodeURIComponent(this.id())}`,
      false
    );
  }
}
