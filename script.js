const project = "D3 scatter plot"; // coded by Larrick.

let w = 800;
let h = 400;

let svgCont = d3.
select(".svgcont").
append("svg").
attr("width", w + 100).
attr("height", h + 50);

let tooltip = d3.
select(".svgcont").
append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);

var timeFormat = d3.timeFormat("%M:%S");

d3.json(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
(err, data) => {
  if (err) return console.error(err);

  svgCont.
  append("text").
  attr("transform", "rotate(-90)").
  attr("x", -200).
  attr("y", 20).
  text("Times in Minutes");

  let years = data.map(year => year.Year);
  let yMin = d3.min(years);
  let yMax = d3.max(years);

  let xScale = d3.scaleLinear().domain([yMin, yMax]).range([0, w]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  xScale.nice();

  svgCont.
  append("g").
  attr("id", "x-axis").
  attr("class", "x-axis").
  call(xAxis).
  attr("transform", "translate(60," + (h + 5) + ")");

  data.forEach(function (d) {
    d.Place = +d.Place;
    let split = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, split[0], split[1]);
  });

  let yScale = d3.
  scaleTime().
  domain(d3.extent(data, d => d.Time)).
  range([0, h]);

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svgCont.
  append("g").
  call(yAxis).
  attr("class", "y-axis").
  attr("id", "y-axis").
  attr("transform", "translate(60, 5)");

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  let circle = svgCont.selectAll(".dot").data(data).enter().append("circle");

  let circles = circle.
  attr("class", "dot").
  attr("cx", d => xScale(d.Year)).
  attr("cy", d => yScale(d.Time)).
  attr("r", 6).
  attr("transform", "translate(60, 7)").

  attr("fill", d => {
    return color(d.Doping != "");
  }).
  attr("data-xvalue", d => d.Year).
  attr("data-yvalue", d => d.Time.toISOString()).
  on("mouseover", function (d) {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.attr("data-year", d.Year);
    tooltip.
    html(
    d.Name +
    ": " +
    d.Nationality +
    "<br/>" +
    "Year: " +
    d.Year +
    ", Time: " +
    timeFormat(d.Time) + (
    d.Doping ? "<br/><br/>" + d.Doping : "")).

    style("left", d3.event.pageX - 175 + "px").
    style("top", d3.event.pageY - 28 + "px");
  }).
  on("mouseout", function (d) {
    tooltip.transition().duration(200).style("opacity", 0);
  });

  let legendCont = svgCont.append("g").attr("id", "legend");
  let legend = legendCont.
  selectAll("#legend").
  data(color.domain()).
  enter().
  append("g").
  attr("class", "legend-label").
  attr("transform", function (d, i) {
    return "translate(0," + (h / 2 - i * 20) + ")";
  });

  legend.
  append("rect").
  attr("x", w - 18).
  attr("width", 18).
  attr("height", 18).
  style("fill", color);

  legend.
  append("text").
  attr("x", w - 24).
  attr("y", 9).
  attr("dy", ".35em").
  style("text-anchor", "end").
  text(function (d) {
    if (d) return "Riders with doping allegations";else
    {
      return "No doping allegations";
    }
  });
});