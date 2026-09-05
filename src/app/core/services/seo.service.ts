import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoPage {
  title: string;
  description: string;
  path: string;
  robots: string;
  type: 'product' | 'website';
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly origin = 'https://novamart-shop.vercel.app';

  update(page: SeoPage): void {
    const url = new URL(page.path, this.origin).toString();

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: page.robots });
    this.updateProperty('og:type', page.type);
    this.updateProperty('og:title', page.title);
    this.updateProperty('og:description', page.description);
    this.updateProperty('og:url', url);
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });

    if (page.image) {
      this.updateProperty('og:image', page.image);
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:image', content: page.image });
    } else {
      this.meta.removeTag("property='og:image'");
      this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
      this.meta.removeTag("name='twitter:image'");
    }

    let canonical = this.document.head.querySelector<HTMLLinkElement>(
      "link[rel='canonical']"
    );

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.append(canonical);
    }

    canonical.href = url;
  }

  private updateProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }
}
