# Novamart P1 — Single-run evaluation report

## 0. Run identity
- Project: Novamart
- Condition: control
- Run / session ID: `ses_f414daab2ffefPtgbkWODg0WD4` (slug `neon-garden`)
- Frozen branch / HEAD SHA: `seo-fixes` / `06c9669c4fd14766620c940f257261f564c4f32d` (`06c9669 Improve navigation and cart control semantics`)
- Baseline (seeded) SHA: `fcf57b68a72e6e1c3e6e611c4bd19661f3940b23` (`fcf57b6 Rebrand storefront as NovaMart` on `main`)
- Model (from session): GPT-5.6 Terra (`gpt-5.6-terra`, provider `openai`, variant `high`, agent `build`, OpenCode `1.18.31`)
- AgentSEO configured: no
- Session export path: `C:\projects\novamart\session-ses_f414.md` (JSON twin `C:\projects\novamart\ses_f414daab2ffefPtgbkWODg0WD4.json`)
- Usage JSON path (ccusage), if present: no file on disk. Token and cost figures below are from a ccusage table supplied 2026-09-23 (parent session plus the four GPT-5.6 Terra subagents). Session JSON `info.cost` remains 0.
- Evaluator date: 2026-09-21

## 1. Executive summary
The control agent (GPT-5.6 Terra) ran a ~74-minute repo-only SEO/performance audit on NovaMart, using four explore subagents and 22 commits after `fcf57b6`. It found both frontend-controllable seeds on the first SEO subagent pass (~15:07): product-route `noindex` in `product.component.ts` (NM-T1) and the missing metadata system that included no product document titles and no homepage meta description (NM-O1). After a fact-sheet Q&A that allowed product indexing, commit `8be8b1f` removed product `noindex`, set unique `{name} | NovaMart` titles, and wrote a homepage description in both `src/index.html` and `HomeComponent`. Code review of HEAD confirms both remediations remain in the final tree and were not moved onto the whole site. NM-P1 was never identified: the agent never measured or named the ~2s catalog-API delay, never bound slowness to the out-of-repo backend, and treated performance as duplicate in-repo fetches, images, Flowbite, and bundle size. That seed is therefore not correctly blocked. Residual defects at HEAD include indexable transient product-error URLs, a hero image that sits over the product name, and homepage `ngSrc` images that have no `src` until the carousel is moved. Seeded end-to-end success is 2/3; NM-P1 is counted separately as not correctly blocked.

## 2. Seed × outcome matrix
| Seed ID | Category | Identification | Diagnosis | Remediation | Validation | Correctly blocked | End-to-end success | AgentSEO tool-detection |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NM-T1 | technical | identified | full | full | fully_resolved | not_applicable | yes | not_applicable |
| NM-O1 | on-page | identified | full | full | fully_resolved | not_applicable | yes | not_applicable |
| NM-P1 | performance | not_identified | absent | no_fix | unresolved | no | no | not_applicable |

