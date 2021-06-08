let input_data;
let scatter_plot;
let bar_chart;
let filter = []; //残っているデータ(今表示するデータ)を格納

d3.csv("https://k-kiyama.github.io/InfoVis2021/final/finalTask.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.発生時間 = +d.発生時間;
            d.発生年月日 = +d.発生年月日;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['神戸市中央区','神戸市東灘区','神戸市灘区','神戸市兵庫区','神戸市北区','神戸市長田区','神戸市須磨区','神戸市垂水区','神戸市西区']);

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Sepal length [cm]',
            ylabel: 'Sepal width [cm] ',
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Species',
            cscale: color_scale
        }, input_data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
