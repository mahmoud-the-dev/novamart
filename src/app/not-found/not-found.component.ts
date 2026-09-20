import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="mx-auto max-w-screen-lg px-6 py-24 text-center">
      <h1 class="text-3xl font-bold text-gray-900">Page not found</h1>
      <p class="mt-3 text-gray-500">The page you requested does not exist.</p>
      <a routerLink="/" class="mt-6 inline-flex text-teal-600 underline">
        Return to NovaMart
      </a>
    </main>
  `,
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage(
      'Page Not Found | NovaMart',
      'The requested NovaMart page does not exist.',
      location.pathname,
      false
    );
  }
}
