
/*let votePercentageChart = new VotePercentageChart();

let tileChart = new TileChart();

let shiftChart = new TrendChart();

let electoralVoteChart = new ElectoralVoteChart(shiftChart);*/

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
    let range = ['#f7fcfd','#fff3f3','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b'];

    //ColorScale be used consistently by all the charts
    var colorScale = d3.scaleLinear()
        .domain(domain)
        .range(range);
            
    let periodic_table = new Periodic_table(ptable);
    periodic_table.update(colorScale);
});
