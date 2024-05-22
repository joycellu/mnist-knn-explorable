// Load MNIST dataset and KNN model
let mnistData;
let knnClassifier = ml5.KNNClassifier();
let color, stroke;
let activeLine;
const colorElement = document.getElementById('color');
const strokeElement = document.getElementById('stroke');
const clear = document.getElementById('clear');
const eraser = document.getElementById('eraser');
const svg = d3.select('#svg');
const dfltColor = colorElement.options[colorElement.selectedIndex].value;
const dfltStroke = strokeElement.options[strokeElement.selectedIndex].value;

async function loadMnist() {
    try {
        const response = await fetch('mnist_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        mnistData = await response.json();
        console.log("MNIST data loaded:", mnistData);

        mnistData.training.input.forEach((input, index) => {
            knnClassifier.addExample(input, mnistData.training.label[index]);
        });
        console.log("MNIST data added to KNN classifier");
    } catch (error) {
        console.error("Error loading MNIST data:", error);
    }
}

loadMnist();

console.log(mnistData)

colorElement.onchange = (event) => {
    color = event.target.value;
    cursor('pencil');
}

strokeElement.onchange = (event) => {
    stroke = event.target.value;
}

clear.onclick = () => {
    svg.selectAll("*").remove();
}

eraser.onclick = () => {
    color = 'white';
    cursor('eraser');
}

svg.on('click', click);

function click() {
    const coords = d3.mouse(this);

    svg.append('circle')
        .attr('cx', coords[0])
        .attr('cy', coords[1])
        .attr('r', stroke ? (stroke / 2) : (dfltStroke / 2))
        .style('fill', color ? color : dfltColor)
}

const renderPath = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveBasis);

svg.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

cursor('pencil', 30);

function dragstarted() {
    activeLine = svg.append("path").datum([]).attr("class", "line").style('stroke', color ? color : dfltColor).style('stroke-width', stroke ? stroke : dfltStroke);
    activeLine.datum().push(d3.mouse(this));
}

function dragged() {
    activeLine.datum().push(d3.mouse(this));
    activeLine.attr("d", renderPath);
}

function dragended() {
    activeLine = null;
}

function cursor(icon, size, color = 'black') {
    $('#svg').cursor(icon, {
        color: color,
        size: size,
        hotspot: 'center'
    })
}

// Classify the drawn digit
function classifyDigit() {
    getImageDataFromSVG().then(imageData => {
        let input = preprocessImage(imageData);
        knnClassifier.classify(input, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            displayResults(result);
        });
    });
}

// Get image data from SVG
function getImageDataFromSVG() {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    const svgString = new XMLSerializer().serializeToString(svg.node());
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    return new Promise(resolve => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
        };
    });
}

// Preprocess image data to match MNIST format
function preprocessImage(imageData) {
    let data = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        data.push(imageData.data[i] / 255);
    }
    return data;
}

// Display classification results
function displayResults(result) {
    document.getElementById('prediction').innerText = `Predicted Digit: ${result.label}`;
    drawBarChart(result.confidencesByLabel);
}

// Draw bar chart for classification confidence using D3.js
function drawBarChart(data) {
    d3.select("#bar-chart").selectAll("*").remove();

    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    let width = 500 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    let svg = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let x = d3.scaleBand()
        .range([0, width])
        .domain(Object.keys(data))
        .padding(0.1);

    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);

    svg.selectAll(".bar")
        .data(Object.entries(data))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))
        .attr("height", d => height - y(d[1]));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2},${height + margin.bottom})`)
        .style("text-anchor", "middle")
        .text("Digits");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Confidence");
}

// Update the value of k
function updateKValue(value) {
    document.getElementById('k-value-display').innerText = value;
    knnClassifier.k = value;
}

// Set initial k value
knnClassifier.k = 3;

// Load MNIST data
loadMnist();