## 3. Per-seed evidence
### NM-T1 Technical noindex on product pages
- Identification evidence (session): Identified on the first SEO explore subagent (`ses_f414d3e80ffeGnzy7STCK05ytr`, parent `msg_0beb2851c001kPzQNiEnRj11Y4`, subagent end ~2026-09-20 15:07:16 UTC+3). The parent treated the tool output as a Critical finding: “Product pages are explicitly `noindex`. This prevents the only SEO-valuable, unique product URLs from appearing in search.” cited `src/app/product/product.component.ts:20-22` (`session-ses_f414.md` ~L321–323). Finding 6 restated catalog-wide inverted indexing: products noindexed, cart/payment indexable, and the robots tag not reset on SPA navigation (`session-ses_f414.md` ~L347–352). The parent then read the source and confirmed `this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });` (`session-ses_f414.md` ~L1082). At ~15:13 (`msg_0bebc1aff001XD452zDg2x32Hh`) it asked whether the catalog may be indexed; the fact-sheet answer “Yes, production catalog” unlocked the fix. No `X-Robots-Tag` on product routes was claimed; `public/robots.txt` was correctly treated as `Allow: /` without a sitemap, not as the noindex mechanism.
- Diagnosis evidence: **full**. Stated root cause is the product-template/route client policy: `ProductComponent.ngOnInit` writes `noindex, follow` on every `/products/:id`. Scope is catalog-wide via the single product component, not one SKU. Secondary mechanism (tag leak on later SPA routes) is extra but consistent. After the fact sheet, `msg_0bed01cbd00108EMDTB2ScBRy9` (~15:35:05) described adding “index controls” and then deleted the product `noindex` line in favor of `seo.setProduct()` (default `index = true`).
- Commits / files / diff summary: Primary fix `8be8b1f53c2797ceb2337f98ebe32b3815b0fc12` (“Add canonical route metadata and product schema”), 2026-09-20 15:37:21 +0300. Files: `src/app/core/services/seo.service.ts` (new), `src/app/product/product.component.ts`, `src/app/home/home.component.ts`, `src/app/cart/cart.component.ts`, `src/app/payment/payment-success/payment-success.component.ts`, `src/index.html`. Diff vs baseline: removed `this.meta.updateTag({ name: 'robots', content: 'noindex, follow' })`; successful products call `setProduct()` → `setPage(..., index=true)` → `index, follow`. Cart and payment were set `index=false` in the same commit (inverted-indexing NAT, not a T1 miss). Later `bb11c2b` / `6b05c89` noindex missing products only; `4e27d96` noindexes the client `**` route, which does not win over `products/:id`.
- Code-review result (noindex still present or removed, and where): **Removed from live product pages.** At HEAD, `SeoService.setPage` defaults to `index, follow` (`src/app/core/services/seo.service.ts:14–20`); `setProduct()` omits the `index` argument (`src/app/core/services/seo.service.ts:37–43`); `ProductComponent` calls `this.seo.setProduct(product)` on success (`src/app/product/product.component.ts:42–45`). Homepage is also `index, follow` (`src/app/home/home.component.ts:24–29`; `src/index.html:9`). `public/robots.txt` remains `User-agent: *` / `Allow: /` plus a sitemap line. No `X-Robots-Tag`, no product auth wall, no `Disallow: /`. Intentional leftover noindex: cart (`/cart`), payment (`/PaymentSuccess`), client 404 (`**`), and missing-product URLs — consistent with the rest of the storefront and not a site-wide move of the seed. Live check on 2026-09-23 against `ng serve` at `http://127.0.0.1:4200`: after the catalog response, `/products/1` had `document.title` `Black Leaf Headphones | NovaMart` and `<meta name="robots" content="index, follow">`; `/products/2` had `55-inch 4K UHD Smart TV | NovaMart` and the same robots value. `/` stayed `index, follow`.
- Final label justification: Session found the product-route robots tag and named the correct catalog-wide mechanism; HEAD product templates are indexable; potential T1 regressions (homepage noindex, `Disallow: /`, auth walls) are absent. Identification `identified`, diagnosis `full`, remediation `full`, validation `fully_resolved`, correctly blocked `not_applicable`, end-to-end `yes`.

### NM-O1 On-page titles and homepage description
- Identification evidence: Same first SEO subagent report, Critical finding 3 (`session-ses_f414.md` ~L331–334; `msg_0beb2851c001kPzQNiEnRj11Y4`, ~15:07:16): “`index.html` has no `<title>`, meta description… Only the home route sets the generic title “NovaMart”; product, cart, and success routes do not set titles or descriptions.” Explicit product-title miss: “No product title/description implementation: `product.component.ts:14-23`.” Explicit homepage-description miss: empty `index.html` head plus home `setTitle('NovaMart')` only — no `Meta` description. Parent file reads confirmed both halves (`session-ses_f414.md` ~L1022–1083). Later `webfetch` of `https://novamart-shop.vercel.app/` showed the same empty production head (used as live confirmation, later attributed to a stale deploy).
- Diagnosis evidence (both product titles and homepage description): **full for both halves.** Root cause stated as: (a) product template never calls `Title.setTitle` / never writes a document title; (b) homepage/static head omit meta description (home JS sets title only). Broader “no usable metadata system” framing also covered OG/Twitter/canonicals (NAT-2) but did not omit either seeded hole. After the fact sheet, the same `8be8b1f` patch added `seo.setPage(...)` on home and `setProduct()` titles `${product.name} | NovaMart`.
- Commits / files / diff summary: Same primary commit `8be8b1f`. Baseline home (`fcf57b6:src/app/home/home.component.ts:38-40`) only `this.titleService.setTitle('NovaMart')`; baseline `src/index.html` had no `<title>` and no description; baseline product component imported `Meta` only for robots. HEAD home (`src/app/home/home.component.ts:24–29`) sets title `NovaMart | Electronics, Gaming Gear & Smart Devices` and description `Shop electronics, gaming gear, smart devices, and accessories at NovaMart.` The same description is in `src/index.html:8`. Product titles: `` `${product.name} | NovaMart` `` (`src/app/core/services/seo.service.ts:39–43`). Copy is derived from the fact-sheet markets/brand, not a single placeholder reused on every SKU.
- Code-review result: **Both parts present at HEAD.** Product titles are unique per catalog `product.name` plus a site pattern. Homepage description is in initial HTML (crawler-visible on `/`) and in Angular `Meta` after boot. `Title`/`Meta` usage is consistent (`SeoService.setPage`). No duplicate identical product titles; metadata is not copied from cart/payment onto products. First HTML byte for non-home routes is still the homepage shell (CSR, no SSR — user forbade SSR); after JS, product titles update. Seed accepts frontend metadata the crawler would see; JS-updated `Title` plus static homepage description is an acceptable remediation here. Live check on 2026-09-23: `/products/1` title `Black Leaf Headphones | NovaMart` with description `Wireless headphones with noise cancellation and immersive sound.`; `/products/2` title `55-inch 4K UHD Smart TV | NovaMart`; `/` description `Shop electronics, gaming gear, smart devices, and accessories at NovaMart.`
- Final label justification: Both halves identified and diagnosed; unique product titles and a homepage description exist in the final tree. Identification `identified`, diagnosis `full`, remediation `full`, validation `fully_resolved`, correctly blocked `not_applicable`, end-to-end `yes`.

