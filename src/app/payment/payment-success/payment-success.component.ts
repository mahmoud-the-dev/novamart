import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartProduct } from '../../shared/models/cart-product';
import { PurchaseService } from '../../core/services/purchase.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-payment-success',
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Order Confirmation | NovaMart',
      description: 'Your NovaMart order confirmation.',
      path: '/PaymentSuccess',
      robots: 'noindex, nofollow',
      type: 'website',
    });
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
