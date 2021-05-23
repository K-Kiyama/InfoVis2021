d3.csv("https://K-Kiyama.github.io/InfoVis2021/W10/Data_task2_ave.csv") //(http://www.data.jma.go.jp/obd/stats/etrn/view/monthly_s3.php?prec_no=63&block_no=47770)より引用
    .then( data => {
        data.forEach( d => { d.month = +d.month; d.temp = +d.temp;});

        var config = {
            parent: '#drawing_region',
            width: 330,
            height: 330,
            margin: {top:40, right:20, bottom:40, left:50}
        };

        const Line_chart = new LineChart( config, data );
        Line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function month(a){
    switch(a){
        case 1:
            return "Jan.";
            break;
        case 2:
            return "Feb.";
            break;
        case 3:
            return "Mar.";
            break;
        case 4:
            return "Apr.";
            break;
        case 5:
            return "May.";
            break;
        case 6:
            return "June.";
            break;
        case 7:
            return "July";
            break;
        case 8:
            return "Aug.";
            break;
        case 9:
            return "Sept.";
            break;
        case 10:
            return "Oct.";
            break;
        case 11:
            return "Nov.";
            break;
        case 12:
            return "Dec.";
            break;
    }
}

class LineChart {

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
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0])

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(12)
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

        self.line = d3.line()
            .x( d => self.xscale(d.month) )
            .y( d => self.yscale(d.temp) );

        self.area = d3.area()
            .x( d => self.xscale(d.month) )
            .y1( d => self.yscale(d.temp) )
            .y0( self.yscale(0) );

        self.xlabel = self.chart.append("text")
                        .attr('transform', `translate(0, ${self.inner_height})`)
                        .attr("x", self.inner_width/2)
                        .attr("y", 35)
                        .text("month");

        self.ylabel = self.chart.append("text")
                        .attr('transform', `translate(0, 0)`)
                        .attr('transform', 'rotate(-90)')
                        .attr("x", -(self.inner_height/2 + 30))
                        .attr("y", -35)
                        .text("temperarure");

        self.title = self.chart.append("text")
                        .attr('transform', `translate(0, 0)`)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "13pt")
                        .attr('font-weight', 'bold')
                        .attr("x", self.inner_width/2)
                        .attr("y", -10)
                        .text("Average temperature in Kobe in 2020");
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.month );
        const xmax = d3.max( self.data, d => d.month );

        const ymin = d3.min( self.data, d => d.temp );
        const ymax = d3.max( self.data, d => d.temp );
        self.xscale.domain( [xmin-0.5, xmax+0.5] );
        self.yscale.domain( [ymin-0.3, ymax+3] );


        self.render();
    }

    render() {
        let self = this;

        self.chart.append("path")
            .attr('d', self.line(self.data))
            .attr("stroke", 'black' )
            .attr("fill", 'none');

        self.chart.append("path")
            .attr('d', self.area(self.data))
            .attr("stroke", 'none' )
            .attr("fill", '#a2d0db');
        
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.month))
            .attr("cy", d => self.yscale(d.temp))
            .attr("r", 4)
            .classed("cirStyle",true)
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Temperature in ${month(d.month)}</div>${d.temp} degrees`);
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
