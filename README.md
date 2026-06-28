# Codex Plugin Marketplace Guide

A static Chinese guide to the Codex Marketplace plugin catalog.

The generated `index.html` explains the locally synced Codex Marketplace plugin list in Chinese, with search and filters for category, installed cache status, skill-backed plugins, and write-capable plugins.

## Read Online

- Website: https://jimweaver.github.io/codex-plugin-marketplace-guide/

## Contents

- `index.html` - self-contained static website for the 180-plugin guide
- `skills.html` - local SKILL.md document index (auto-generated snapshot)
- `build_codex_plugin_marketplace_guide.js` - generator script used to rebuild the page from a local Codex Marketplace sync

## Regenerate

Run from a machine with a local Codex plugin sync at `~/.codex/.tmp/plugins`:

```bash
node build_codex_plugin_marketplace_guide.js
```

The script writes both `index.html` (plugin catalog) and `skills.html` (local skills index) into the repo.

## Data Scope

This page reflects the local Marketplace sync available when it was generated. The live Marketplace may add, remove, or change plugins over time.

Website updates are applied from the `main` branch and rendered directly by GitHub Pages.
