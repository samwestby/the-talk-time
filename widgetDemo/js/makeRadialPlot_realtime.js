// credit to https://d3-graph-gallery.com/graph/circular_barplot_basic.html
// credit to https://stackoverflow.com/questions/63884609/d3-js-radial-barplot-with-bars-as-lines 


// initials = ['a','b','c'];
// stp = [30,60,10];
d3.text('data/stps.txt', function(dataP) {
  params = dataP.split("\r\n")
  initials = params[0].split(",")
  // Speaking Time Percentages
  stp = params[1].split(",").map(Number)



var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 1920 - margin.left - margin.right,
    height = 1080 - margin.top - margin.bottom
 
var svg = d3
  .select("#radialChart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


  const heightExtent = d3.extent(stp)
  const bars = []
  for (i=0; i<initials.length; i++){
    bars[i] = i;
  }
  // const bars = Array.from({length:stp.length},function (v,k) {return k})
  
  const containerWidth = width
  const containerHeight = height
  const barWidth = 60
  const radius = Math.min(containerWidth / 2, containerHeight / 2) - barWidth * 4;
  
  const y = d3.scaleLinear()
    .domain([0, heightExtent[1]])
    .range([0, radius])
  
  const angle = d3.scaleBand()
    .domain(bars)
    .range([0, 360])
    .paddingInner(0.02)
    .paddingOuter(0)
  
  const colourScale = d3.scaleOrdinal(d3.schemeCategory10)
    
  const percentageBars = svg.selectAll('rect').data(stp)
  
  percentageBars.enter().append('rect')
    .attr('x', - barWidth / 2)
    .attr('y', barWidth * 2)
    .attr('width', barWidth)
    .attr('height', function (d, i) { return y(d) })
    .style('-webkit-transform', function (d, i) {
      return  "translate("+containerWidth / 2+"px, "+containerHeight / 2+"px) rotate("+angle(i)+"deg)" 
    })
    .style('-webkit-backface-visibility', 'hidden')
    .attr('fill', function (d, i) {
         return colourScale(i)})
  


  var elem = svg.selectAll("g myCircleText").data(stp)

  var nameBubbles = elem.enter()
        .append("g")
        .attr("class", "name-bubbles")


  const bubbles = nameBubbles.append('circle')
      .attr("cx", 0)
      .attr("cy", function (d, i) { return y(d) + barWidth*2})
      .attr("r", barWidth)
      .attr("fill", function (d, i) { return colourScale(i)})
      .style('transform', function (d, i) {
        return  "translate("+containerWidth / 2+"px, "+containerHeight / 2+"px) rotate("+angle(i)+"deg)" 
      })
   

  const names = nameBubbles.append('text')
      // .attr('x', -barWidth / 4)
      .style('text-align', "center")
      .style('text-anchor', 'middle')
      // .style('font-weight', 'bold')
      .style('font-weight', 1000)
      .style('font-size', barWidth*1.5)
      .style('fill', 'white')
      .style('font-family', 'Courier New')
      .style('transform', function (d, i) {
          const xBase = containerWidth / 2;
          const yBase = containerHeight / 2;
          
          const degrees = angle(i);
          const radians = (degrees + 90) / 360 * 2 * Math.PI;
          const barHeight = y(stp[i]) + barWidth*2;
      
          const yOffset = Math.sin(radians) * barHeight + barWidth/3;
          const xOffset = Math.cos(radians) * barHeight;
      
          return "translate("+(xBase + xOffset)+"px, "+(yBase + yOffset)+"px)";
        })
        .text(function (d, i) { return initials[i]}) //stp[i] + '%'

      // Outer circle
  svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", height/2)
  .attr("fill", "none")
  .attr("stroke", "black");

svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", barWidth*2+5)
  .attr("fill", "black");


});
