function createPie(width, height) {
  const pie = d3.select('#pie').attr('width', width).attr('height', height);

  pie
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2 + 10})`)
    .classed('chart', true);

  pie
    .append('text')
    .attr('x', width / 2)
    .attr('y', '1em')
    .attr('font-size', '1.5em')
    .attr('text-anchor', 'middle')
    .classed('pie-title', true);
}

function drawPie(data, date, dataType) {
  //SETUP
  const pie = d3.select('#pie');

  const arcs = d3
    .pie()
    .sort((a, b) => {
      if (getRegion(a.state) < getRegion(b.state)) return -1;
      if (getRegion(a.state) > getRegion(b.state)) return 1;
      return a[dataType] - b[dataType];
    })
    .value((d) => d[dataType]);

  const path = d3
    .arc()
    .outerRadius(+pie.attr('height') / 2 - 30)
    .innerRadius(0);

  //COLORSCALE BY REGION
  const colorScale = d3
    .scaleOrdinal()
    .domain(Object.keys(groupStatebyRegion))
    .range(['#ed972d', '#7e57c2', '#26a69a', '#42a5f5']);

  //UPDATE PIE AND TITLE
  const dateData = data.filter((d) => d.date === date);

  let update = pie.select('.chart').selectAll('.arc').data(arcs(dateData));

  update.exit().remove();

  update
    .enter()
    .append('path')
    .classed('arc', true)
    .merge(update)
    .attr('stroke', '#dff1ff')
    .attr('stroke-width', '0.25px')
    .attr('fill', (d) => {
      let region = getRegion(d.data.state);
      return colorScale(region);
    })
    .attr('d', path);

  pie
    .select('.pie-title')
    .text(`Total ${dataType} by state and region, ${date}`);
}
