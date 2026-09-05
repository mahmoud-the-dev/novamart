import { Component, inject, OnInit } from '@angular/core';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { HomeProductLoadingComponent } from './components/home-product-loading/home-product-loading.component';
import { ProductService } from '../core/services/product.service';
import { AsyncPipe } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { initCarousels } from 'flowbite/lib/esm/components/carousel';
import { SeoService } from '../core/services/seo.service';

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
  seo = inject(SeoService);

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
    this.seo.update({
      title: 'NovaMart',
      description:
        'Shop the latest electronics, gaming gear, smart devices, and accessories at NovaMart. Discover top-rated tech and great deals on popular products.',
      path: '/',
      robots: 'index, follow',
      type: 'website',
    });
  }

  private initializeFlowbite(): void {
    if (!this.flowbiteInitialized) {
      initCarousels();
      this.flowbiteInitialized = true;
    }
  }
}
