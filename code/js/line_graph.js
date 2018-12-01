class Linegraph {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 5, right: 5, bottom: 15, left: 5};
        let line_chart = d3.select("#Line_chart").classed("line_graph_view", true);
        this.svgBounds = line_chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.width/4 - this.margin.top - this.margin.bottom;
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
        let dict_name =[]
        let dict_number = []
        selected.forEach(function(item){
            let temparray = item.elements.split(" ");
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
            dict_name.push(key)
            dict_number.push(avearge);
            count++
        });
        let dict_axis = [Math.floor(min_d),Math.floor(max_d) +1]
        let domain1 = rangefuc(0,dict_axis[1],count);
        domain1.push(dict_axis[1]);


        d3.select("#line_svg").selectAll("*").remove();
        let widthCur = parseInt((this.svgWidth*0.95)/(count));
        let heightCur =parseInt(this.svgHeight*0.75);

        let range1 = ['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486'];
        let domain2 = [0,0.1,0.2,0.5,0.9,2,3,8]
        let colorScale1 = d3.scaleLinear()
            .domain(domain2)
            .range(range1);
        var resibar = d3.select("#line_svg")
        resibar.append('g').attr('id', 'title_of_resid_bar');
        let rtitle_group = resibar.select('#title_of_resid_bar');
        rtitle_group.append('text')
            .attr('x', 0)
            .attr('y', heightCur*0.1)
            .style('font-size', d=>heightCur*0.1+'px')
            .style('fill','black')
            .text(d=>"Average residual for selection (grouped by element): ");

        resibar.append('g').attr('id', 'body_of_graph');
    
        let r_group = resibar.select('#body_of_graph');
        let r_bars =  r_group.selectAll('rect').data(dict_number);
        r_bars.enter()
            .append('rect')
            .attr('x', (d,i)=>this.svgWidth*0.05+i*widthCur)
            .attr('y', d=>this.svgHeight*0.2+heightCur-d*heightCur/dict_axis[1])
            .attr('width',widthCur)
            .attr('height', d=>d*heightCur/dict_axis[1])
            .style('fill', d=> colorScale1(d))
            .style( 'stroke', '#101010')
            .style('stroke-width',1);

        let r_Text =  r_group.selectAll('text').data(dict_name);
        let size = Math.min(this.svgHeight*0.04,widthCur*0.5)
        r_Text
            .enter()
            .append('text')
            .attr("y", this.svgHeight)
            .attr("x", (d,i)=>this.svgWidth*0.05+i*widthCur+widthCur*0.2)
            .style('font-size', d=> size+'px')
            .text(d=> d);


        let yScale = d3.scaleLinear()
            .domain([Math.max.apply(null, domain1), 0])     
            .range([this.svgHeight*0.2, this.svgHeight*0.95])
            .nice()

        let yAxis_left = d3.axisLeft(yScale).tickSizeOuter(0);

        resibar.append('g').classed('axis', true)
                .attr('id', 'y_axis')
                .attr('transform', "translate("+this.svgWidth*0.05+"," +0 + ")").call(yAxis_left)
                .style('font-size', d=>this.svgHeight*0.05+'px')
                .style('text-anchor', 'middle');
        let rtext_barsy = resibar.select('#y_axis').selectAll('g').selectAll('text');
        rtext_barsy.attr('x', -this.svgWidth*0.02)
        let rlines_barsy = resibar.select('#y_axis').selectAll('g').selectAll('line');
        rlines_barsy.attr('x2', -this.svgWidth*0.01)
        


        function rangefuc(start, end, len) {
            var step = ((end - start) / len)
            return Array(len).fill().map((_, idx) => start + (idx * step))
        }

    }
}