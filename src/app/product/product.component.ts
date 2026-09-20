import { Component, inject, input, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Product } from '../shared/models/product';
import { CurrencyPipe, AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ProductService } from '../core/services/product.service';
import { CartProduct } from '../shared/models/cart-product';
import { Observable } from 'rxjs';
import { optimizedImageUrl } from '../shared/image-url';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, AsyncPipe, NgOptimizedImage],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit{
  id = input<string>('');
  productService = inject(ProductService);
  private meta = inject(Meta);
  product$!: Observable<Product | undefined>;
  optimizedImageUrl = optimizedImageUrl;

  ngOnInit(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    this.product$ = this.productService.getById(this.id());
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
}