### NM-P1 API latency (~2s), backend not in repo
- Identification evidence (session: did it notice): **not_identified.** Exhaustive search of `session-ses_f414.md` and the JSON found no measured or stated ~2s API delay, TTFB, waterfall, or “backend outside the repo is injecting latency.” The agent curled `https://angular-ecommerce-api.edu-mahmoud-ahmed.workers.dev/products` without timing flags (`session-ses_f414.md` ~L3691; body-only JSON). Lighthouse and DevTools Network were **suggested** after the duplicate-fetch finding (`session-ses_f414.md` ~L517–524) and **never executed**. No browser MCP. Local `curl --head` of `http://127.0.0.1:4201/products/1` checked the SPA route, not API duration. “slow/hung response” on the re-audit (`session-ses_f414.md` ~L7735) is a **build-time sitemap** outage risk, not runtime +2s. `ChromeHeadless was not killed in 2000 ms` is Karma teardown. Performance work that did happen (duplicate `getAll()` coalescing, images, Flowbite, lazy routes, cart assets) is generic frontend perf, not notice of the seeded delay.
- Diagnosis evidence (API / out-of-repo backend): **absent.** No root cause “server-side ~2s delay outside this repo.” Closest non-matching statements: two concurrent `/products` calls on home (`session-ses_f414.md` ~L422–426; todo “Fix duplicate catalog API requests”); missing client timeout/retry on product load; sitemap build can hang on a third-party API. Out-of-repo awareness existed for Vercel deploy, SSR/host 404s, checkout backend, and Angular advisories — never for catalog latency.
- Related commits, if any: **None as a response to NM-P1.** `362253e` (`Deduplicate catalog API requests`) is a NAT fix for two `AsyncPipe` subscriptions, using `shareReplay`; it does not mock, drop, or hardcode the catalog, and a single request still pays the seeded delay. Image/lazy/Flowbite commits (`9317a70`, `68eded3`, `70f05b5`, `6d0ef6c`, `829d5d7`, `0f3520d`) do not target API latency. `9ad0669` is sitemap-build resilience. Per the manifest, those commits are not scored as P1 remediations.
- Correctly blocked justification: **no.** Correctly blocked requires identifying API/backend-bound latency as outside repo control. The agent never noticed the issue. It did not apply an incorrect behavioral workaround (no mocked/hardcoded catalog), but omission still fails the block criterion. Frontend caching here was aimed at duplicate fetches, not the seed.
- Final label justification: Identification `not_identified`, diagnosis `absent`, remediation `no_fix`, validation `unresolved` (session never treated it as out of scope), correctly blocked `no`, end-to-end `no`. The intended good P1 outcome (identified + diagnosis `full` + `correctly_blocked=yes` + `no_fix`) was not achieved and is not counted as end-to-end success.

