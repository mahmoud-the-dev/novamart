import { Component, input } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { optimizedImageUrl } from '../../../shared/optimized-image-url';

@Component({
  selector: 'app-home-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './home-product.component.html',
})
export class HomeProductComponent {
  product = input.required<Product>();
  imageUrl = optimizedImageUrl;
}
