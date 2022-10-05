data = [];

margin = { top: 20, right: 30, bottom: 30, left: 40 };
var w = 400;
var h = 300;
var barHeight = 20;

var svg_ = d3
  .select("#brokenBarPlot")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "svg");

var topPadding = 50;
var sidePadding = 50;

loader = d3
  .csv("./data/Bdb001.csv", (d) => {
    data.push(d);
  })
  .then(() => {
    var uniqueParticipants = [];
    for (var i = 0; i < data.length; i++) {
      if (uniqueParticipants.indexOf(data[i].participant) === -1) {
        uniqueParticipants.push(data[i].participant);
      }
    }
    // replace empty string with unknown
    uniqueParticipants = uniqueParticipants.map((d) => {
      if (d === "") {
        return "unknown";
      } else {
        return d;
      }
    });

    let yScale = d3
      .scaleBand()
      .range([h - margin.bottom, margin.top])
      .domain(uniqueParticipants);
    let xScale = d3
      .scaleLinear()
      .range([margin.left, w - margin.right])
      .domain([data[0].start, data[data.length - 1].end]);
    let colorScale = d3
      .scaleOrdinal()
      .domain(uniqueParticipants)
      .range([
        "#4e79a7",
        "#f28e2c",
        "#e15759",
        "#76b7b2",
        "#59a14f",
        "#edc949",
        "#af7aa1",
        "#ff9da7",
        "#9c755f",
        "#bab0ab",
      ]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
    xAxis.tickFormat(function (d) {
      return new Date(d * 1000).toISOString().substring(11, 19);
    });

    makeRects(svg_, data, xScale, yScale, colorScale);

    svg_
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (h - topPadding + 20) + ")")
      .call(xAxis); 

    svg_
      .append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);
  });

function makeRects(svg, data, xScale, yScale, colorScale) {
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.start) + 10;
    })
    .attr("y", function (d) {
      return yScale(d.participant);
    })
    .attr("width", function (d) {
      return xScale(d.end) - xScale(d.start);
    })
    .attr("height", barHeight)
    .attr("fill", function (d) {
      return colorScale(d.participant);
    });
}