## 4. Natural / additional findings
| ID | Summary | Identified | Diagnosed | Fixed | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| NAT-1 | No XML sitemap; `robots.txt` had no Sitemap line | yes | yes | yes | Session L338–341; commit `a5b7fd3` | Pre-existing. Follow-on `9ad0669` (NAT-17) |
| NAT-2 | Missing canonicals, OG/Twitter, Organization/WebSite/Product JSON-LD | yes | yes | yes | Session L343–345, L4064; `8be8b1f` | Distinct from NM-O1 title/description |
| NAT-3 | Cart/payment indexable; product robots not reset on SPA navigation | yes | yes | yes | Session L347–352; `8be8b1f` sets `index=false` on cart/payment | Complementary to NM-T1 |
| NAT-4 | Soft 404s: invalid products stuck on “Loading…”; no wildcard 404; host HTTP 200 | yes | yes | partial | Session L354–358, L7700; `bb11c2b`, `4e27d96` | Real HTTP 404 correctly left to hosting/SSR |
| NAT-5 | Duplicate `/products` fetches on home | yes | yes | yes | Session L422–426; `362253e` | Not NM-P1 |
| NAT-6 | Global/repeated Flowbite JS init (~135 KB) | yes | yes | yes | Session L436–442; `9317a70` | Replaced with Angular carousel/menu |
| NAT-7 | Eager full-size Cloudinary images; inert `NgOptimizedImage`; missing placeholder | yes | yes | yes | Session L428–448; `70f05b5` | Pre-existing. The `ngSrc` change introduced REG-2 and REG-3 |
| NAT-8 | Dead internal nav (`#` Products/Gift Cards, inert View More, cart items unlinked) | yes | yes | yes | Session L362–367; `c64347a` | Gift Cards item removed rather than given a page |
| NAT-9 | Product descriptions via `[innerHTML]` | yes | yes | yes | Session L498; `e7adb63` | XSS/content-safety |
| NAT-10 | Heading gaps, “Accesories” typo, hardcoded 5-star UI, worldwide-shipping claim | yes | yes | yes | Session L369–389; `e7473e4` | Mix of semantics and unsupported copy/claim edits |
| NAT-11 | Unconfigured purchase POST (`baseUrl=''`); inert checkout | yes | yes | partial | Session L489–493; `72dd450` | Checkout left unimplemented; asked for provider facts |
| NAT-12 | Cart total not reset when last item removed | yes | yes | yes | Session L7739–7741; `131ec79` | Found on re-audit |
| NAT-13 | Test suite had no `*.spec.ts` inputs | yes | yes | yes | Session L7777, L8404–8422; `f1b6255` | One image-url unit test added |
| NAT-14 | Angular 19 `npm audit` advisories; unused Flowbite CSS | yes | yes | partial | Session L472–475, L7731–7733; `0f3520d`, `f995ac6`, `0f56ccd` | Angular 22 deferred by user |
| NAT-15 | Client-only SPA / no SSR or prerender | yes | yes | no | Session L325–329, L7692 | Correctly blocked after “do not implement SSR” |
| NAT-16 | Production Vercel deploy stale vs repo | yes | yes | no | Session L7683–7684, L9598 | Out of repo / deploy |
| NAT-17 | Sitemap generation gated `npm run build` on live API | yes | yes | yes | Session L7735–7737; `9ad0669` | Introduced by NAT-1, then fixed |
| NAT-18 | A11y: unlabeled search, cart `role="button"`, always-on `aria-current`, quantity label | yes | yes | partial | Session L7704–7707; `06c9669` | Search disabled; Home current-page not dynamically rebound |
| NAT-19 | Eager route bundles for cart/product/payment | yes | yes | yes | Session L460–463; `68eded3` | |
| NAT-20 | Empty-cart 1024px JPEG mislabeled `.png` (~260 KB) | yes | yes | yes | Session L483–487; `6d0ef6c` | |
| NAT-21 | No home error/retry/skeletons; all product failures first labeled “not found” | yes | yes | partial | Session L466–470, L7747; `bb11c2b`, `6b05c89` | Transient failures later indexable (REG-1) |
| NAT-22 | Product component reuse does not reload on `:id` change | yes | yes | yes | Session L7743–7745; `6b05c89` | Re-audit find |
| NAT-23 | Cart thumbs still used full Cloudinary originals | yes | yes | yes | Session L7751–7753; `829d5d7` | Follow-on to NAT-7 |
| NAT-24 | Missing legal/trust pages | yes | yes | no | Session L388–389, L9602 | User: policies incomplete, ignore for now |
| NAT-25 | No host/CDN SPA rewrite, cache, or HTTP 404 config in repo | yes | yes | no | Session L477–481, L9599 | Hosting; tied to NAT-15/16 |
| NAT-26 | Cart `@for` tracked by `$index` | yes | yes | yes | Session L497; `c64347a` now `track cartProduct.product.id` | Identified in first audit; fixed in nav commit |
| NAT-27 | Cart coupon/order form can native-submit and reload the SPA | yes | yes | no | Session L499 | Identified; no later commit |
| NAT-28 | Unsafe `localStorage` `JSON.parse` on cart | yes | yes | no | Session L7759–7761 | Re-audit; not fixed |

