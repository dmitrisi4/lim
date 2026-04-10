# Quality Audit

## Lighthouse Scores
| Category | Desktop | Mobile |
| :--- | :--- | :--- |
| Accessibility | 94 | 94 |
| Best Practices | 100 | 100 |
| SEO | 91 | 91 |

## Critical Issues
1. **Missing `lang` attribute**: The `<html>` element does not have a `[lang]` attribute. This impacts both SEO and screen readers.
2. **Missing `apple-touch-icon`**: Mobile users won't see a high-quality icon when adding to home screen.
3. **Favicon 404**: `/favicon.ico` is missing.

## Recommendations
- Add `<html lang="en">` (or dynamic based on user set language).
- Provide a `favicon.ico` and `apple-touch-icon.png`.
- Ensure all interactive elements have sufficient color contrast.
