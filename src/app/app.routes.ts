import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((component) => component.HomeComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then((component) => component.CartComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product/product.component').then(
        (component) => component.ProductComponent
      ),
  },
  {
    path: 'PaymentSuccess',
    loadComponent: () =>
      import('./payment/payment-success/payment-success.component').then(
        (component) => component.PaymentSuccessComponent
      ),
  },
];