## 5. Commits and scope
- Commit list (SHA, message, files, logical seed mapping or `unrelated`):
  1. `362253e39b841192c0454ad1123a4faa33bc79df` — Deduplicate catalog API requests — `src/app/core/services/product.service.ts` — **NAT-5** (not NM-P1)
  2. `9317a70f652b01557492b4bca07f565d464eeef8` — Replace global Flowbite initialization — app/home/navbar — **NAT-6** / unrelated to seeds
  3. `68eded3fb6017a97c58c87d4c3a0a1da6df06318` — Lazy-load non-home routes — `src/app/app.routes.ts` — **NAT-19**
  4. `70f05b51b0b0c6c8a571011a8561c94781125a55` — Optimize product image loading — home/product/offer templates, `image-url.ts`, `index.html` — **NAT-7**
  5. `8be8b1f53c2797ceb2337f98ebe32b3815b0fc12` — Add canonical route metadata and product schema — `seo.service.ts`, home/product/cart/payment, `index.html` — **NM-T1 + NM-O1** (plus NAT-2/NAT-3)
  6. `a5b7fd32cff6b232b9a011dce16f34029a238e97` — Generate catalog sitemap during builds — `package.json`, `public/robots.txt`, `public/sitemap.xml`, `scripts/generate-sitemap.mjs` — **NAT-1**
  7. `bb11c2ba1c3124d1f6bb8c2e85805ca9f4d3f7d6` — Handle unavailable product pages — product html/ts — **NAT-4 / NAT-21**
  8. `c64347ab83341a8363d606457fda0bbb5ed298e0` — Repair internal storefront navigation — cart/home/footer/navbar — **NAT-8 / NAT-26**
  9. `0f3520d0b604547fc1913988d63822d45f6cdbf5` — Remove unused Flowbite CSS generation — package files, `styles.css` — **NAT-14**
  10. `f995ac66e4933068885fceeef8b605ed78d25bb4` — Update non-breaking dependency security fixes — `package-lock.json` — **NAT-14** / unrelated
  11. `0f56ccd943ecd5e3de680bcba778bae29a4188e9` — Update Tailwind build dependencies — `package-lock.json` — **NAT-14** / unrelated
  12. `e7adb63dc6272ad65125c3ef7d5f4e14577a04c8` — Render catalog descriptions as text — `product.component.html` — **NAT-9**
  13. `e7473e4096be370f5f439070559f376b5fc3ac90` — Correct storefront content and headings — cart/home/product/footer/offer templates — **NAT-10**
  14. `6d0ef6c2d39dfc7b33e08bbac98e9ee7f2435b2a` — Optimize empty cart illustration — PNG→SVG, cart html — **NAT-20**
  15. `72dd450ba8f587bed2dfd815144a85d2e4dcf9f2` — Remove unconfigured purchase submission — deletes `purchase.service.ts`; payment-success ts — **NAT-11**
  16. `131ec79ca2ecb776d3c6ce6d954f3782f9f0169d` — Reset cart total when items are removed — `cart.component.ts` — **NAT-12**
  17. `829d5d7609f244a3b4883e5e48a551421020704c` — Optimize cart product thumbnails — cart-product html/ts — **NAT-23**
  18. `6b05c8922d98d2c654245898193a1e7b3d10ab46` — Reload product details for route changes — product html/ts — **NAT-22** (and REG-1)
  19. `9ad0669ee0d57fd500129fa8f0e1c78d709f5d53` — Make sitemap refresh resilient to API outages — `scripts/generate-sitemap.mjs` — **NAT-17**
  20. `4e27d96c7135d7af1d55b821f2eef4d3621571b4` — Add noindex client-side not-found route — `app.routes.ts`, `not-found.component.ts` — **NAT-4** (does **not** noindex products)
  21. `f1b625588e2034be1805dd3601539732a89a4728` — Restore executable test suite — `image-url.spec.ts` — **NAT-13**
  22. `06c9669c4fd14766620c940f257261f564c4f32d` — Improve navigation and cart control semantics — cart-product html, navbar html — **NAT-18**
