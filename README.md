# Linkbreakers QR Code Styling
[![Version](https://img.shields.io/npm/v/linkbreakers-qr-code-styling.svg)](https://www.npmjs.com/package/linkbreakers-qr-code-styling)

**Battle-tested QR code designer maintained by [Linkbreakers](https://linkbreakers.com)**. We started with the fantastic
[`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) project, but our production needs quickly outgrew the original feature set. Today this fork includes
new dot shapes, additional corner styles, richer gradients, smarter image handling, and ergonomics that let us generate thousands of branded QR codes every week in both Node.js backends and modern front-ends.

---

## Why Linkbreakers built this fork
- We use QR codes everywhere—from marketing campaigns to onboarding flows—and needed a toolkit that could keep up with us.
- Running massive batches in Node.js demanded more control over memory usage, rendering speed, and streaming downloads.
- Designers asked for expressive shapes and fine-grained styling knobs to match any visual identity.
- Our customers expect consistent assets across dashboard previews, PDFs, and live pages, so the API must behave the same on the server and in the browser.

The result is a fork we actively maintain, document, and publish under the `linkbreakers-qr-code-styling` package name. If you want help building QR-driven experiences, [talk with us](https://linkbreakers.com).

---

## Feature highlights
- **More shapes & options** – `bubbly-dots`, `classy`, `classy-rounded`, `extra-rounded`, custom margins, enhanced corner squares/dots, and gradients everywhere.
- **Node.js friendly** – zero DOM assumptions, easy CommonJS/ESM usage, built-in helpers for streaming `canvas`, `svg`, or `png` output in workers or serverless jobs.
- **Front-end optimized** – tiny bundle, supports script-tag usage through `unpkg`, and plays nicely with React, Vue, Angular, Svelte, and plain JS widgets.
- **Logo-aware rendering** – automatic background clean-up behind images, blob embedding for safer SVG exporting, configurable margins, and CORS switches.
- **Production tooling** – TypeScript definitions, Jest tests, eslint, and a release process we rely on internally before publishing to npm.
- **Community compatible** – API remains backward-friendly with the upstream project, so most docs and tutorials continue to work.

See it in action at [qr-code-styling.com](https://qr-code-styling.com) — the same demo we use internally to prototype looks.

---

## Installation
```bash
npm install linkbreakers-qr-code-styling
# or
pnpm add linkbreakers-qr-code-styling
# or
yarn add linkbreakers-qr-code-styling
```

Need a no-build setup? Load the latest build directly:
```html
<script src="https://unpkg.com/linkbreakers-qr-code-styling@latest/lib/qr-code-styling.js"></script>
```

---

## Quick start
### Browser example
```html
<div id="qr"></div>
<script type="module">
  import QRCodeStyling from "https://unpkg.com/linkbreakers-qr-code-styling@latest/lib/qr-code-styling.esm.js";

  const qrCode = new QRCodeStyling({
    width: 320,
    height: 320,
    type: "svg",
    data: "https://linkbreakers.com",
    image: "https://linkbreakers.com/assets/logo.svg",
    dotsOptions: {
      color: "#2c2c33",
      type: "classy-rounded",
      gradient: {
        type: "linear",
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: "#8f93ff" },
          { offset: 1, color: "#00ffc8" }
        ]
      }
    },
    cornersSquareOptions: { type: "extra-rounded", color: "#111" },
    cornersDotOptions: { type: "bubbly-dots", color: "#8f93ff" },
    backgroundOptions: { color: "#fff" },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 16,
      hideBackgroundDots: true
    }
  });

  qrCode.append(document.getElementById("qr"));
  document.getElementById("download").onclick = () =>
    qrCode.download({ name: "linkbreakers-demo", extension: "png" });
</script>
<button id="download">Download QR</button>
```

### Node.js rendering
```js
import QRCodeStyling from "linkbreakers-qr-code-styling";
import { writeFile } from "node:fs/promises";

const qrCode = new QRCodeStyling({
  width: 512,
  height: 512,
  type: "png",
  data: JSON.stringify({ action: "invite", token: "abc123" }),
  dotsOptions: { type: "extra-rounded", color: "#101828" },
  backgroundOptions: { color: "transparent" }
});

const buffer = await qrCode.getRawData("png");
await writeFile("./invite.png", buffer);
```
This is the same API we call in background jobs to batch-generate QR codes for customer campaigns.

---

## Configuration overview
Every option supported upstream still works here, plus Linkbreakers-only enhancements that expose more shapes and gradients. Highlights:

| Option group | What you can control |
| --- | --- |
| `width`, `height`, `type`, `margin`, `shape` | Canvas size, file format (`svg`, `png`, `canvas`), margin handling, and experimental circle mode. |
| `qrOptions` | Access to the underlying `qrcode-generator` settings (error correction, mode, mask pattern, etc.). |
| `dotsOptions`, `cornersSquareOptions`, `cornersDotOptions` | Choose between `square`, `rounded`, `extra-rounded`, `classy`, `classy-rounded`, `bubbly-dots`, `dots`, and gradient mixes. |
| `backgroundOptions` | Solid colors or gradients that sit behind the QR pixels.
| `imageOptions` | Control image size, margins, CORS settings, background cleanup, and blob embedding for SVG exports.

Dive into [`src/core/options`](src/core/options) for full TypeScript definitions or skim the original documentation for deeper descriptions—the APIs are compatible.

---

## Built by Linkbreakers
We help teams deliver high-converting, trackable QR codes at scale. This repository powers:
- Dashboard previews served from React/Next.js apps.
- Bulk PDF exports assembled on our Node.js workers.
- On-demand QR generation tucked into landing pages, kiosks, and in-store signage.

If your organization needs similar infrastructure or wants custom features, reach out at [linkbreakers.com](https://linkbreakers.com). Sponsorships and commercial support help us keep this fork moving quickly.

---

## Community & support
- Issues and feature requests: [github.com/linkbreakers-com/qr-code-styling/issues](https://github.com/linkbreakers-com/qr-code-styling/issues)
- Security reports: security@linkbreakers.com
- General chat: hi@linkbreakers.com

Contributions are welcome! Open a PR with your idea, or start a discussion so we can align on the approach. ❤️
