let input_data;
let scatter_plot;
let bar_chart;
let filter = []; //残っているデータ(今表示するデータ)を格納



 d3.csv("https://k-kiyama.github.io/InfoVis2021/final/finalTask_dataSet2020.csv")
//d3.csv("finalTask_data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.time = +d.time;
            d.date = +d.date;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['神戸市中央区','神戸市東灘区','神戸市灘区','神戸市兵庫区','神戸市北区','神戸市長田区','神戸市須磨区','神戸市垂水区','神戸市西区']);

        line_chart = new LineChart( {
            parent: '#drawing_region_linechart',
            width: 660,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: '日付',
            ylabel: '',
            cscale: color_scale
        }, input_data );
        line_chart.update();

        bar_chart1 = new BarChart1( {
            parent: '#drawing_region_barchart1',
            width: 400,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'time[時]',
            ylabel: '',
            cscale: color_scale
        }, input_data );
        bar_chart1.update();

        bar_chart2 = new BarChart2( {
            parent: '#drawing_region_barchart2',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Whether',
            ylabel: '',
            cscale: color_scale
        }, input_data );
        bar_chart2.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        line_chart.data = input_data;
    }
    else {
       line_chart.data = input_data.filter( d => filter.includes( d.date ) );
    }
    line_chart.update();
}