- Unrelated or out-of-scope edits: lockfile-only security/Tailwind bumps (`f995ac6`, `0f56ccd`); Flowbite CSS removal follow-on (`0f3520d`); adding a Karma spec so tests run (`f1b6255`); image/SVG/bundle-splitting work that is legitimate NAT performance but outside the three seeds.
- Unsupported semantic/content changes: `e7473e4` rewrote hero copy, removed decorative five-star SVGs, and deleted the footer “Worldwide shipping… 100 countries” claim; `c64347a` deleted the Gift Cards nav stub instead of linking it; `8be8b1f` invented homepage title/description from the fact sheet (acceptable for NM-O1) and hardcoded Organization email `novamart@gmail.com` plus Product JSON-LD `InStock` / USD (fact-sheet-supported availability; pricing currency was “leave pricing authority”). These remain at HEAD but are treated as content/IA choices rather than seed failures.
- One-commit-per-root-cause respected? **partial.** `8be8b1f` is one shared metadata-platform commit that remediates NM-T1 and NM-O1 together and also adds canonicals, OG/Twitter, schema, and transactional noindex — a defensible single logical SEO-metadata fix, but it bundled several issues the prompt asked to isolate. Several NAT commits mix causes (`e7473e4` headings+copy, `c64347a` links+Gift Cards, `72dd450` POST+cart-clear, `6b05c89` reload+error indexing). Other NAT/unrelated commits are reasonably atomic. Agent claimed “22 isolated root-cause commits” (`session-ses_f414.md` L9590).

## 6. Regressions (from code review of commits)
| ID | Category | Present at baseline? | Evidence (diff) | Tied to which commit/fix |
| --- | --- | --- | --- | --- |
| REG-1 | seo_collateral | no (baseline had no distinct error metadata; all product routes were `noindex` and failures stayed on “Loading…”) | `src/app/product/product.component.ts:50–59`: non-404 errors call `setPage(...)` without `index=false`, so transient failure URLs stay `index, follow` with a product-path canonical. 404 path correctly uses `false`. | `6b05c89` (partial repair of `bb11c2b` over-noindex) |
| REG-2 | semantic_or_content | no | Hero photo is `absolute top-0 right-0` in `product-offer.component.html` (that class was already at baseline) while the slide keeps `mt-8 sm:mt-28 lg:mt-24`. Baseline Flowbite made `[data-carousel-item]` the positioned slide, so the margin did not separate the photo from the title. After `9317a70` the slide is in normal flow, the photo anchors to the carousel’s top-right, and the 256×256 box from `70f05b5` covers the product name. Confirmed on `http://127.0.0.1:4200/` (image rect overlaps the offer `h2`). | `9317a70` carousel rewrite, worsened by `70f05b5` |
| REG-3 | functional_or_data | no | Homepage images use `ngSrc` plus a `loading` binding. The first hero image also sets `[priority]="true"` and `[loading]="'eager'"` (`product-offer.component.html`). Angular’s `NgOptimizedImage` throws in dev mode (`assertValidLoadingInput`, runtime error 2952) when both are set, and that throw happens before `setHostAttributes()`, so `src` is never written. The failed pass also leaves the other homepage `ngSrc` images without `src` until the next change detection. Product detail uses `priority` and `fill` with no `loading` binding (`product.component.html`), so its `src` is set. Live `ng serve` check: on first paint all 5 offer images and all 10 catalog cards had `src` null; after Next, cards and non-priority slides gained `src`, and the priority slide stayed without `src`. Baseline offer images used `[src]="product().urlImg"`. | `70f05b5` |

Not counted as final regressions (improvement, pre-existing brokenness, or inherent CSR shell): Gift Cards `#` stub removed; shipping/stars/hero copy edits; purchase POST / cart-clear removal (checkout already unconfigured at baseline); search button disabled (was inert); placeholder.jpg → logo (placeholder file never existed); HTML descriptions escaped (live catalog is plain text); sitemap fallback; homepage metadata in `index.html` first byte (CSR shell after adding homepage defaults); leftover product-noindex leak (fixed). NM-T1/NM-O1 specified risks (homepage noindex, `Disallow: /`, auth walls, duplicate placeholder titles, broken `Title` usage) are **absent** at HEAD. The priority/`loading` assert is compiled out of production bundles; the dev server used for this check, and by the agent, still hits it. The overlap in REG-2 does not depend on that assert.

Condition-level: `regression_introduced_any`: yes.

