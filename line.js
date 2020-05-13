function createLine(width, height) {
  const line = d3.select('#line').attr('width', width).attr('height', height);

  //AXIS
  line.append('g').classed('x-axis', true);
  line.append('g').classed('y-axis', true);

  //Y LABLE
  line
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('font-size', '1em')
    .classed('y-axis-label', true);

  //TITLE
  line
    .append('text')
    .attr('x', width / 2)
    .attr('y', '1em')
    .style('text-anchor', 'middle')
    .style('font-size', '1em')
    .classed('line-title', true);

  //FOCUS
  line
    .append('g')
    .append('circle')
    .classed('focus', true)
    .style('fill', 'steelblue')
    .attr('r', 8.5)
    .style('opacity', 0);

  const focusText = line.append('g').classed('focusText', true);

  focusText.append('text').classed('textDate', true);

  focusText.append('text').classed('textVal', true).attr('dy', '1.2em');

  d3.selectAll('.textDate, .textVal')
    .attr('text-anchor', 'middle')
    .attr('aligment-baseline', 'middle')
    .style('opacity', 0);

  line
    .append('rect')
    .classed('focusRect', true)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height);
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
    .attr('stroke', 'steelblue')
    .attr('stroke-width', '3');

  //UPDATE TEXT
  let yLabel = state ? `Number of ${dataType}` : '';
  d3.select('.y-axis-label').text(yLabel);

  let title = state
    ? `COVID-19 trends in ${state}`
    : 'Click on a state to see trends';
  d3.select('.line-title').text(title);

  //FOCUS
  const bisect = d3.bisector((d) => d.date).left;

  d3.select('.focusRect')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

  //FOCUS FUNCTION
  function mouseover() {
    d3.select('.focus').style('opacity', 1);
    d3.selectAll('.textDate, .textVal').style('opacity', 1);
  }

  function mousemove() {
    let x = xScale.invert(d3.mouse(this)[0]);
    let index = bisect(stateData, x, 1);
    let selectedData = stateData[index];

    d3.select('.focus')
      .attr('cx', xScale(selectedData.date))
      .attr('cy', yScale(selectedData[dataType]));

    d3.selectAll('.textDate, .textVal')
      .attr('x', xScale(selectedData.date) - (index < 15 ? -50 : 50))
      .attr('y', yScale(selectedData[dataType]) - (index < 15 ? 25 : 20));

    d3.select('.textDate').text(`
        Date: ${d3.timeFormat('%b %d')(selectedData.date)}
      `);

    d3.select('.textVal').text(`
        ${capitalize(dataType)}: ${selectedData[dataType]}
      `);
  }

  function mouseout() {
    d3.select('.focus').style('opacity', 0);
    d3.selectAll('.textDate, .textVal').style('opacity', 0);
  }
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
