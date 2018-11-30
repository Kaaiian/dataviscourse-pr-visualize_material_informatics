
/*let votePercentageChart = new VotePercentageChart();

let tileChart = new TileChart();

let shiftChart = new TrendChart();

let electoralVoteChart = new ElectoralVoteChart(shiftChart);*/

let act_vs_pre = new Act_Vs_Pre();
let linegraph = '';
let info = new Info();
let tsne = new TSNE();
// let tsne = new TSNE();

//load the data corresponding to all the election years
//pass this data and instances of all the charts that update on year selection to yearChart's constructor
d3.csv("data/ptable.csv").then(ptable => {
    console.log(ptable);
    //Domain definition for global color scale
    function rangefuc(start, end, len) {
        var step = Math.floor((end - start) / len)
        return Array(len).fill().map((_, idx) => start + (idx * step))
    }
      let domain1 = rangefuc(0,1800,13);
      var domain =  [-100, 1, 10, 40, 80, 200, 500, 1000 ,1600];
      console.log(domain);

    //Color range for global color scale
    let range = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'];

    //ColorScale be used consistently by all the charts
    var colorScale = d3.scaleLinear()
        .domain(domain)
        .range(range);
            
    let periodic_table = new Periodic_table(ptable, act_vs_pre, linegraph, info, tsne);
    periodic_table.update(colorScale);
});
