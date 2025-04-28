
function plotData(data) {
    const x = data.map(d => d.region + " (" + d.species + ")");
    const y = data.map(d => d.expression);

    const trace = {
        x: x,
        y: y,
        type: "bar"
    };

    Plotly.newPlot("plot", [trace], {
        title: "Expression Level by Region",
        xaxis: { title: "Region (Species)" },
        yaxis: { title: "Expression Level" }
    });
}
