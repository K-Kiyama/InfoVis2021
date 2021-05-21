var svg = d3.select('#drawing_region')

svg.append('circle')
    .attr('cx', 50)
    .attr('cy', 50)
    .attr('r', 50)
    .attr('fill', 'steelblue')
    .transition()
    .duration(3000) // 3 sec
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 100)
    .attr('fill', 'salmon')
    .transition()
    .attr('cx', 50)
    .attr('cy', 50)
    .attr('r', 50)
    .attr('fill', 'steelblue');
