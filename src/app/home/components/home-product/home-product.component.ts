import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { optimizedImageUrl } from '../../../shared/image-url';

@Component({
  selector: 'app-home-product',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  templateUrl: './home-product.component.html',
})
export class HomeProductComponent {
  product = input.required<Product>();
  optimizedImageUrl = optimizedImageUrl;
}
