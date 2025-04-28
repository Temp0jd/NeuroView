// static/js/portrait.js

(function () {
    const BASE = window.location.pathname.split('/').slice(0,-1).join('/') + '/';
    const tooltip = document.getElementById("tooltip");
  
    function fetchAndRender(regionName) {
      $.ajax({
        url: BASE + "api/portrait_studies",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ region: regionName }),
        success: function (studies) {
          renderResults(studies);
        }
      });
    }
  
    function renderResults(studies) {
      const totalSamples = studies.reduce((a, s) => a + (parseInt(s.Sample_Number) || 0), 0);
      const datasetCount = new Set(studies.map(s => s.Dataset_Link).filter(Boolean)).size;
  
      document.getElementById("summary-box").innerHTML = `
        <div>Articles: <span style="color:#2c5eff">${studies.length}</span></div>
        <div>Datasets: <span style="color:#2c5eff">${datasetCount}</span></div>
        <div>Samples: <span style="color:#2c5eff">${totalSamples}+ </span></div>
      `; 
  
      document.getElementById("study-list").innerHTML = studies.map(s => `
        <div class="study-item">
          <div>
            <a class="title" href="${s.Publication_Link}" target="_blank">${s.Title}</a>
            <div class="meta">${(s.Journal || "") + (s.Year_of_Publication ? ` · ${s.Year_of_Publication}` : "")}</div>
          </div>
          <div><a class="dataset-link" href="${s.Dataset_Link}" target="_blank">Dataset</a></div>
        </div>`).join("");
  
      const panel = document.getElementById("results-panel");
      panel.style.display = "block";
      panel.scrollIntoView({ behavior: "smooth" });
    }
  
    function showTooltip(e, regionName) {
      tooltip.innerHTML = `<strong>${regionName}</strong>`;
      tooltip.style.display = "block";
      moveTooltip(e);
    }
  
    function moveTooltip(e) {
      tooltip.style.left = `${e.pageX + 12}px`;
      tooltip.style.top = `${e.pageY + 12}px`;
    }
  
    function hideTooltip() {
      tooltip.style.display = "none";
    }
  
    document.querySelectorAll(".region").forEach(el => {
      const regionName = el.dataset.region;
      el.addEventListener("click", () => fetchAndRender(regionName));
      el.addEventListener("mouseenter", (e) => { el.classList.add("active"); showTooltip(e, regionName); });
      el.addEventListener("mousemove", moveTooltip);
      el.addEventListener("mouseleave", () => { el.classList.remove("active"); hideTooltip(); });
    });
  })();
  