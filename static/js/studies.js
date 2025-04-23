// static/js/studies.js

$(document).ready(function () {
  // 当前页码 / Current page index
  let currentPage = 1;
  // 每页显示数量 / Number of cards per page
  let itemsPerPage = 5;

  // 清除按钮点击事件 / Clear all filters and search
  $(document).on("click", "#clearFilters", function () {
    $(".filter-tag input").val(""); // 清空所有输入框 / Clear inputs
    $(".search-box input").val(""); // 清空搜索框 / Clear search box
    $(".clickable-tag").removeClass("tag-active"); // 取消激活标签 / Unhighlight tags
    currentPage = 1;
    applyFilters(); // 重新过滤 / Apply filters again
  });

  // 高亮关键词 / Highlight matched text
  function highlight(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // 渲染卡片函数 / Render visible study cards
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
        // 拼接区域与子区域标签 / Combine Region and Subregion tags
        for (let i = 1; i <= 3; i++) {
          const region = study["Region" + i];
          const subregion = study["Subregion" + i];
          if (region || subregion) {
            regionTags.push(`${region || ""}${subregion ? " - " + subregion : ""}`);
          }
        }

        // 添加研究卡片 HTML / Append study card HTML
        container.append(`
          <div class="study-card">
            <h3 onclick="window.open('${study["DOI/Publication Link"]}')">
              <span class="tag journal-tag">${study["Journal"]}</span>
              ${highlight(study["Publication title"], getSearchTerm())}
            </h3>
            <div class="year">Lifestage: ${study["Lifestage"]} | Cells: ${study["Cell number"]} | Samples: ${study["Sample number"]}</div>
            <p>${highlight(study["Summary"], getSearchTerm())}</p>
            <div class="tags">
              ${study["Species"] ? `<span class="tag clickable-tag" data-field="Species" data-tag="${study["Species"]}">${study["Species"]}</span>` : ""}
              ${study["Seq type"] ? `<span class="tag clickable-tag" data-field="Seq type" data-tag="${study["Seq type"]}">${study["Seq type"]}</span>` : ""}
              ${regionTags.map(region => `<span class="tag clickable-tag" data-field="Region" data-tag="${region}">${region}</span>`).join("")}
              ${study["Focus"] ? `<span class="tag clickable-tag" data-field="Focus" data-tag="${study["Focus"]}">${study["Focus"]}</span>` : ""}
              ${study["Year of Publication"] ? `<span class="tag clickable-tag" data-field="Year" data-tag="${study["Year of Publication"]}">${study["Year of Publication"]}</span>` : ""}
            </div>
            <a class="link" href="${study["Dataset Link"]}" target="_blank">View Dataset →</a>
          </div>
        `);
      });
    }

    // 分页显示 / Pagination logic
    if (data.length > itemsPerPage) {
      $("#pagination").html(`
        <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
        <span> Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)} </span>
        <button id="nextPage" ${currentPage * itemsPerPage >= data.length ? 'disabled' : ''}>Next</button>
      `);
    } else {
      $("#pagination").empty();
    }
  }

  // 获取筛选器对应字段值 / Get user input filter
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

  // 获取搜索关键词 / Get global search keyword
  function getSearchTerm() {
    return $(".search-box input").val().trim().toLowerCase();
  }

  // 应用筛选逻辑 / Apply filters and re-render
  function applyFilters() {
    const search = getSearchTerm();
    const filters = {};

    // 收集所有筛选器值 / Collect all filter box values
    $(".filter-tag").each(function () {
      const key = $(this).text().split("\n")[0].trim().toLowerCase();
      const val = $(this).find("input").val().trim().toLowerCase();
      if (val) filters[key] = val;
    });

    // 键映射到字段 / Mapping between label and data fields
    const fieldMap = {
      "species": "Species",
      "seq type": "Seq type",
      "focus": "Focus",
      "journal": "Journal",
      "year": "Year of Publication",
      "region": ["Region1", "Region2", "Region3", "Subregion1", "Subregion2", "Subregion3"]
    };

    // 主筛选逻辑 / Main filtering loop
    const result = allStudies.filter(study => {
      const searchMatch =
        (study["Publication title"] || "").toLowerCase().includes(search) ||
        (study["Summary"] || "").toLowerCase().includes(search);

      const filterMatch = Object.entries(filters).every(([key, val]) => {
        const mapped = fieldMap[key];
        if (!mapped) return true;
        if (Array.isArray(mapped)) {
          return mapped.some(f => (study[f] || "").toString().toLowerCase().includes(val));
        } else {
          return (study[mapped] || "").toString().toLowerCase().includes(val);
        }
      });

      return searchMatch && filterMatch;
    });

    renderCards(result);
  }

  // 加载更多按钮（暂未启用）/ Load more functionality (not used)
  $(document).on("click", "#loadMoreBtn", function () {
    currentPage++;
    applyFilters();
  });

  // 当用户输入筛选条件时自动应用过滤 / Live filter on input change
  $(".filter-tag input").on("input", applyFilters);
  $(".search-box button").on("click", applyFilters);

  // 标签点击添加筛选条件 / Tag click to toggle filter
  $(document).on("click", ".clickable-tag", function () {
    const tagText = $(this).data("tag");
    const field = $(this).data("field");

    $(".filter-tag").each(function () {
      const label = $(this).text().split("\n")[0].trim();
      if (label === field) {
        const $input = $(this).find("input");
        let values = $input.val().split(/,\s*/).filter(Boolean);
        const idx = values.findIndex(v => v.toLowerCase() === tagText.toLowerCase());

        if (idx > -1) {
          values.splice(idx, 1);
          $input.val(values.join(", "));
          $(`.clickable-tag[data-tag="${tagText}"][data-field="${field}"]`).removeClass("tag-active");
        } else {
          values.push(tagText);
          $input.val(values.join(", "));
          $(`.clickable-tag[data-tag="${tagText}"][data-field="${field}"]`).addClass("tag-active");
        }
      }
    });

    currentPage = 1;
    applyFilters();
  });

  // 上一页 / Previous page
  $(document).on("click", "#prevPage", function () {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });

  // 下一页 / Next page
  $(document).on("click", "#nextPage", function () {
    currentPage++;
    applyFilters();
  });

  // 页面加载后初始化显示全部 / Initial load
  renderCards(allStudies);
});
