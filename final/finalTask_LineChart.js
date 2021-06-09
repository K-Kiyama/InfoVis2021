class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleTime()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)
            .tickSize(5)
            .tickFormat(d3.timeFormat("%Y/%m/%d"))
            .tickPadding(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text( self.config.xlabel );

        const ylabel_space = 45;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );

    }

    update() {
        let self = this;
        var timeparser = d3.timeParse("%Y/%m/%d");

        const data_map = d3.rollup( self.data, v => v.length, d => d.date );
        console.log(self.data);
        self.aggregated_data = Array.from( data_map, ([key,count]) => ({key,count}) );
        self.aggregated_data.sort((a, b) => new Date(a.key) - new Date(b.key));
        self.aggregated_data = self.aggregated_data.map(function(d){
            return {key:timeparser(d.key), count:d.count};
        });

        console.log(self.aggregated_data);
       
        self.cvalue = d => d.key;
        self.xvalue = d => d.key;
        self.yvalue = d => d.count;


        const xmin = d3.min( self.aggregated_data.map( function(d){return d.key;}));
        const xmax = d3.max( self.aggregated_data.map( function(d){return d.key;} ));
        self.xscale.domain( [ d3.min(self.aggregated_data.map( function(d){return d.key;} ) ), d3.max(self.aggregated_data.map( function(d){return d.key;}))]);
    
        const ymin = d3.min( self.aggregated_data, self.yvalue );
        const ymax = d3.max( self.aggregated_data, self.yvalue );
        self.yscale.domain( [ymax, ymin] );

        self.render();
    }

    render() {
        let self = this;

        self.line = d3.line()
            .x( d => self.xscale(self.xvalue(d)) )
            .y( d => self.yscale(self.yvalue(d)) );

        self.area = d3.area()
            .x( d => self.xscale(self.xvalue(d)) )
            .y1( d => self.yscale(self.yvalue(d)) )
            .y0( self.yscale(0) );

        // self.chart.append("path")
        //     .attr('d', self.line(self.aggregated_data))
        //     .attr("stroke", 'none' )
        //     .attr("fill", "black" );
        // self.chart.append("path")
        //     .attr('d', self.area(self.aggregated_data))
        //     .attr("stroke", 'none' )
        //     .attr("fill", "blue" );

        let circles = self.chart.selectAll("circle")
            .data(self.aggregated_data)
            .join('circle');

        const circle_color = 'steelblue';
        const circle_radius = 3;
        circles
            .attr("r", circle_radius )
            .attr("cx", d => self.xscale( self.xvalue(d) ) )
            .attr("cy", d => self.yscale( self.yvalue(d) ) )
            //.attr("fill","none" );
            .attr("fill", d => self.config.cscale( self.cvalue(d) ) );

        circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${self.xvalue(d)}</div>(${self.yvalue(d)})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}
