# NeuroView

NeuroView is a simple web-based brain sample exploration platform developed to fulfill the core requirements of my BF768 project proposal.

## Purpose

The aim of this project is to build a modular and interactive interface for exploring brain region datasets. It aligns directly with the proposal’s goals, including:

- Displaying structured metadata
- Filtering by multiple biological attributes
- Interactive visualization of selected brain regions
- Linking dataset summaries with external references

## Current Features

- **Home Page**: Navigation hub linking to major modules
- **Studies Page**:
  - Dataset cards (title, summary, tags, dataset ID)
  - Filter panel with search inputs by species, region, seq type, etc.
  - Keyword search and dynamic card filtering (JavaScript-enabled)
- **Portrait Page**:
  - Brain image with clickable regions
  - Region-based navigation to the Data Viewer
- **Data Viewer**:
  - Accepts `region` as URL parameter
  - Displays placeholder UMAP-style plot for selected brain region

## Tech Stack

- Flask (Python)
- HTML / CSS / JavaScript
- Plotly.js (for visualization)
- Static JSON (used as initial data source)

## Future Work

- Integrate real dataset values and expression matrices
- Add dropdowns (Atlas, Feature, Cell Type)
- Support dataset detail pages and dynamic linking

## Run Locally

```bash
python app.py
```

Then visit `http://127.0.0.1:5000` in your browser.
