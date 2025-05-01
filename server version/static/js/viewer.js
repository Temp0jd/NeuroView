/* static/js/viewer.js
 * 自动按 “Adult_<RegionSnakeCase>_umap.json” 规则加载 UMAP 数据
 * 兼容中文 / 英文脑区名，URL 写自然空格即可
 */
(function () {
    /* ---------- 工具函数 ---------- */
    const $ = sel => document.querySelector(sel);
    const getParam = k => new URLSearchParams(location.search).get(k);
  
    /* ---------- 1. 解析 region ---------- */
    const regionRaw = getParam('region') || 'Spinal cord';   // 默认 spinal cord
    $('#viewer-title').textContent = `Region: ${regionRaw}`;
  
    /* ---------- 2. region ➜ snake_case ---------- */
    // “Prefrontal cortex” → “Prefrontal_cortex”
    const regionSnake = regionRaw.trim()
                                  .replace(/\s+/g, '_')      // 空格 → _
                                  .replace(/[()]/g, '');     // 去掉括号等可能字符
    const filePath = `/static/data/Adult_${regionSnake}_umap.json`;
  
    /* ---------- 3. fetch + Plotly ---------- */
    $('#plot').textContent = 'Loading UMAP…';
    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error(`找不到文件 ${filePath}`);
        return res.json();
      })
      .then(drawPlot)
      .catch(err => $('#plot').textContent = err.message);
  
    function drawPlot(data) {
      const x  = data.map(d => +d.x);
      const y  = data.map(d => +d.y);
      const cls = data.map(d => d.cell_type || 'Unknown');
  
      Plotly.newPlot('plot', [{
        x, y,
        mode  : 'markers',
        type  : 'scattergl',
        text  : cls,
        marker: { size: 5, opacity: 0.8, color: cls, showscale: false }
      }], {
        title : `UMAP – ${regionRaw}`,
        margin: { t: 40 },
        xaxis : { title: 'UMAP-1' },
        yaxis : { title: 'UMAP-2' }
      });
    }
  })();
  