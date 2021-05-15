d3.csv("https://K-Kiyama.github.io/InfoVis2021/W08/Data_task3.csv")
    .then( data => {
        data.forEach( d => { d.value += d.value;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:40, right:20, bottom:40, left:50},
            radius: Math.min( width, height ) / 2 
        };

        const Pie_chart = new PieChart( config, data );
        Pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width : config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .attr('transform', `translate(${width/2}, ${height/2})`);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0])

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.xaxis );

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`)
            .call( self.yaxis );

        self.pie = d3.pie()
            .value(self.data, d => d.value );

        self.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(self.radius);

        self.xlabel = self.chart.append("text")
                        .attr('transform', `translate(0, ${self.inner_height})`)
                        .attr("x", self.inner_width/2)
                        .attr("y", 35)
                        .text("x");

        self.ylabel = self.chart.append("text")
                        .attr('transform', `translate(0, 0)`)
                        .attr('transform', 'rotate(-90)')
                        .attr("x", -self.inner_height/2)
                        .attr("y", -35)
                        .text("y");

        self.title = self.chart.append("text")
                        .attr('transform', `translate(0, 0)`)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "20pt")
                        .attr('font-weight', 'bold')
                        .attr("x", self.inner_width/2)
                        .attr("y", 0)
                        .text("Test data");
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.xscale.domain( [xmin, Math.max(xmax, ymax)] );
        self.yscale.domain( [ymin, Math.max(xmax, ymax)] );


        self.render();
    }

    render() {
        let self = this;
        
        self.chart.selectAll("pie")
            .data( pie(self.data) )
            .enter()
            .append("path")
            .attr('fill', 'black')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
       
    }
}
