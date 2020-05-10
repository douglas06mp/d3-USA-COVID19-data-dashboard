d3.queue()
  .defer(d3.json, 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json#')
  .defer(d3.csv, './data/us-states.csv', (row) => {
    return {
      date: row.date,
      state: row.state,
      cases: +row.cases,
      death: +row.deaths,
    };
  })
  .await((err, mapData, data) => {
    if (err) throw err;

    console.log(data);
    dateArr = new Set(data.map((d) => d.date));
    let minmax = [0, dateArr.size];
    let currentDate = dateArr[0];
    let currentDataType = d3
      .select('input[name="data-type"]:checked')
      .attr('value');

    const geoData = topojson.feature(mapData, mapData.objects.states).features;

    const width = +d3.select('.chart-container').node().offsetWidth;
    const height = 300;
  });
