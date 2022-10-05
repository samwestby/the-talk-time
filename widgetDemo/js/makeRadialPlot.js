var margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3
  .select("#radialChart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Outer circle
svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", "100px")
  .attr("fill", "none")
  .attr("stroke", "black");

transcriptData = [];
participants = {};
participantList = [];

data = d3
  .csv(
    "./data/Bdb001.csv",
    (d) => {
      return {
        start: d.start,
        end: +d.end,
        participant: d.participant,
      };
    },
    (d) => {
      transcriptData.push(d);
      if (!participants[d.participant]) {
        participantList.push(d.participant);
        participants[d.participant] = [];
        participants[d.participant].push({
          start: d.start,
          end: d.end,
        });
      } else {
        participants[d.participant].push({
          start: d.start,
          end: d.end,
        });
      }
    }
  )
  .then(() => {
    plotCenterOfMass(svg, participants);
  });

function plotCenterOfMass(svg, participants) {
  svg.selectAll("*").remove();
  time = document.getElementById("atTime").value;
  var centerOfMass = {
    x: 0,
    y: 0,
  };
  var masses = {};
  for (var participant in participants) {
    var participantData = participants[participant];
    masses[participant] = 0;
    for (var i = 0; i < participantData.length; i++) {
      if (participantData[i].start <= time && participantData[i].end <= time) {
        masses[participant] +=
          participantData[i].end - participantData[i].start;
      }
    }
  }
  var positions = {};
  for (i = 0; i < participantList.length; i++) {
    positions[participantList[i]] = {
      x: Math.cos((i * 2 * Math.PI) / participantList.length) * 100,
      y: Math.sin((i * 2 * Math.PI) / participantList.length) * 100,
    };
  }

  for (var participant in participants) {
    centerOfMass.x += positions[participant].x * masses[participant];
    centerOfMass.y += positions[participant].y * masses[participant];
  }
  totalMass = 0;
  for (var participant in masses) {
    totalMass += masses[participant];
  }
  if (totalMass > 0) {
    centerOfMass.x /= totalMass;
    centerOfMass.y /= totalMass;
  } else {
    centerOfMass.x = 0;
    centerOfMass.y = 0;
  }

  // draw lines from participant to center of mass
  for (var participant in positions) {
    svg
      .append("line")
      .attr("x1", positions[participant].x + width / 2)
      .attr("y1", positions[participant].y + height / 2)
      .attr("x2", centerOfMass.x + width / 2)
      .attr("y2", centerOfMass.y + height / 2)
      .attr("stroke", "black")
      .attr("stroke-width", "1px");
    var i = participantList.indexOf(participant);
    svg
      .append("circle")
      .attr("cx", positions[participantList[i]].x + width / 2)
      .attr("cy", positions[participantList[i]].y + height / 2)
      .attr("r", "20px")
      .attr("stroke", "black")
      .attr("fill", function (d) {
        return d3.schemeCategory10[i];
      });
    // text label for the participant
    svg
      .append("text")
      .attr("x", positions[participantList[i]].x + width / 2)
      .attr("y", positions[participantList[i]].y + height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .attr("fill", "white")
      .text(participantList[i]);
  }

  svg
    .append("circle")
    .attr("cx", centerOfMass.x + width / 2)
    .attr("cy", centerOfMass.y + height / 2)
    .attr("r", "10px")
    .attr("stroke", "black");
}
