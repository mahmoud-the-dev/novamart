import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartProduct } from '../../shared/models/cart-product';
import { PurchaseService } from '../../core/services/purchase.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-success',
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Order Confirmation | NovaMart');
    const storedCartProducts = localStorage.getItem('cart-products');

    if (!storedCartProducts) {
      return;
    }

    let cartProducts: CartProduct[];

    try {
      cartProducts = JSON.parse(storedCartProducts);
    } catch {
      return;
    }

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      return;
    }

    const mappedProducts = cartProducts.map(({ quantity, product }) => {
      return {
        id: product.id,
        quantity,
      };
    });

    const total = cartProducts.reduce((acc, current) => {
      return acc + current.product.price * current.quantity;
    }, 0);

    this.purchaseService.save({ total, products: mappedProducts }).subscribe({
      next: () => {
        localStorage.removeItem('cart-products');
      },
      error: () => {},
    });
  }
}
