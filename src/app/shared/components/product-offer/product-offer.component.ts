import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { RouterLink } from '@angular/router';
import { optimizedImageUrl } from '../../optimized-image-url';

@Component({
  selector: 'app-product-offer',
  imports: [CurrencyPipe, PercentPipe, RouterLink],
  templateUrl: './product-offer.component.html',
})
export class ProductOfferComponent implements OnInit {
  product = input.required<Product>();
  imageUrl = optimizedImageUrl;

  discount: number = 0;

  ngOnInit(): void {
    const previousPrice = this.product().previousPrice;
    const currentPrice = this.product().price;

    if (previousPrice) {
      this.discount = (previousPrice - currentPrice) / previousPrice;
    }
  }
}
