import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { ProductService } from '../core/services/product.service';
import { CartProduct } from '../shared/models/cart-product';
import { Observable, tap } from 'rxjs';
import { optimizedImageUrl } from '../shared/optimized-image-url';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, AsyncPipe],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit{
  id = input<string>('');
  productService = inject(ProductService);
  private seo = inject(SeoService);
  product$!: Observable<Product | undefined>;
  imageUrl = optimizedImageUrl;

  ngOnInit(): void {
    this.seo.update({
      title: 'Product | NovaMart',
      description: 'Browse product details at NovaMart.',
      path: `/products/${this.id()}`,
      robots: 'index, follow',
      type: 'product',
    });
    this.product$ = this.productService.getById(this.id()).pipe(
      tap((product) => {
        if (product) {
          this.seo.update({
            title: `${product.name} | NovaMart`,
            description: product.description.replace(/<[^>]*>/g, ' '),
            path: `/products/${product.id}`,
            robots: 'index, follow',
            type: 'product',
            image: product.urlImg,
          });
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
