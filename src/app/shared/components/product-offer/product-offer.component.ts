import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { RouterLink } from '@angular/router';
import { optimizedImageUrl } from '../../image-url';

@Component({
  selector: 'app-product-offer',
  imports: [CurrencyPipe, NgOptimizedImage, PercentPipe, RouterLink],
  templateUrl: './product-offer.component.html',
})
export class ProductOfferComponent implements OnInit {
  product = input.required<Product>();
  priority = input(false);
  optimizedImageUrl = optimizedImageUrl;

  discount: number = 0;

  ngOnInit(): void {
    const previousPrice = this.product().previousPrice;
    const currentPrice = this.product().price;

    if (previousPrice) {
      this.discount = (previousPrice - currentPrice) / previousPrice;
    }
  }
}
