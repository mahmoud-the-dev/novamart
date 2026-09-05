import { Component, OnInit } from '@angular/core';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../shared/models/cart-product';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-cart',
  imports: [CartProductComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  total: number = 0;

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Shopping Cart | NovaMart',
      description: 'Review the items in your NovaMart shopping cart before checkout.',
      path: '/cart',
      robots: 'noindex, follow',
      type: 'website',
    });
    this.updateCart();
  }

  updateCart() {
    const storagedProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];

    this.cartProducts = storagedProducts;

    if (this.cartProducts.length > 0) {
      this.total = this.cartProducts.reduce(
        (acc, val) => acc + val.product.price * val.quantity,
        0
      );
    }
  }
}
