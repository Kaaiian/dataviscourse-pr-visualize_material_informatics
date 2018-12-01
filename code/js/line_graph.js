class Linegraph {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 5, right: 5, bottom: 5, left: 5};
        let line_chart = d3.select("#Line_chart").classed("line_graph_view", true);
        this.svgBounds = line_chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.width - this.margin.top - this.margin.bottom;
        this.svg = line_chart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr('id', 'line_svg')

        this.dictresid = []
        this.dictnumber = []
        this.dict = []
        this.dict_axis = []
    }

    update(selected){
        let dictresid =[]
        let dictnumber = []
        let dict =[]
        selected.forEach(function(item){
            let temparray = item.elements.split(" ");
            console.log(temparray);
            temparray.forEach( function(ele){
                if(dictresid.hasOwnProperty(ele)){
                    dictresid[ele] = dictresid[ele]+Math.abs(item.residual);
                    dictnumber[ele]++;
                }
                else{
                    dictresid[ele] = Math.abs(item.residual);
                    dictnumber[ele] = 1;
                }
            });
        });
        console.log(dictnumber);
        console.log(dictresid);
        let max_d = -12;
        let min_d = 12;
        let count = 0;
        Object.keys(dictresid).forEach(function(key) {
            let avearge = dictresid[key]/dictnumber[key]
            if(max_d < avearge){
                max_d = avearge
            }
            if(min_d > avearge){
                min_d = avearge
            }
            dict[key] = avearge;
            count++
        });
        let dict_axis = [Math.floor(min_d),Math.floor(max_d) +1]
        let domain1 = rangefuc(dict_axis[0],dict_axis[1],count);
        domain1.push(dict_axis[1]);

        console.log(domain1);



        d3.select("#line_svg").selectAll("*").remove();
        let widthCur = parseInt(svgWidth/20);
        let heightCur =parseInt(svgHeight/12);
        let how_many = barHeight_list.length;
        let x_rate = widthCur*5/how_many;
        let range1 = ['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486'];
        let domain2 = [0,2,5,20,60,100,180,300]
        let colorScale1 = d3.scaleLinear()
            .domain(domain2)
            .range(range1);
        var resibar = d3.select("#line_svg")
        resibar.append('g').attr('id', 'title_of_resid_bar');
        let rtitle_group = resibar.select('#title_of_resid_bar');
        rtitle_group.append('text')
            .attr('x', widthCur*5)
            .attr('y', heightCur*0.3)
            .style('font-size', d=>heightCur*0.3+'px')
            .style('fill','black')
            .style('text-anchor', 'middle')
            .text(d=>"Plot for Residual: "+text);
    
        let rate = (heightCur*3.2)/(Math.max.apply(null, barHeight_list));


        let r_bars =  resibar.selectAll('rect').data(barHeight_list);
        r_bars.enter()
            .append('rect')
            .attr('x', (d,i)=>widthCur*3.5+i*x_rate)
            .attr('y', d=>heightCur*3.6-d*rate)
            .attr('width',x_rate)
            .attr('height', d=>d*rate)
            .style('fill', d=> colorScale1(d))
            .style( 'stroke', '#101010')
            .style('stroke-width',1);
        r_bars.attr("transform", 
        "translate(" + widthCur + "," +heightCur + ")");

        let xScale = d3.scaleLinear()
            .domain([dict_axis[0], dict_axis[1]])
            .range([widthCur*3.5,widthCur*9])
            .nice()
        let yScale = d3.scaleLinear()
            .domain([Math.max.apply(null, barHeight_list), 0])     
            .range([heightCur*0.4, heightCur*3.6])
            .nice()
        let xAxis = d3.axisTop(xScale).tickSizeOuter(0);
        let yAxis_left = d3.axisLeft(yScale).tickSizeOuter(0);
            
        resibar.append('g').classed('axis', true)
                .attr('id', 'x_axis')
                .attr('transform', "translate("+0+"," + heightCur*3.6 + ")").call(xAxis)
                .style('font-size', d=>heightCur*0.16+'px')
                .style('text-anchor', 'middle');
        let rtext_bars = resibar.select('#x_axis').selectAll('g').selectAll('text');
        rtext_bars.attr('y', heightCur*0.16)
        let rlines_bars = resibar.select('#x_axis').selectAll('g').selectAll('line');
        rlines_bars.attr('y2', heightCur*0.06)

        resibar.append('g').classed('axis', true)
                .attr('id', 'y_axis')
                .attr('transform', "translate("+widthCur*3.5+"," +0 + ")").call(yAxis_left)
                .style('font-size', d=>heightCur*0.16+'px')
                .style('text-anchor', 'middle');
        let rtext_barsy = resibar.select('#y_axis').selectAll('g').selectAll('text');
        rtext_barsy.attr('x', -heightCur*0.16)
        let rlines_barsy = resibar.select('#y_axis').selectAll('g').selectAll('line');
        rlines_barsy.attr('x2', -heightCur*0.06)
        


        function rangefuc(start, end, len) {
            var step = ((end - start) / len)
            return Array(len).fill().map((_, idx) => start + (idx * step))
        }

    }
}