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
    let currentDate = dateArr[88];
    let currentDataType = d3
      .select('input[name="data-type"]:checked')
      .attr('value');

    const geoData = topojson.feature(mapData, mapData.objects.states).features;

    const width = +d3.select('.chart-container').node().offsetWidth;

    //INIT DISPLAY
    createMap(width, (width * 4) / 5);
    drawMap(geoData, data, currentDate, currentDataType);

    //UPDATE CHART WHEN INPUT CHANGE
    //RANGE INPUT FOR YEAR
    d3.select('#date')
      .attr('min', min)
      .attr('max', max)
      .attr('value', max)
      .on('input', () => {
        currentDate = dateArr[+d3.event.target.value];
        drawMap(geoData, data, currentDate, currentDataType);
      });

    //RADIO INPUT FOR DATA TYPE
    d3.selectAll('input[name="data-type"]').on('change', () => {
      currentDataType = d3.event.target.value;
      drawMap(geoData, data, currentDate, currentDataType);
    });
  });
