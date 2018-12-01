/** Class implementing the tileChart. */
class Periodic_table {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    
    constructor(ptable, act_vs_pre,line_graph, info, tsne){
        //Create the svg and margin for Periodic_table.
        this.margin = {top: 10, right: 5, bottom: 20, left: 5};
        let divyearChart = d3.select("#Periodic_Table_Chart").classed("ptable_view", true);
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth*3/5);
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
        this.ptable = ptable;
        this.act_vs_pre = act_vs_pre;
        this.line_graph = line_graph;
        this.info = info;
        this.tsne = tsne;
        this.selectedElements = []
        this.dict = []
        this.dict_axis = []
        this.barHeight_list = []
        this.text = "All Elements"

        /* THIS PREPOPULATES THE Act VS Pred Graph while making the Ptable */
        d3.csv("data/experimental_predictions.csv").then(element_data => {
            this.act_vs_pre.update(element_data);
            this.tsne.update(element_data);
        });

        let legendHeight = 20;
        //add the svg to the div
        let legend = d3.select("#legend").classed("tile_view",true);

        // creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");
    };
    


    /**
     * update the element which is selected or hoverOver
     *
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (colorScale){

        this.svg.selectAll("*").remove();
        let widthCur = parseInt(this.svgWidth/20);
        let heightCur =parseInt(this.svgHeight/12);
        var domain1 =  [0, 1, 10, 40, 80, 200, 500, 1000 ,1600];

        var resid_bars = this.svg
            .append("g")
            .attr("id", "resid_bars");


        var ptable_bars = this.svg
            .append("g")
            .attr("id", "ptable_bars");

        var color_bars = this.svg
            .append("g")
            .attr("id", "color_bars");

        //Create the colorbars which represent the colorscale.
        color_bars.append('g').attr('id', 'title_of_colors_bar');
        let title_group = color_bars.select('#title_of_colors_bar');
        title_group.append('text')
            .attr('x', widthCur*10.5)
            .attr('y', heightCur*0.3)
            .style('font-size', d=>heightCur*0.2+'px')
            .style('fill','black')
            .style('text-anchor', 'middle')
            .text(d=>"Number of Formulae Containing Each Element");

        //Make the bars for the colorbars, and the length of bar represent the frequence.
        let c_bars =  color_bars.selectAll('rect').data(domain1);
        c_bars.enter()
            .append('rect')
            .attr('x', (d,i)=>widthCur*9+i*widthCur/3)
            .attr('y', heightCur*0.6)
            .attr('width',widthCur/3)
            .attr('height', function(d){if(d>1){return d/30*heightCur/20+heightCur/4}else if(d===0){return heightCur/8} return heightCur/6;})
            .style('fill', d=>colorScale(d))
            .style( 'stroke', '#101010')
            .style('stroke-width',1);

        var x = d3.scaleQuantile().range([0, widthCur*1/3,widthCur*2/3,widthCur*3/3,widthCur*4/3,widthCur*5/3,widthCur*6/3,widthCur*7/3,widthCur*8/3]);
        var xDomain = x.domain(domain1);
        let xAxis = d3.axisTop(x).tickSizeOuter(0);
            
        color_bars.append('g').classed('axis', true)
              .attr('transform', "translate("+(widthCur*9-1)+"," + heightCur*0.6 + ")").call(xAxis)
              .style('font-size', d=>heightCur*0.16+'px')
              .style('text-anchor', 'middle');
        let text_bars = color_bars.selectAll('g').selectAll('g').selectAll('text');
        text_bars.attr('y', -heightCur*0.1)
        let lines_bars = color_bars.selectAll('g').selectAll('g').selectAll('line');
        lines_bars.attr('y2', -heightCur*0.06)


        
        let bars = ptable_bars.selectAll('g').data(this.ptable).enter().append('g');

        
        //Make the bars for each elements.

        bars
            .append("rect")
            .attr("y", d=> d.row*heightCur)
            .attr("x", d=> d.column*widthCur)
            .attr('height',heightCur*0.9)
            .attr('width', widthCur*0.9 )  
            .attr('class',"tile")      
            .style('fill',d =>colorScale(d.count));

        

        //Make the text for each elements which will be correlated with the bars.
        bars
            .append('text')
            .attr("y", d=> d.row*heightCur+heightCur*0.5)
            .attr("x", d=> d.column*widthCur)
            .attr("dx", d=> widthCur*0.05)
            .attr('class', d => d.symbol + " tilestext")
            .style('font-size', d=>heightCur*0.4+'px')
            .style('fill', function(d){if(d.count > 0){ return '#565656'} return 'black'})
            .text(d =>  d.symbol)

        
        
        bars
            .append('text')
            .attr("y", d=> d.row*heightCur+heightCur*0.7)
            .attr("x", d=> d.column*widthCur)
            .attr("dx", d=> widthCur*0.05)
            .attr('class', "tilestext")
            .attr('text-anchor', 'start')
            .style('font-size', d=>heightCur*0.2+'px')
            .style('fill', function(d){if(d.count > 0){ return '#565656'} return 'black'})
            .text(d =>  d.name);

        //Set the clich mouseover and mouse out event for every elements' bars.
        bars            
            .on('click', onClick)
            .on("mouseover", hoverOver)
            .on("mouseout", hoverOff);

        let legendQuantile = d3.legendColor()
            .shapeWidth((this.svgWidth - 2*this.margin.left - this.margin.right)/12)
            .cells(20)
            .orient('vertical')
            .labelFormat(d3.format('.1r'))
            .scale(colorScale);


        let that = this
        
        //The click function will highlight the element bar which is selected.
        function onClick(d){
                
            function removeA(arr) {
                var what, a = arguments, L = a.length, ax;
                while (L > 1 && arr.length) {
                    what = a[--L];
                    while ((ax= arr.indexOf(what)) !== -1) {
                        arr.splice(ax, 1);
                    }
                }
                return arr;
            }

            let selected = d3.select(this).select('rect')
            if (that.selectedElements.includes(d.symbol)){
                that.selectedElements = removeA(that.selectedElements, d.symbol)
                selected.classed("highlighted",false);
            }else{
                that.selectedElements.push(d.symbol)
                selected.classed("highlighted",true);
            }
            updateBarsCharts()
            that.act_vs_pre.onClick(d, that)
            that.tsne.onClick(d, that)
        }   

        function hoverOver(d) {
            that.act_vs_pre.hoverOver(d, that)
            that.tsne.hoverOver(d, that)
        }
            
        function hoverOff(d) {
            that.act_vs_pre.hoverOff(d, that)
            that.tsne.hoverOff(d, that)
        }

        function notclick() {
            var selectedCircle = d3.select(this).select('rect')
            selectedCircle.classed("highlighted",false);
        }

        // updateBarsCharts makes the residual bars with the residual data.
        function updateBarsCharts(){
          
            if(that.selectedElements.length == 0){
                that.dict = []
                d3.csv("data/experimental_predictions.csv").then(temp => {update_dict(temp);});
                that.text = "All Elements. "
            }
            else{
                that.dict = []
                that.text = "";
                that.selectedElements.forEach(d => {
                    that.text =that.text +d+", "
                    d3.csv("data/element_data/"+d+".csv").then(data => {
                        update_dict(data);});
                        
                })
            }
            that.text = that.text.slice(0, -2) + '.';
            window.setTimeout(update_axis,500);
        };

        // update_dict read the data about the selected elements.
        function update_dict(data){
            data.forEach(function(item){
                that.dict[item.formula] = item;
           });
        };

        // update_axis find the max and min about the selected elements's residual value and then ask to redraw the residual bars.
        function update_axis(){
            that.dict_axis = [];
            let max_d = -12;
            let min_d = 12;
            let count = 0;
            Object.keys(that.dict).forEach(function(key) {
                if(max_d < that.dict[key]['residual']){
                    max_d = that.dict[key]['residual']
                }
                if(min_d > that.dict[key]['residual']){
                    min_d = that.dict[key]['residual']
                }
                count++;
            });
            that.dict_axis = [Math.floor(min_d),Math.floor(max_d) +1]
            update_barsH(count);
            update_residView();
        };

        //update_barsH make the data which will represent the numbers of formulae in each residual range.
        function update_barsH(count){
            let how_many = 5;
            if(count >20){
                how_many = 10;
            }
            if(count >100){
                how_many = 20;
            }
            if(count >200){
                how_many = 30;
            }

            let domain1 = rangefuc(that.dict_axis[0],that.dict_axis[1],how_many);
            domain1.push(that.dict_axis[1]);
            let i = 0;
            that.barHeight_list = Array(how_many).fill(0);
            Object.keys(that.dict).forEach(function(key) {
                for(i = 0; i < domain1.length-1;i++){
                    if(that.dict[key]['residual']>= domain1[i] && that.dict[key]['residual']< domain1[i+1]){
                        that.barHeight_list[i]++;
                        i = domain1.length-1;
                    }
                }
            });
            
        };

        //update_residView will redraw the bars for each residual range and the axis.
        function update_residView(){
            that.svg.select("#resid_bars").selectAll("*").remove();
            let widthCur = parseInt(that.svgWidth/20);
            let heightCur =parseInt(that.svgHeight/12);
            let how_many = that.barHeight_list.length;
            let x_rate = widthCur*5/how_many;
            let range1 = ['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486'];
            let domain1 = [0,2,5,20,60,100,180,300]
            let colorScale1 = d3.scaleLinear()
                .domain(domain1)
                .range(range1);
            var resibar = that.svg.select("#resid_bars")
            resibar.append('g').attr('id', 'title_of_resid_bar');
            let rtitle_group = resibar.select('#title_of_resid_bar');
            rtitle_group.append('text')
                .attr('x', widthCur*5)
                .attr('y', heightCur*0.3)
                .style('font-size', d=>heightCur*0.3+'px')
                .style('fill','black')
                .style('text-anchor', 'middle')
                .text(d=>"Plot for Residual: "+that.text);
        
            let rate = (heightCur*3.2)/(Math.max.apply(null, that.barHeight_list));
    
    
            let r_bars =  resibar.selectAll('rect').data(that.barHeight_list);
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
                .domain([that.dict_axis[0], that.dict_axis[1]])
                .range([widthCur*3.5,widthCur*9])
                .nice()
            let yScale = d3.scaleLinear()
                .domain([Math.max.apply(null, that.barHeight_list), 0])     
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
        };
        

        // a helper function to create the array based on start number, end number and length of the array.
        function rangefuc(start, end, len) {
            var step = ((end - start) / len)
            return Array(len).fill().map((_, idx) => start + (idx * step))
        }



            
    };

    


}