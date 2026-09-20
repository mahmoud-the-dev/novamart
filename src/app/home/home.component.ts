import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { ProductService } from '../core/services/product.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ProductOfferComponent, HomeProductComponent, AsyncPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  titleService = inject(Title);

  products$: Observable<Product[]> = this.productService.getAll();
  productOffers$: Observable<Product[]> = this.productService.getOffers();
  activeOfferIndex = signal(0);

  ngOnInit(): void {
    this.titleService.setTitle('NovaMart');
  }

  showPreviousOffer(numberOfOffers: number): void {
    this.activeOfferIndex.update((index) =>
      index === 0 ? numberOfOffers - 1 : index - 1
    );
  }

  showNextOffer(numberOfOffers: number): void {
    this.activeOfferIndex.update((index) =>
      index === numberOfOffers - 1 ? 0 : index + 1
    );
  }
}
