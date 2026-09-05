import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { HomeProductLoadingComponent } from './components/home-product-loading/home-product-loading.component';
import { ProductService } from '../core/services/product.service';
import { AsyncPipe } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { initCarousels } from 'flowbite/lib/esm/components/carousel';

@Component({
  selector: 'app-home',
  imports: [
    ProductOfferComponent,
    HomeProductComponent,
    HomeProductLoadingComponent,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  titleService = inject(Title);

  products$: Observable<Product[]> = this.productService.getAll();
  productOffers$: Observable<Product[]>;
  loadingProducts = Array.from({ length: 10 }, (_, index) => index);

  private flowbiteInitialized = false;

  constructor() {
    this.productOffers$ = this.productService.getOffers().pipe(
      tap((offers) => {
        if (offers && offers.length > 0) {
          setTimeout(() => this.initializeFlowbite(), 0);
        }
      })
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('NovaMart');
  }

  private initializeFlowbite(): void {
    if (!this.flowbiteInitialized) {
      initCarousels();
      this.flowbiteInitialized = true;
    }
  }
}
