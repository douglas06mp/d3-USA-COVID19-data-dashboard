function createLine(width, height) {
  const line = d3.select('#line').attr('width', width).attr('height', height);

  line.append('g').classed('x-axis', true);

  line.append('g').classed('y-axis', true);

  line
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('font-size', '1em')
    .classed('y-axis-label', true);

  line
    .append('text')
    .attr('x', width / 2)
    .attr('y', '1em')
    .style('text-anchor', 'middle')
    .style('font-size', '1em')
    .classed('line-title', true);
}

function drawLine(data, dataType, state) {
  //SETUP
  const line = d3.select('#line');

  const padding = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 110,
  };

  const width = +line.attr('width');
  const height = +line.attr('height');

  let stateData = data
    .filter((d) => d.state === state)
    .map((d) => {
      return {
        ...d,
        date: d3.timeParse('%Y-%m-%d')(d.date),
      };
    });

  //SCALE AND AXIS
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(stateData, (d) => d.date))
    .range([padding.left, width - padding.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(stateData, (d) => d[dataType])])
    .range([height - padding.bottom, padding.top]);

  const xAxis = d3.axisBottom(xScale);
  d3.select('.x-axis')
    .attr('transform', `translate(0,${height - padding.bottom})`)
    .transition()
    .duration(1000)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  d3.select('.y-axis')
    .attr('transform', `translate(${padding.left},0)`)
    .transition()
    .duration(1000)
    .call(yAxis);

  //UPDATE
  let update = line.selectAll('.line').data([stateData], (d) => d[dataType]);

  const path = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d[dataType]))
    .curve(d3.curveBasis);

  update
    .enter()
    .append('path')
    .classed('line', true)
    .merge(update)
    .transition()
    .duration(1000)
    .ease(d3.easeCircleOut)
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', '#333')
    .attr('stroke-width', '5px');

  //UPDATE TEXT
  let yLabel = state ? `Number of ${dataType}` : '';
  d3.select('.y-axis-label').text(yLabel);

  let title = state
    ? `COVID-19 trends in ${state}`
    : 'Click on a state to see trends';
  d3.select('.line-title').text(title);
}
