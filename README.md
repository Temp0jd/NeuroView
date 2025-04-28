# NeuroView

NeuroView is a web-based platform for exploring and visualizing brain-region multi-omics datasets through an intuitive, interactive interface.

---

## Features

- **Home**: Central hub linking to core modules
- **Studies**: Searchable, filterable cards displaying study metadata (species, region, sequencing type, etc.) with CSV export
- **Portrait**: Clickable anatomical brain atlas highlighting region-specific studies
- **Data Viewer**:
  - **JS Version**: Loads static JSON/JS files to render UMAP embeddings for selected regions
  - **Server Version**: Queries a database for embeddings and metadata, producing live Plotly.js visualizations

---

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Visualization**: Plotly.js
- **Data**: Static JSON/CSV (JS prototype), relational database (server deployment)

---

## Setup & Requirements

1. **Clone the repo**
   ```bash
   git clone https://github.com/Temp0jd/NeuroView.git
   cd NeuroView
   ```

2. **Install dependencies**
   - A `requirements.txt` file should list all Python packages (e.g., Flask, pandas, Scanpy, SQLAlchemy, python-dotenv).
   - To install:
     ```bash
     pip install -r requirements.txt
     ```

3. **Database initialization** (server version)
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

4. **Run the app**
   ```bash
   python app.py
   ```

5. **Access**
   Open `http://127.0.0.1:5000/home` in your browser.

---

## Future Improvements

- Allow user uploads of custom datasets (CSV/loom)
- Add dropdown selectors for atlas, feature, cell type
- Extend support for spatial transcriptomics and differential expression modules

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

Questions or contributions? Contact **Xinyu Li** at <tempojd@bu.edu>.

