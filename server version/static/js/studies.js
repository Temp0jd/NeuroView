// static/js/studies.js

$(document).ready(function () {
    const BASE = window.location.pathname.split('/').slice(0, -1).join('/') + '/';
    let currentPage = 1;
    let itemsPerPage = 5;
    let allStudies = [];
  
    // 页面加载时拉取全部数据
    $.get(BASE + "api/get_studies", function (data) {
      allStudies = data;
      renderCards(allStudies);
    });
  
    function renderCards(data) {
      const container = $(".card-container");
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = currentPage * itemsPerPage;
      const visibleData = data.slice(startIndex, endIndex);
  
      container.empty();
      if (visibleData.length === 0) {
        container.append("<p>No studies found.</p>");
      } else {
        visibleData.forEach(study => {
          const regionTags = [];
          if (study.Region) regionTags.push(study.Region);
          if (study.Subregion) regionTags.push(study.Subregion);
  
          container.append(`
            <div class="study-card">
              <h3 onclick="window.open('${study.Publication_Link}')">
                <span class="tag">${study.Journal || ""}</span>
                ${study.Title || "Untitled"}
              </h3>
              <div class="year">
                Lifestage: ${study.Lifestage || ""} | Samples: ${study.Sample_Number || ""}
              </div>
              <p>${study.Summary || "No summary available."}</p>
              <div class="tags">
                ${study.Species ? `<span class="tag clickable-tag" data-field="species" data-tag="${study.Species}">${study.Species}</span>` : ""}
                ${study.Seq_Type? `<span class="tag clickable-tag" data-field="seq" data-tag="${study.Seq_Type}"> ${study.Seq_Type}</span>` : "" }
                ${regionTags.map(r => `<span class="tag clickable-tag" data-field="region" data-tag="${r}">${r}</span>`).join("")}
                ${study.Focus ? `<span class="tag clickable-tag" data-field="focus" data-tag="${study.Focus}">${study.Focus}</span>` : ""}
                ${study.Year_of_Publication ? `<span class="tag clickable-tag" data-field="year" data-tag="${study.Year_of_Publication}">${study.Year_of_Publication}</span>` : ""}
              </div>
              <a class="link" href="${study.Dataset_Link}" target="_blank">View Dataset →</a>
            </div>
          `);
        });
      }
      updatePagination(data.length);
    }
  
    function updatePagination(totalItems) {
      if (totalItems > itemsPerPage) {
        $("#pagination").html(`
          <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
          <span> Page ${currentPage} of ${Math.ceil(totalItems / itemsPerPage)} </span>
          <button id="nextPage" ${currentPage * itemsPerPage >= totalItems ? 'disabled' : ''}>Next</button>
        `);
      } else {
        $("#pagination").empty();
      }
    }
  
   
    function getFilters() {
      const filters = {};
      $(".filter-tag input, .search-box input").each(function () {
        const key = $(this).data("key");      
        const val = $(this).val().trim();
        if (val) filters[key] = val;
      });
      return filters;          
      }

  
    function applyFilters() {
      const filters = getFilters();
      $.ajax({
        url: BASE + "api/filter_studies",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(filters),
        success: function (data) {
          allStudies = data;
          currentPage = 1;
          renderCards(allStudies);
        }
      });
    }
  
    $(".filter-tag input").on("input", applyFilters);
    $(".search-box button").on("click", applyFilters);
  
    $(document).on("click", "#clearFilters", function () {
      $(".filter-tag input").val("");
      $(".search-box input").val("");
      applyFilters();
    });
  
    $(document).on("click", ".clickable-tag", function () {
      const tagText = $(this).data("tag");
      const field = $(this).data("field");
  
      $(".filter-tag").each(function () {
    const label = $(this).text().trim().split(" ")[0].toLowerCase();
    if (label === field) {
      const $input = $(this).find("input");
      
      if ($input.val().trim() === tagText) {
        $input.val("");
      } else {
      
        $input.val(tagText);
      }
    }
  });
      
      
      currentPage = 1;
      applyFilters();
    });
  
    $(document).on("click", "#prevPage", function () {
      if (currentPage > 1) {
        currentPage--;
        renderCards(allStudies);
      }
    });
  
    $(document).on("click", "#nextPage", function () {
      if (currentPage * itemsPerPage < allStudies.length) {
        currentPage++;
        renderCards(allStudies);
      }
    });
  
    $("#downloadCSV").on("click", function () {
      const params = new URLSearchParams(getFilters()).toString();
      window.location.href = BASE + `api/download_csv?${params}`;
    });
  });
  