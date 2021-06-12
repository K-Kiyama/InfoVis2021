let input_data;
let scatter_plot;
let filter1 = []; //残っているデータ(今表示するデータ)を格納
let filter2 = [];



 d3.csv("https://k-kiyama.github.io/InfoVis2021/final/finalTask_dataSet2019-2020.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.time = +d.time;
            
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );

        line_chart = new LineChart( {
            parent: '#drawing_region_linechart',
            width: 1024,
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
            xlabel: '時刻',
            ylabel: '',
            cscale: color_scale
        }, input_data );
        bar_chart1.update();

        bar_chart2 = new BarChart2( {
            parent: '#drawing_region_barchart2',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: '天候',
            ylabel: '',
            cscale: color_scale
        }, input_data );
        bar_chart2.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter(F_data=[],id = 0) {
    if(id == 0){F_data = input_data;}
    //var filter_data[] = F_data;


    if ( filter1.length == 0 && filter2.length == 0 ) {
        line_chart.data = F_data;
    }
    else  if ( filter2.length == 0 ){
       line_chart.data = F_data.filter(d => filter1.includes( d.time ) );
    }
    else if ( filter1.length == 0 ){
        line_chart.data = F_data.filter(d => filter2.includes( d.weather ) );
    }
    else {
        line_chart.data = F_data.filter(d => (filter1.includes( d.time ) && filter2.includes( d.weather )));
    }
    line_chart.update();
}

function Select(){
    // console.log(filter1);
    // console.log(filter2);
    var filter_data = input_data;

    // console.log(accidentSelect.value);
    // console.log(yearSelect.value);

    if(accidentSelect.value == 1){
        filter_data = input_data.filter(function(d){
            return d.accident == "負傷";
        });
    } else if(accidentSelect.value == 2){
        filter_data = input_data.filter(function(d){
            return d.accident == "死亡";
        });
    } else if(accidentSelect.value == 0){
         filter_data = input_data;
        }

    if(yearSelect.value == 1){
            filter_data = filter_data.filter(function(d){
                return d.date.substr(0, 4) == "2019";
            });
        } else if(yearSelect.value == 2){
            filter_data = filter_data.filter(function(d){
                return d.date.substr(0, 4) == "2020";
            });
        } else {
             filter_data = filter_data;
            }
    bar_chart1.data = filter_data;
    bar_chart2.data = filter_data;
    bar_chart1.update();
    bar_chart2.update();

    Filter(filter_data,1);
}

let accidentSelect = document.getElementById('accident');
accidentSelect.addEventListener('change', Select);

let yearSelect = document.getElementById('year');
yearSelect.addEventListener('change', Select); 

// function clickBtn(){

//     var num = document.getElementById("month").value;
//     console.log(num);

//     //var instant_data = input_data;
   
//     if(num =="0"){
//         line_chart.data = input_data;
//     }
//     else {
//         line_chart.data  = input_data.filter(function(d){

//             if( d.date.substr(6,1) != "/" ){
//                 if (d.date.substr(5,2) == num) {
//                     console.log(d.date.substr(5,2) );
//                     return 1;
//                 } else {
//                  console.log(d.date.substr(5,2) );
//                     return 0; 
//                 }
//             } else {
//                 if (d.date.substr(5,1) == num) {
//                     console.log(d.date.substr(5,1) );
//                     return 1;
//                 } else {
//                  console.log(d.date.substr(5,1) );
//                     return 0; 
//                 }
//             }
//         } );
//     }
//     console.log(instant_data);
//         //line_chart.data = instant_data;
//         line_chart.update();
//     }


