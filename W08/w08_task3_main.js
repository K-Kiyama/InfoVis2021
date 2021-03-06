d3.csv("https://k-kiyama.github.io/InfoVis2021/W08/Data_task3.csv")
    .then( data => {
        data.forEach( d => { d.percent = +d.percent; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:40, right:20, bottom:40, left:50},
            radius: 128
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
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
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            radius: config.radius || 100
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

       self.title = self.svg.append("text")
                        .attr("font-size", "15pt")
                        .attr('font-weight', 'bold')
                        .attr("text-anchor", "middle")
                        .attr("x", self.config.width/2)
                        .attr("y", self.config.margin.top + 30)
                        .text("Pickled scallion production in Japan(2018)");
    }

    update() {
        let self = this;

        self.pie = d3.pie()
            .sort(null)
            .value( d => d.percent );

        self.arc = d3.arc()
            .innerRadius(self.config.radius/3)
            .outerRadius(self.config.radius);

        self.color = d3.scaleOrdinal(d3.schemeSet3); 

        self.render();
    }

    render() {
        let self = this;
        
         self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', d => self.color(d.data.Prefecture))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.chart.selectAll('text')
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .attr("transform", d => "translate(" + self.arc.centroid(d) + ")")
            .attr("font-size", "10pt")
            .attr("fill", "black")
            .attr('font-weight', '800')
            .attr("dy", "10px")
            .attr("text-anchor", "middle")
            .text(d => d.data.Prefecture + " (" + d.data.percent + "%)");
       
    }
}
