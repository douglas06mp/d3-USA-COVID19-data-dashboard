d3.queue()
  .defer(d3.json, './data/states-10m.json')
  .defer(d3.csv, './data/us-states.csv', (row) => {
    return {
      date: row.date,
      state: row.state,
      cases: +row.cases,
      deaths: +row.deaths,
    };
  })
  .await((err, mapData, data) => {
    if (err) throw err;

    //SETUP
    dateArr = [...new Set(data.map((d) => d.date))];
    let min = 0;
    let max = dateArr.length - 1;
    let currentDate = dateArr[max];
    let currentDataType = d3
      .select('input[name="data-type"]:checked')
      .attr('value');

    const geoData = topojson.feature(mapData, mapData.objects.states).features;

    const width = +d3.select('.chart-container').node().offsetWidth;
    const height = 300;

    //INIT DISPLAY
    createMap(width, (width * 4) / 5);
    drawMap(geoData, data, currentDate, currentDataType);

    createPie(width, height);
    drawPie(data, currentDate, currentDataType);

    createLine(width, height);
    drawLine(data, currentDataType, '');

    //UPDATE CHART WHEN INPUT CHANGE
    //RANGE INPUT FOR YEAR
    d3.select('#date')
      .attr('min', min)
      .attr('max', max)
      .attr('value', max)
      .on('input', () => {
        currentDate = dateArr[+d3.event.target.value];

        drawMap(geoData, data, currentDate, currentDataType);
        drawPie(data, currentDate, currentDataType);
      });

    //RADIO INPUT FOR DATA TYPE
    d3.selectAll('input[name="data-type"]').on('change', () => {
      currentDataType = d3.event.target.value;

      let active = d3.select('.active').data()[0].properties.state;
      let state = active || '';

      drawMap(geoData, data, currentDate, currentDataType);
      drawPie(data, currentDate, currentDataType);
      drawLine(data, currentDataType, state);
    });

    //TOOLTIP
    d3.selectAll('svg').on('mousemove touchmove', updateTooltip);

    function updateTooltip() {
      const tooltip = d3.select('.tooltip');
      const dataType = d3.select('input:checked').property('value');
      const date = dateArr[+d3.select('#date').property('value')];

      //CHECK WHICH CHART
      let target = d3.select(d3.event.target);

      let isState = target.classed('state');
      let isArc = target.classed('arc');
      let isLine = target.classed('line');

      //GET DATA BASED ON CHART
      let data;
      //Map
      if (isState) data = target.data()[0].properties;
      //Line
      if (isLine) {
      }
      //Pie
      let region = '';
      let percentage = '';
      if (isArc) {
        data = target.data()[0].data;

        region = `<p>Region: ${getRegion(data.state)}</p>`;
        percentage = `<p>Percentage of total ${dataType}: ${getPercentage(
          target.data()[0]
        )}</p>`;
      }

      //POSITION
      tooltip
        .style('opacity', +(isState || isArc || isLine))
        .style('left', `${d3.event.pageX - tooltip.node().offsetWidth / 2}px`)
        .style('top', `${d3.event.pageY - tooltip.node().offsetHeight - 10}px`);

      //DISPLAY DATA
      if (data) {
        tooltip.html(`
          ${region}
          <p>State: ${data.state}</p>
          <p>Cases: ${data.cases}</p>
          <p>Deaths: ${data.deaths}</p>
          ${percentage}
        `);
      }
    }
  });

function getPercentage(d) {
  let angle = d.endAngle - d.startAngle;
  let fraction = (angle / (Math.PI * 2)) * 100;
  return `${fraction.toFixed(2)}%`;
}
