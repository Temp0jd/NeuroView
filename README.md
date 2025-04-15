🧠 NeuroView
A simple brain sample exploration web app
(Built to fulfill the goals of my bioinformatics project proposal)

📌 What is this?
This is a lightweight web project I’m building to explore brain region data interactively — kind of inspired by BrainAtlas and Single Cell Portal. It’s built using Flask for the backend, with clean front-end pages in HTML/CSS and some JavaScript for interactivity.

The goal of this project is to fulfill the functional requirements defined in my project proposal, including metadata filtering, dataset exploration, anatomical visualization, and expression data viewer.

✅ What I’ve done so far:
Home Page: Clean landing page with logo and 4 big navigation bubbles (Studies, Portrait, Data Viewer, Help).

Studies Page:

Card-style layout for each dataset

Multi-tag filters (species, region, seq type, etc.)

A top search bar for fuzzy keyword search

JS handles live filtering and rendering

Portrait Page:

Brain anatomy image with clickable regions

Click a region → opens Data Viewer for that part of the brain

Data Viewer Page:

Reads ?region= from the URL

Displays a placeholder UMAP-style scatter plot using Plotly

Designed to show expression/feature plots for a brain region

📄 How it maps to my proposal:
Proposal Requirement	Status
Metadata filtering and display	✅ Implemented in Studies page with filters and live search
Dataset overview (cards, search)	✅ Done with dynamic cards + dataset ID
Region-based navigation	✅ Portrait page with clickable regions
Interactive visualization	✅ Data Viewer with region-based plotting
Modular, expandable pages	✅ Each module (Studies, Viewer, etc.) is cleanly separated

⚙️ Tech Stack
Python + Flask

HTML + CSS (custom)

JavaScript + Plotly.js

No database yet — just static JSON for now

🛠 What’s next?
Add dropdowns for Atlas / Cell type / Feature

Load actual data dynamically

Support for dataset detail pages like /studies/GSExxxxx