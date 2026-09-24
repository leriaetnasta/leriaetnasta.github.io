# This site

## How this portfolio is built
This site is an Angular 21 single-page application using standalone components, signals and
NgRx for state. All copy lives in JSON locale files, so the English and French versions come
from the same build and the language switches at runtime without a reload. The illustrations
in the Selected work section are hand-written inline SVG that adapt to light and dark themes.
It is deployed to GitHub Pages by a GitHub Actions workflow that runs the tests, builds with the
right base path and publishes on every push to main.

## How this assistant is built
The assistant is a Cloudflare Worker calling Workers AI, kept on free tiers. It answers only
from a fact sheet generated at build time from the same locale files this site renders, so the
assistant and the page can never disagree. The Worker checks the request origin, rate limits by
visitor, validates the input and streams the reply back as server-sent events. If it is
unavailable, rate limited or out of daily quota, the widget quietly falls back to a keyword
matcher in the browser, so a visitor always gets an answer.
