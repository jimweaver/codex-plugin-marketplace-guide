# Codex Plugin Marketplace Guide

A static Chinese guide to the Codex Marketplace plugin catalog.

The generated `index.html` explains the locally synced Codex Marketplace plugin list in Chinese, with search and filters for category, installed cache status, skill-backed plugins, and write-capable plugins.

## Read Online

- Website: https://jimweaver.github.io/codex-plugin-marketplace-guide/
- PDF: https://jimweaver.github.io/codex-plugin-marketplace-guide/codex-plugin-marketplace-guide.pdf

## Contents

- `index.html` - self-contained static website for the 180-plugin guide
- `build_codex_plugin_marketplace_guide.js` - generator script used to rebuild the page from a local Codex Marketplace sync
- `build_pdf_source.js` - creates a print-oriented HTML source from `index.html`
- `codex-plugin-marketplace-guide.pdf` - PDF reading version for GitHub Pages

## Regenerate

Run from a machine with a local Codex plugin sync at `~/.codex/.tmp/plugins`:

```bash
node build_codex_plugin_marketplace_guide.js
```

The script writes `codex-plugin-marketplace-guide.html` to `/home/jim/Desktop` in the original local workflow. For this repo, copy or adapt the output to `index.html`.

To rebuild the PDF source:

```bash
node build_pdf_source.js
```

Then export `codex-plugin-marketplace-guide-pdf-source.html` to `codex-plugin-marketplace-guide.pdf` with LibreOffice or another HTML-to-PDF tool.

## Data Scope

This page reflects the local Marketplace sync available when it was generated. The live Marketplace may add, remove, or change plugins over time.
