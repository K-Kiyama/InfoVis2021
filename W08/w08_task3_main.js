d3.csv("https://K-Kiyama.github.io/InfoVis2021/W08/Data_task1.csv")
    .then( data => {
        data.forEach( d => { d.value += d.value;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:40, right:20, bottom:40, left:50},
            radius: 128
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
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            radius: config.radius || 10
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            //.attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
            
        self.pie = d3.pie()
            .value( d => d.value );

        self.arc = d3.arc()
            .innerRadius(10)
            .outerRadius(self.radius);

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
        

        self.render();
    }

    render() {
        let self = this;
        
        self.chart.selectAll("pie")
            .data( self.pie(self.data) )
            .enter()
            .append("path")
            .attr('d', self.arc)
            .attr('fill', 'black')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
       
    }
}
