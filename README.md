# The Persist Foundation — Website

Static one-page site for The Persist Foundation (*Until I Succeed!*).

## Structure
- `index.html` — page markup (hero, about, programs, values, get involved, donate, contact)
- `styles.css` — styles, using the colors from the TPF seal
- `script.js` — mobile menu, scroll animations, donation picker, contact form
- `assets/` — seal logo, favicon, social preview image

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` and go to http://localhost:8000.

## Before launch
- Replace `info@thepersistfoundation.org` (in `index.html` and `script.js`) with the real address.
- Connect the donate form to a payment provider (see the `TODO` in `script.js`).
- Review the placeholder copy: mission, programs, values and quote.
