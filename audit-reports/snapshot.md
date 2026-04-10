# Performance Snapshot

## Budgets
- Desktop LCP: <= 2500 ms (PASS)
- Desktop CLS: <= 0.10 (PASS)
- Mobile LCP: <= 3000 ms (PASS)
- Mobile CLS: <= 0.10 (PASS)

## Medians
| Device | Median LCP | Median CLS | Result |
| :--- | :--- | :--- | :--- |
| Desktop | 93 ms | 0.00 | PASS |
| Mobile | 1231 ms | 0.00 | PASS |

## Insights Captured
- **LCPBreakdown**: Desktop is text-based and sub-100ms. Mobile shows significant render delay (~1.2s) under Slow 4G/4x CPU emulation.
- **RenderBlocking**: Mobile LCP could be improved by ~514ms by optimizing render-blocking resources.
- **ThirdParties**: `swiper-element-bundle.min.js` (jsdelivr) is the primary third-party resource.
- **DocumentLatency**: Server response (TTFB) is excellent (~30ms) on localhost.
