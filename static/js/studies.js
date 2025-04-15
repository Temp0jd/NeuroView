// static/js/studies.js

$(document).ready(function () {
  const allStudies = [
    {
      id: "GSE174332",
      title: "Cell states in esophageal adenocarcinoma (snRNA-seq)",
      year: 2019,
      doi: "https://doi.org/10.1234/example1",
      link: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE174332",
      summary: "Study on clinical stages of EAC using single-nucleus RNA-seq, covering tumor microenvironments and differentiation states.",
      tags: ["Esophageal adenocarcinoma", "Human", "snRNA-seq", "Adrenal gland"]
    },
    {
      id: "GSE200123",
      title: "scATAC-seq atlas of retinal pigment epithelium",
      year: 2022,
      doi: "https://doi.org/10.1234/example2",
      link: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE200123",
      summary: "scATAC-seq profiling of retinal development and degeneration, identifying cell-type-specific chromatin landscapes.",
      tags: ["Macular degeneration", "Human", "scATAC-seq", "Eye"]
    }
  ];

  let currentPage = 1;
  const itemsPerPage = 5;

  function highlight(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function renderCards(data) {
    const container = $(".card-container");
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const visibleData = data.slice(0, endIndex);

    container.empty();
    if (visibleData.length === 0) {
      container.append("<p>No studies found.</p>");
    } else {
      visibleData.forEach(study => {
        container.append(`
          <div class="study-card">
            <h3 onclick="window.open('${study.doi}')">${highlight(study.title, getSearchTerm())}</h3>
            <div class="dataset-id">${highlight(study.id, getFilter('Dataset'))}</div>
            <div class="year">${study.year}</div>
            <p>${highlight(study.summary, getSearchTerm())}</p>
            <div class="tags">
              ${study.tags.map(t => `<span class="tag clickable-tag" data-tag="${t}">${highlight(t, getSearchTerm())}</span>`).join('')}
            </div>
            <a class="link" href="${study.link}" target="_blank">View Dataset →</a>
          </div>
        `);
      });
    }

    if (endIndex < data.length) {
      if (!$("#loadMoreBtn").length) {
        $("#pagination").html('<button id="loadMoreBtn">Load More</button>');
      }
    } else {
      $("#pagination").empty();
    }
  }

  function getFilter(label) {
    let value = "";
    $(".filter-tag").each(function () {
      const field = $(this).text().split("\n")[0].trim();
      if (field === label) {
        value = $(this).find("input").val().trim().toLowerCase();
      }
    });
    return value;
  }

  function getSearchTerm() {
    return $(".search-box input").val().trim().toLowerCase();
  }

  function applyFilters() {
    const search = getSearchTerm();
    const filters = {};
    $(".filter-tag").each(function () {
      const key = $(this).text().split("\n")[0].trim();
      const val = $(this).find("input").val().trim().toLowerCase();
      if (val) filters[key] = val;
    });

    const result = allStudies.filter(study => {
      const searchMatch =
        study.title.toLowerCase().includes(search) ||
        study.summary.toLowerCase().includes(search);

      const filterMatch = Object.entries(filters).every(([key, val]) => {
        return (
          study.id.toLowerCase().includes(val) ||
          study.year.toString().includes(val) ||
          study.tags.some(tag => tag.toLowerCase().includes(val))
        );
      });

      return searchMatch && filterMatch;
    });

    currentPage = 1;
    renderCards(result);
  }

  $(document).on("click", "#loadMoreBtn", function () {
    currentPage++;
    applyFilters();
  });

  $(".filter-tag input").on("input", applyFilters);
  $(".search-box button").on("click", applyFilters);

  $(document).on("click", ".clickable-tag", function () {
    const tagText = $(this).data("tag");
    const tagMap = {
      "Human": "Species",
      "Mouse": "Species",
      "snRNA-seq": "Seq Type",
      "scATAC-seq": "Seq Type",
      "Eye": "Region",
      "Adrenal gland": "Region"
    };
    const field = tagMap[tagText] || "Conditions";
    let matchedInput;
    $(".filter-tag").each(function () {
      const label = $(this).text().split("\n")[0].trim();
      if (label === field) {
        matchedInput = $(this).find("input");
        let currentVal = matchedInput.val().trim();
        let values = currentVal.split(/,\s*/).filter(Boolean);
        const idx = values.findIndex(v => v.toLowerCase() === tagText.toLowerCase());
        if (idx > -1) {
          values.splice(idx, 1);
          $(this).find("input").val(values.join(", "));
          $(".clickable-tag[data-tag='" + tagText + "']").removeClass("tag-active");
        } else {
          values.push(tagText);
          $(this).find("input").val(values.join(", "));
          $(".clickable-tag[data-tag='" + tagText + "']").addClass("tag-active");
        }
      }
    });
    currentPage = 1;
    applyFilters();
  });

  renderCards(allStudies);
});