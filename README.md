# NeuroView

**NeuroView** is a web‑based platform for exploring and visualizing brain‑region multi‑omics datasets through a clean, interactive interface.

---

## Key Features

| Module                                                                                           | Highlights                                              |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **Home**                                                                                         | Acts as a central hub linking to all core pages         |
| **Studies**                                                                                      | • Search and multi‑filter study cards                   |
| • Export any filtered subset to CSV                                                              |                                                         |
| **Portrait**                                                                                     | Interactive brain atlas                                 |
| • Hover for quick statistics                                                                     |                                                         |
| • Click to filter studies by region                                                              |                                                         |
| **Data Viewer**                                                                                  | • Client‑side (JS) version loads static UMAP JSON files |
| • Server version queries a database for embeddings and metadata, rendering dynamic Plotly charts |                                                         |

---

## Project Structure

```text
C:.
|   LICENSE
|   README.md
|   requirements.txt
|
+---JS version_old
|   |   app.py
|   |
|   +---static
|   |   |   style.css
|   |   |
|   |   +---img
|   |   |       brain_portrait.png
|   |   |
|   |   \---js
|   |           plot.js
|   |           studies.js
|   |           studies_data.js
|   |
|   \---templates
|           help.html
|           index.html
|           portrait.html
|           studies.html
|           viewer.html
|
\---server version
    |   home.py
    |
    +---Database table
    |       Dataset_202504301019.csv
    |       Dataset_Region_202504301019.csv
    |       Publication_202504301019.csv
    |       Publication_Dataset_202504301019.csv
    |       Region_202504301019.csv
    |       Subregion_202504301019.csv
    |
    +---static
    |   +---css
    |   |       style.css
    |   |
    |   +---data
    |   |       Adult_Cerebellum_umap.json
    |   |       Adult_Corpus_callosum_umap.json
    |   |       Adult_Limbic_system_umap.json
    |   |       Adult_Medulla oblongata_umap.json
    |   |       Adult_Midbrain_umap.json
    |   |       Adult_Pons_umap.json
    |   |       Adult_Prefrontal_cortex_umap.json
    |   |       Adult_Spinal_cord_umap.json
    |   |
    |   +---img
    |   |       brain_portrait.png
    |   |
    |   \---js
    |           portrait.js
    |           studies.js
    |           viewer.js
    |
    \---templates
            help.html
            home.html
            portrait.html
            studies.html
            viewer.html
```

---

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Temp0jd/NeuroView.git
   cd NeuroView
   ```
2. **Create a virtual environment and install dependencies**

   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the JS prototype

```bash
cd "JS version_old"
python app.py            # serves static JSON‑based viewer at http://127.0.0.1:5000/
```

### Running the server version (Flask + database)

```bash
cd "server version"
flask --app home run     # or python home.py
```

> Ensure the MariaDB credentials in `home.py` are correct and the tables above are loaded.

---

## Data Organisation

* **UMAP files** must follow the naming pattern `Adult_<RegionSnakeCase>_umap.json` and be placed in `static/data/`.
* Composite regions (for example, *Brainstem*) are configured in `static/js/viewer.js` with the list of member files.

---

## Roadmap

* Upload custom datasets (CSV/Loom) through the web interface.
* Dropdown selectors for atlas, features and cell types in the data viewer.
* Integrate spatial transcriptomics layers and differential expression analysis.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

Created and maintained by **Xinyu Li**. For questions, please reach out at [tempojd@bu.edu](mailto:tempojd@bu.edu).