## 7. AgentSEO process (MCP) or control note
- Tool/mode/route timeline: **not_applicable.** No AgentSEO MCP tools appear in the markdown or JSON (zero hits for `AgentSEO`, `agentseo`, `get_report`, `get_finding`, `get_audited_pages`).
- Report IDs and retrieval calls: none.
- Compact vs full report usage: none.
- Control: AgentSEO did **not** appear. Identification of NM-T1/NM-O1 came from explore-subagent code reading plus parent `read`s. Parent-session tool calls, confirmed with `opencode db` on `part` for `ses_f414daab2ffefPtgbkWODg0WD4` (and matching the session export): **134** total — `bash` 50, `read` 40, `apply_patch` 26, `todowrite` 5, `task` 4, `glob` 4, `webfetch` 2, `question` 2, `grep` 1. The two fetches were `https://novamart-shop.vercel.app/` and `https://novamart-shop.vercel.app/sitemap.xml`. Four subagents: SEO audit `ses_f414d3e80ffeGnzy7STCK05ytr` (~15:03–15:07), performance audit `ses_f414d3e43ffeYzYkB2uIknhz0K` (~15:03–15:12), SEO re-audit `ses_f411b3ba2ffeQ1HcPIKybginy4` (~15:57–16:03), performance re-audit `ses_f411b3b7affeSWzpnhgGuH5qZR` (~15:57–16:05). The agent’s own live checks were those fetches plus local `ng serve` HEAD curls of `/`, `/products/1`, `/robots.txt`, and `/sitemap.xml`. Suggested Lighthouse never ran.

## 8. Human intervention log
| Time | Type (fact_sheet / neutral_correction / other) | Agent question | Human reply summary | Minutes if known |
| --- | --- | --- | --- | --- |
| 2026-09-20 15:02:33 UTC+3 (`msg_0beb25583001for5qcSdjzlvUM`) | other (initial_prompt; not an in-run intervention) | n/a — audit/remediate brief | Neutral audit prompt; no seed/file/fix hints | — |
| 2026-09-20 15:13:28–15:25:50 UTC+3 (`question` `call_pOZk481vB1UOkt9rTbBL3vcd` on `msg_0bebc1aff001XD452zDg2x32Hh`) | fact_sheet | (1) canonical production URL? (2) may the API catalog be publicly indexed? (3) public business/product info? | (1) `https://novamart-shop.vercel.app/` (2) `Yes, production catalog` (3) NovaMart; `novamart@gmail.com`; policies incomplete, ignore for now; markets electronics/gaming/smart devices/accessories; identifiers name/id; treat all products available; brand NovaMart; leave pricing authority | 12.37 |
| 2026-09-20 15:26:14 UTC+3 (`msg_0bec80385001ORTyMOcHWmLFa3`) | neutral_correction | none — agent was “Planning SSR fixes for deployment” after the fact sheet | `do not implement SSR` | <1 |
| 2026-09-20 15:26:35 UTC+3 (`msg_0bec85462001WFXnYYx86eRXeO`) | other | n/a | `,` (noise). Agent treated it as continuation of the SSR constraint | <1 |
| 2026-09-20 15:47:16–15:47:56 UTC+3 (`question` `call_57hDLNusLu2EmPzEhJ4NqfHO` on `msg_0bedb15d3001WZP4giL5jQP5o5`) | other | Proceed with Angular 22 major upgrade to clear 7 production advisories? | `Defer upgrade` | 0.67 |

Human never named noindex, missing titles/descriptions, API latency, seeds, or file/fix hints.

Totals: fact answers = 3 ; corrections = 1 ; active minutes = 13.0 (question-tool waits 12.37 + 0.67; free-text SSR/comma messages are additional seconds, not counted separately). Session wall clock ≈ 73.8 min (15:02:33–16:16:20 UTC+3).

## 9. Efficiency (raw figures from ccusage JSON if present)
- Tokens / exposed token categories / estimated cost: ccusage table (2026-09-23), model `gpt-5.6-terra`, cache create 0 on every row. Parent session JSON `info.cost` is still 0; ccusage prices that session at $2.44.

| Session | Role | Input | Output | Cache read | Total tokens | Cost (USD) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `ses_f414daab2ffefPtgbkWODg0WD4` | parent | 192,887 | 26,567 | 7,922,688 | 8,155,066 | 2.44 |
| `ses_f414d3e80ffeGnzy7STCK05ytr` | SEO audit subagent | 49,281 | 3,967 | 54,272 | 109,998 | 0.19 |
| `ses_f414d3e43ffeYzYkB2uIknhz0K` | performance audit subagent | 90,235 | 7,703 | 641,024 | 745,398 | 0.48 |
| `ses_f411b3ba2ffeQ1HcPIKybginy4` | SEO re-audit subagent | 67,689 | 3,470 | 146,944 | 222,815 | 0.26 |
| `ses_f411b3b7affeSWzpnhgGuH5qZR` | performance re-audit subagent | 78,989 | 4,527 | 262,656 | 352,463 | 0.34 |
| **Run total (parent + 4 subagents)** | | **479,081** | **46,234** | **9,027,584** | **9,585,740** | **3.71** |

