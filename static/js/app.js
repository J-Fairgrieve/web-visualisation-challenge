// Read the json file with d3
 let data = d3.json("data/samples.json").then((sampleData) => {
    // Create a variable for "names" & load data
    function loadNames(names) {
        for (let i = 0; i < names.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = names[i];
            document.getElementById('selDataset').appendChild(opt);
        };
    };

    // Load the data & charts
    loadNames(sampleData.names);
    loadMetaData();
    createBar(document.getElementById('selDataset').value);
    createBubble(document.getElementById('selDataset').value);
    createGauge(document.getElementById('selDataset').value);

    // Create the drop-down functionality, reload data when a new value is selected
    document.getElementById('selDataset').onchange = function optionChanged() {
        loadMetaData();
        createBar(document.getElementById('selDataset').value);
        createBubble(document.getElementById('selDataset').value);
        createGauge(document.getElementById('selDataset').value);
    };

    // Update the demographic table
    function loadMetaData() {
        let index = document.getElementById('selDataset').value;
        // Generate the data for the table & add it in
        document.getElementById('sample-metadata').innerHTML = "";
        for (const [key, value] of Object.entries(sampleData.metadata[index])) {
            let str = document.createElement('h5')
            str.innerHTML = `${key}: ${value}`
            document.getElementById('sample-metadata').appendChild(str);
        };
    };

    // Bar chart creation
    function createBar(index) {
        // Grab the top ten bacterias in the selected sample & create chart
        let sample = sampleData.samples[index];
        let xAxis = sample.sample_values;
        let yAxis = [];
        let hoverText = sample.otu_labels;
        for (let i = 0; i < sample.otu_ids.length; i++) {
            yAxis.push("OTU " + sample.otu_ids[i])
        };
        // Create bar chart
        let hBar = [{
            type: 'bar',
            x: xAxis.slice(0, 10).reverse(),
            y: yAxis.slice(0, 10).reverse(),
            orientation: 'h',
            text: hoverText.slice(0, 10).reverse()
        }];
        let layout = {
            showlegend: false
        };
        Plotly.newPlot("bar", hBar, layout);
    };

    // Create the bubble chart
    function createBubble(index) {
        let sample = sampleData.samples[index];
        let bubble = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids
            },
            text: sample.otu_labels
        }];
        let layout = {
            showlegend: false
        };
        Plotly.newPlot('bubble', bubble, layout);
    };

    // Create the gauge
    function createGauge(index) {
        let sample = sampleData.samples[index];
        // Gauge value = avg. sample value / 100
        let sum = 0;
        for (let i = 0; i < sample.sample_values.length; i++) {
            sum += sample.sample_values[i];
        };
        let avg = sum / sample.sample_values.length / 4;
        var data = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: avg,
                title: {text: "Belly Button Washing Frequency"},
                gauge: {
                    axis: { range: [0, 10] },
                    bar: { color: "gray", opacity: 0.6 },
                    bgcolor: "white",
                    bordercolor: "black",
                    steps: [
                        { range: [0, 2], color: "red" },
                        { range: [2, 4], color: "orange" },
                        { range: [4, 6], color: "yellow" },
                        { range: [6, 8], color: "yellowgreen" },
                        { range: [8, 10], color: "green" }
                    ],
                }
            }            
        ];
        var layout = {
            margin: { t: 50, r: 50, l: 50, b: 50 }
        };
        Plotly.newPlot('gauge', data, layout);
    };
});