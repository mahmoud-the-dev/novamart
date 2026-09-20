import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Product } from '../../shared/models/product';

const siteUrl = 'https://novamart-shop.vercel.app';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  setPage(title: string, description: string, path: string, index = true): string {
    const canonicalUrl = new URL(path, `${siteUrl}/`).toString();
    const robots = index ? 'index, follow' : 'noindex, follow';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    const canonical = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    canonical?.setAttribute('href', canonicalUrl);
    this.document.querySelector('[data-seo-product]')?.remove();

    return canonicalUrl;
  }

  setProduct(product: Product): void {
    const description = product.description.replace(/<[^>]+>/g, ' ').trim();
    const canonicalUrl = this.setPage(
      `${product.name} | NovaMart`,
      description,
      `/products/${encodeURIComponent(product.id)}`
    );

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description,
      image: product.urlImg,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: 'NovaMart',
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'USD',
        price: product.price.toFixed(2),
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset['seoProduct'] = '';
    script.textContent = JSON.stringify(structuredData);
    this.document.head.append(script);
  }
}
