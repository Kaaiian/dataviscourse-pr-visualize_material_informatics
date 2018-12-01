
let act_vs_pre = new Act_Vs_Pre();
let linegraph = new Linegraph();
let info = new Info();
let tsne = new TSNE(linegraph);
// let tsne = new TSNE();

//load the data corresponding to all the elements
//pass this data and instances of all the charts that update on element selection to periodic's constructor
d3.csv("data/ptable.csv").then(ptable => {
    var domain =  [-100, 1, 10, 40, 80, 200, 500, 1000 ,1600];

    //Color range for global color scale
    let range = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'];

    //ColorScale be used consistently by all the charts
    var colorScale = d3.scaleLinear()
        .domain(domain)
        .range(range);
            
    let periodic_table = new Periodic_table(ptable, act_vs_pre, linegraph, info, tsne);
    periodic_table.update(colorScale);
});
