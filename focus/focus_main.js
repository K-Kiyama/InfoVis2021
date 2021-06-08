viewof focus = {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, focusHeight])
        .style("display", "block");
  
    const brush = d3.brushX()
        .extent([[margin.left, 0.5], [width - margin.right, focusHeight - margin.bottom + 0.5]])
        .on("brush", brushed)
        .on("end", brushended);
  
    const defaultSelection = [x(d3.utcYear.offset(x.domain()[1], -1)), x.range()[1]];
  
    svg.append("g")
        .call(xAxis, x, focusHeight);
  
    svg.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area(x, y.copy().range([focusHeight - margin.bottom, 4])));
  
    const gb = svg.append("g")
        .call(brush)
        .call(brush.move, defaultSelection);
  
    function brushed({selection}) {
      if (selection) {
        svg.property("value", selection.map(x.invert, x).map(d3.utcDay.round));
        svg.dispatch("input");
      }
    }
  
    function brushended({selection}) {
      if (!selection) {
        gb.call(brush.move, defaultSelection);
      }
    }
  
    return svg.node();
  }

  update = {
    const [minX, maxX] = focus;
    const maxY = d3.max(data, d => minX <= d.date && d.date <= maxX ? d.value : NaN);
    chart.update(x.copy().domain(focus), y.copy().domain([0, maxY]));
  }

  data = Object.assign(d3.csvParse(await FileAttachment("aapl.csv").text(), d3.autoType).map(({date, close}) => ({date, value: close})), {y: "↑ Close $"})

  area = (x, y) => d3.area()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.value))

    x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

    xAxis = (g, x, height) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    yAxis = (g, y, title) => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".title").data([title]).join("text")
        .attr("class", "title")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(title))

    margin = ({top: 20, right: 20, bottom: 30, left: 40})

    height = 440

    focusHeight = 100

    d3 = require("d3@6")