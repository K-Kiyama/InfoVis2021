d3.csv("https://K-Kiyama.github.io/InfoVis2021/W08/Data_task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });

       
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:40, right:20, bottom:40, left:120}
        };

        const Bar_plot = new BarPlot( config, data );
        Bar_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
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
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.value)])
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.label))
            .range( [0, self.inner_height] )
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.xaxis );

        self.yaxis_group = self.chart.append('g')
            //.attr('transform', `translate(0, 0)`)
            .call( self.yaxis );

        self.xlabel = self.chart.append("g")
                        .attr('transform', `translate(0, ${self.inner_height})`)
                        .append("text")
                        .attr("x", 160)
                        .attr("y", 35)
                        .text("X-label");

        self.ylabel = self.chart.append("g")
                        .attr('transform', `translate(0, 0)`)
                        .attr('transform', 'rotate(-90)')
                        .append("text")
                        .attr("x", -110)
                        .attr("y", -55)
                        .text("Y-label");

        self.title = self.chart.append("g")
                        .attr('transform', `translate(0, 0)`)
                        .append("text")
                        .attr("text-anchor", "middle")
                        .attr("font-size", "20pt")
                        .attr('font-weight', 'bold')
                        .attr("x", 190)
                        .attr("y", -5)
                        .text("Title");
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.value );
        const xmax = d3.max( self.data, d => d.value );

        const ymin = 0
        const ymax = self.data.length;
        //self.xscale.domain( [xmin-20, Math.max(xmax, ymax)+10] );
        //self.yscale.domain( [ymin-20, Math.max(xmax, ymax)+10] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0 )
            .attr("y", d => self.yscale( d.label ) )
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.xaxis );

        self.yaxis_group
            //.attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.yaxis );
    }
}
