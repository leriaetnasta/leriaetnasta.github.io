# Assistant knowledge

Anything you write here is added to what the CV assistant is allowed to answer from.
Your `public/i18n/*.json` copy is already included automatically; these files are for the
detail that doesn't belong on the page.

## How it works

- One `##` heading starts one fact; everything under it is that fact's text.
- Write in **English only**. The assistant answers in the visitor's language regardless,
  so you don't need a French copy.
- Sections still containing `TODO` are skipped, so you can fill these in gradually.
- `npm run knowledge --prefix worker` regenerates the bundle; the deploy does it for you.

## What to keep out

- Client names and anything under NDA.
- Anything you wouldn't want a stranger to read. Every word here can be quoted back to a visitor.
