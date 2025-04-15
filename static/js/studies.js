// static/js/studies.js
$(document).ready(function () {
    const allStudies = [
      {
        id: "GSE174332",
        title: "Cell states in esophageal adenocarcinoma (snRNA-seq)",
        summary: "Study on clinical stages of EAC using single-nucleus RNA-seq, covering tumor microenvironments and differentiation states.",
        tags: ["Esophageal adenocarcinoma", "Human", "snRNA-seq", "Adrenal gland"]
      },
      {
        id: "GSE200123",
        title: "scATAC-seq atlas of retinal pigment epithelium",
        summary: "scATAC-seq profiling of retinal development and degeneration, identifying cell-type-specific chromatin landscapes.",
        tags: ["Macular degeneration", "Human", "scATAC-seq", "Eye"]
      }
    ];
  
    function renderCards(data) {
      const container = $(".card-container");
      container.empty();
      if (data.length === 0) {
        container.append("<p>No studies found.</p>");
      } else {
        data.forEach(study => {
          container.append(`
            <div class="study-card">
              <h3>${study.title}</h3>
              <div class="dataset-id">${study.id}</div>
              <p>${study.summary}</p>
              <div class="tags">
                ${study.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
              <a class="link" href="/studies/${study.id}">View Dataset &rarr;</a>
            </div>
          `);
        });
      }
    }
  
    function applyFilters() {
      const search = $(".search-box input").val().toLowerCase();
      const filters = {};
      $(".filter-tag").each(function () {
        const label = $(this).contents().get(0).nodeValue.trim();
        const value = $(this).find("input").val().trim().toLowerCase();
        if (value) filters[label] = value;
      });
  
      const result = allStudies.filter(study => {
        const searchMatch =
          study.title.toLowerCase().includes(search) ||
          study.summary.toLowerCase().includes(search);
  
        const filterMatch = Object.entries(filters).every(([key, val]) =>
          study.tags.some(tag => tag.toLowerCase().includes(val))
        );
  
        return searchMatch && filterMatch;
      });
  
      renderCards(result);
    }
  
    $(".search-box button").on("click", applyFilters);
    $(".filter-tag input").on("input", applyFilters);
  
    renderCards(allStudies);
  });