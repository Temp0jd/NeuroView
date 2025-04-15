
function applyFilters() {
    const filters = {
        species: document.getElementById("species").value,
        region: document.getElementById("region").value,
        condition: document.getElementById("condition").value
    };

    fetch("/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(data => {
        updateTable(data);
        plotData(data);
    });
}

function updateTable(data) {
    let html = "<table border='1'><tr><th>ID</th><th>Species</th><th>Region</th><th>Condition</th><th>Expression</th></tr>";
    data.forEach(d => {
        html += `<tr>
            <td>${d.id}</td>
            <td>${d.species}</td>
            <td>${d.region}</td>
            <td>${d.condition}</td>
            <td>${d.expression}</td>
        </tr>`;
    });
    html += "</table>";
    document.getElementById("result-table").innerHTML = html;
}
