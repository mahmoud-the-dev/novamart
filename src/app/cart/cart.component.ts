import { Component, OnInit } from '@angular/core';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../shared/models/cart-product';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  imports: [CartProductComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  total: number = 0;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Shopping Cart | NovaMart');
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
