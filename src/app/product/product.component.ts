import { Component, inject, input, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Product } from '../shared/models/product';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { ProductService } from '../core/services/product.service';
import { CartProduct } from '../shared/models/cart-product';
import { Observable, tap } from 'rxjs';
import { optimizedImageUrl } from '../shared/optimized-image-url';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, AsyncPipe],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit{
  id = input<string>('');
  productService = inject(ProductService);
  private meta = inject(Meta);
  private title = inject(Title);
  product$!: Observable<Product | undefined>;
  imageUrl = optimizedImageUrl;

  ngOnInit(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    this.title.setTitle('Product | NovaMart');
    this.product$ = this.productService.getById(this.id()).pipe(
      tap((product) => {
        if (product) {
          this.title.setTitle(`${product.name} | NovaMart`);
        }
      })
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
}
