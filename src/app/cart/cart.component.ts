import { Component, inject, OnInit } from '@angular/core';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../shared/models/cart-product';
import { SeoService } from '../core/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartProductComponent, CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly seo = inject(SeoService);
  cartProducts: CartProduct[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.seo.setPage('Shopping Cart | NovaMart', 'Review the items in your NovaMart cart.', '/cart', false);
    this.updateCart();
  }

  updateCart() {
    const storagedProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];

    this.cartProducts = storagedProducts;
    this.total = 0;

    if (this.cartProducts.length > 0) {
      this.total = this.cartProducts.reduce(
        (acc, val) => acc + val.product.price * val.quantity,
        0
      );
    }
  }
}