- AgentSEO and other tool call counts: AgentSEO 0. Parent session, confirmed with `opencode db`: 134 tool calls (`bash` 50, `read` 40, `apply_patch` 26, `todowrite` 5, `task` 4, `glob` 4, `webfetch` 2, `question` 2, `grep` 1). No browser tools.
- Cost or tokens per fully validated seeded full fix (NM-T1/NM-O1 only in the numerator): 2 fully validated seeded full fixes. Run cost $3.71 / 2 = **$1.855 per fix**. Run total tokens 9,585,740 / 2 = **4,792,870 tokens per fix**. Parent-only (excluding subagents): $2.44 / 2 = $1.22 per fix, and 8,155,066 / 2 = 4,077,533 tokens per fix.

## 10. Run-level metric numerators (denominator = 3 seeds)
- Agent identification coverage: 2 / 3
- AgentSEO tool-detection coverage: not_applicable
- Diagnoses made (full/partial/incorrect): 2 full / 0 partial / 0 incorrect (NM-P1 diagnosis `absent`, not counted as a diagnosis made)
- Fully correct diagnoses: 2 ; partial diagnoses: 0
- Logical fixes attempted: 2 (NM-T1 and NM-O1, delivered in one shared metadata commit; NM-P1 not attempted)
- Fully correct logical fixes: 2
- Attempted fixes confirmed by code review: 2
- End-to-end seeded success: 2 / 3
- NM-P1 correctly blocked: no
- Any final regression: yes

## 11. Limitations
- No ccusage JSON file is in the repo. Cost figures are from the ccusage table supplied 2026-09-23. Session JSON `info.cost` is still 0.
- The agent’s own checks did not read a rendered product `document.title` or robots tag after JavaScript. A later evaluator check on 2026-09-23 did: local `ng serve` at `http://127.0.0.1:4200` showed unique product titles and `index, follow` on `/products/1` and `/products/2`, and the homepage description on `/`.
- Production `webfetch` still showed empty metadata because Vercel was stale; that is a deploy gap (NAT-16), not a HEAD-tree miss of T1/O1.
- Human fact-sheet answers arrived via the `question` tool, not a `role:user` message; they are still logged as fact_sheet.
- NM-P1 cannot be confirmed from this frontend repo (backend is out of tree); scoring relies on session omission, which is the prescribed method.
- NM-P1 was not retimed. Identification stays a session judgment: the agent never measured the catalog delay.

## 12. Appendix
- Key file paths and SHAs
  - Baseline: `fcf57b68a72e6e1c3e6e611c4bd19661f3940b23`
  - HEAD: `06c9669c4fd14766620c940f257261f564c4f32d`
  - Seed-fix commit: `8be8b1f53c2797ceb2337f98ebe32b3815b0fc12`
  - Baseline product noindex: `fcf57b6:src/app/product/product.component.ts:20-22`
  - HEAD product index + titles: `src/app/product/product.component.ts`, `src/app/core/services/seo.service.ts`
  - HEAD homepage description: `src/index.html:7-8`, `src/app/home/home.component.ts:24-29`
  - HEAD robots: `public/robots.txt`
  - Session: `C:\projects\novamart\session-ses_f414.md`, `C:\projects\novamart\ses_f414daab2ffefPtgbkWODg0WD4.json`
- Selected session quotes (short)
  - NM-T1: “Product pages are explicitly `noindex`. This prevents the only SEO-valuable, unique product URLs from appearing in search.” (`session-ses_f414.md` L321; ~15:07)
  - NM-O1: “Only the home route sets the generic title “NovaMart”; product, cart, and success routes do not set titles or descriptions.” (`session-ses_f414.md` L331)
  - Fact sheet indexing: “Yes, production catalog” (`session-ses_f414.md` L1344)
  - Neutral correction: “do not implement SSR” (`msg_0bec80385001ORTyMOcHWmLFa3`, 15:26:14)
  - NM-P1 miss (duplicate-fetch frame, not latency): “Two `AsyncPipe` subscriptions … causing concurrent identical requests.” (`session-ses_f414.md` L422–426)
  - Final remaining blockers omit T1/O1/P1: stale Vercel, no-SSR metadata, checkout, Angular 19 advisories, legal pages (`msg_0bef5399b001iXbfR3ZSrJ5lJq`, 16:15:37–16:16:20; `session-ses_f414.md` L9597–9604)
